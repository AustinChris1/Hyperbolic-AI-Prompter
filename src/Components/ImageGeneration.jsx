import React, { useState } from 'react';

const ImageGeneration = () => {
  const [prompt, setPrompt] = useState('');
  const [image, setImage] = useState(null); // Store the generated image
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [generationMethod, setGenerationMethod] = useState('normal'); // Track selected method
  const [loraEffects, setLoraEffects] = useState({
    Pixel_Art: 0,
    Logo: 0,
    Paint_Splash: 0,
  });
  const [controlnetImage, setControlnetImage] = useState(null); // Store ControlNet image for processing

  // Handle image upload for ControlNet
  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setControlnetImage(reader.result); // Store base64 image for ControlNet
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenerate = async () => {
    if (!prompt) {
      setError('Prompt cannot be empty');
      return;
    }

    setLoading(true);
    setError('');
    setImage(null); // Reset the image state before generating a new one

    const requestBody = {
      prompt,
      height: 1024,
      width: 1024,
      backend: 'auto',
    };

    // Handle LoRA specific request
    if (generationMethod === 'lora') {
      const lora = {};
      Object.keys(loraEffects).forEach((effect) => {
        if (loraEffects[effect] > 0) {
          lora[effect] = loraEffects[effect]; // Include only selected effects with strengths
        }
      });
      requestBody.lora = lora;
    }

    // Handle ControlNet image if selected
    if (generationMethod === 'controlnet' && controlnetImage) {
      requestBody.controlnetImage = controlnetImage;
    }

    try {
      const res = await fetch('http://localhost:5000/generate-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      if (!res.ok) {
        const errorData = await res.json();
        setError(errorData.error || 'Failed to generate image');
      } else {
        const data = await res.json();
        setImage(data.image); // Set the Base64 image string
      }
    } catch (err) {
      setError('Failed to connect to the server');
    } finally {
      setLoading(false);
    }
  };

  // Handle changing LoRA effect strengths
  const handleLoraChange = (effect, value) => {
    setLoraEffects((prevEffects) => ({
      ...prevEffects,
      [effect]: value,
    }));
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-100 py-8 px-4">
      <h1 className="text-3xl font-bold text-gray-800 mb-4">AI Image Generator</h1>

      <div className="w-full max-w-2xl bg-white shadow-md rounded-lg p-6">
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Enter your prompt here..."
          className="w-full h-32 p-4 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
        />
        
        {/* Dropdown for selecting generation method */}
        <select
          value={generationMethod}
          onChange={(e) => setGenerationMethod(e.target.value)}
          className="w-full mt-4 p-2 border rounded-md"
        >
          <option value="normal">Regular</option>
          <option value="controlnet">ControlNet</option>
          <option value="lora">LoRA (Low-Rank Adaptation)</option>
        </select>

        {/* ControlNet image upload */}
        {generationMethod === 'controlnet' && (
          <div className="mt-4">
            <input
              type="file"
              onChange={handleImageUpload}
              accept="image/*"
              className="w-full p-2 border rounded-md"
            />
            {controlnetImage && (
              <div className="mt-2 text-sm text-gray-500">ControlNet Image Selected</div>
            )}
          </div>
        )}

        {/* LoRA effect sliders */}
        {generationMethod === 'lora' && (
          <div className="mt-4 space-y-4">
            {Object.keys(loraEffects).map((effect) => (
              <div key={effect} className="flex items-center justify-between">
                <label className="text-sm text-gray-700">{effect}</label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={loraEffects[effect]}
                  onChange={(e) => handleLoraChange(effect, parseFloat(e.target.value))}
                  className="w-3/4"
                />
                <span className="ml-2 text-sm">{loraEffects[effect].toFixed(1)}</span>
              </div>
            ))}
          </div>
        )}

        <button
          onClick={handleGenerate}
          disabled={loading}
          className={`mt-4 w-full py-2 text-white rounded-md ${loading ? 'bg-purple-300 cursor-not-allowed' : 'bg-purple-500 hover:bg-purple-600'}`}
        >
          {loading ? 'Generating...' : 'Generate'}
        </button>

        {error && <p className="mt-2 text-red-500">{error}</p>}

        {image && (
          <div className="mt-6">
            <h2 className="text-lg font-semibold text-gray-800">Generated Image:</h2>
            <img
              src={`data:image/jpeg;base64,${image}`}
              alt="Generated AI"
              className="mt-4 max-w-full h-auto rounded-md"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageGeneration;