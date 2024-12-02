import express from 'express';
import cors from 'cors';
import OpenAI from 'openai';
import dotenv from 'dotenv';
import axios from 'axios';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json({ limit: '50mb' })); // Increase JSON body size limit
app.use(express.urlencoded({ limit: '50mb', extended: true })); // Increase URL-encoded body size limit

const client = new OpenAI({
  apiKey: process.env.HYPERBOLIC_API_KEY,
  baseURL: 'https://api.hyperbolic.xyz/v1',
});

// Text Generation Endpoint
app.post('/generate-text', async (req, res) => {
  const { prompt, promptModel } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: 'Prompt is required' });
  }

  if (!promptModel) {
    return res.status(400).json({ error: 'Model is required' });
  }


  try {
    const response = await client.chat.completions.create({
      messages: [
        // { role: 'system', content: 'You are an AI.' },
        { role: 'user', content: prompt },
      ],
      model: promptModel,
    });

    res.json({ response: response.choices[0].message.content });
  } catch (err) {
    console.error('API Error:', err.response?.data || err.message);
    res.status(500).json({ error: err.response?.data || 'Failed to generate text' });
  }
});

// Text-to-Speech Generation Endpoint
app.post('/generate-audio', async (req, res) => {
  const { text } = req.body;

  if (!text) {
    return res.status(400).json({ error: 'Text is required' });
  }

  try {
    const response = await axios.post(
      'https://api.hyperbolic.xyz/v1/audio/generation',
      { text },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.HYPERBOLIC_API_KEY}`,
        },
      }
    );

    const base64Audio = response.data.audio;
    res.json({ audio: base64Audio });
  } catch (err) {
    console.error('Audio API Error:', err.response?.data || err.message);
    res.status(500).json({ error: err.response?.data || 'Failed to generate audio' });
  }
});

app.post('/generate-image', async (req, res) => {
  const { prompt, height = 1024, width = 1024, controlnet_image, controlnet_name, lora, cfg_scale, strength, seed, } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: 'Prompt is required' });
  }

  const encodedImage = controlnet_image;

  // Default model
  let model_name = 'SDXL1.0-base';

  // Use ControlNet model if applicable
  if (controlnet_image && controlnet_name) {
    model_name = 'SDXL-ControlNet'; // Set model supporting ControlNet
  }

  const requestBody = {
    model_name,
    prompt,
    height,
    width,
    backend: 'auto',
  };

  // Handle ControlNet-specific request
  if (controlnet_image && controlnet_name) {
    try {
      // The image is already in Base64 format, so no need to read from a file
      const base64Image = encodedImage.replace(/^data:image\/\w+;base64,/, ''); // Remove base64 prefix if present
      requestBody.controlnet_image = base64Image;
      requestBody.controlnet_name = controlnet_name;
      requestBody.cfg_scale = Math.floor(Math.random() * (50 - 1 + 1)) + 1;
      requestBody.strength = Math.random();
      requestBody.seed = Math.floor(Math.random() * (5800000 - 5200000 + 1)) + 5200000;
    } catch (err) {
      console.error('Error processing ControlNet image:', err);
      return res.status(500).json({ error: 'Failed to process ControlNet image.' });
    }
  }

  // Handle LoRA-specific request
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

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
