import express from 'express';
import cors from 'cors';
import OpenAI from 'openai';
import dotenv from 'dotenv';
import axios from 'axios'; // Use axios for the image generation request

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const client = new OpenAI({
  apiKey: process.env.HYPERBOLIC_API_KEY,
  baseURL: 'https://api.hyperbolic.xyz/v1',
});

// Text Generation Endpoint
app.post('/generate-text', async (req, res) => {
  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: 'Prompt is required' });
  }

  try {
    const response = await client.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: 'You are an expert travel guide.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      model: 'meta-llama/Meta-Llama-3.1-70B-Instruct',
    });

    res.json({ response: response.choices[0].message.content });
  } catch (err) {
    console.error('API Error:', err.response?.data || err.message);
    res.status(500).json({ error: err.response?.data || 'Failed to generate text' });
  }
});

// Image Generation Endpoint
app.post('/generate-image', async (req, res) => {
  const { prompt, height = 1024, width = 1024, controlnet_image, controlnet_name, lora } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: 'Prompt is required' });
  }

  const requestBody = {
    model_name: 'SDXL1.0-base',
    prompt,
    height,
    width,
    backend: 'auto',
  };

  // Handle ControlNet specific request
  if (controlnet_image && controlnet_name) {
    try {
      // Ensure the image is encoded as base64 before passing to the API
      const base64Image = await encodeImageToBase64(controlnet_image);  // assuming 'controlnet_image' is a URL or image path
      requestBody.controlnet_image = base64Image;
      requestBody.controlnet_name = controlnet_name;
    } catch (err) {
      return res.status(500).json({ error: 'Failed to encode controlnet image' });
    }
  }

  // Handle LoRA specific request
  if (lora) {
    requestBody.lora = lora;
  }

  try {
    const response = await axios.post(
      'https://api.hyperbolic.xyz/v1/image/generation',
      requestBody,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.HYPERBOLIC_API_KEY}`,
        },
      }
    );

    const base64Image = response.data.images[0].image;
    res.json({ image: base64Image });
  } catch (err) {
    console.error('Image API Error:', err.response?.data || err.message);
    res.status(500).json({ error: err.response?.data || 'Failed to generate image' });
  }
});

// Helper function to encode image to base64 (if needed)
const encodeImageToBase64 = (imagePath) => {
  return new Promise((resolve, reject) => {
    const fs = require('fs');
    fs.readFile(imagePath, (err, data) => {
      if (err) reject(err);
      resolve(data.toString('base64'));
    });
  });
};

// Text-to-Speech Generation Endpoint
app.post('/generate-audio', async (req, res) => {
  const { text } = req.body;

  if (!text) {
    return res.status(400).json({ error: 'Text is required' });
  }

  try {
    // Request to the Hyperbolic API for audio generation
    const response = await axios.post(
      'https://api.hyperbolic.xyz/v1/audio/generation',
      {
        text,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.HYPERBOLIC_API_KEY}`,
        },
      }
    );

    // The API returns Base64 audio; decode and send back to client
    const base64Audio = response.data.audio;
    res.json({ audio: base64Audio });
  } catch (err) {
    console.error('Audio API Error:', err.response?.data || err.message);
    res.status(500).json({ error: err.response?.data || 'Failed to generate audio' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
