import React, { useState } from 'react';

const TextGeneration = () => {
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGenerate = async () => {
    if (!prompt) {
      setError('Prompt cannot be empty');
      return;
    }

    setLoading(true);
    setError('');
    setResponse('');

    try {
      const res = await fetch('http://localhost:5000/generate-text', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        setError(errorData.error || 'Failed to generate text');
      } else {
        const data = await res.json();
        setResponse(data.response);
        prompt === '';
        
      }
    } catch (err) {
      setError('Failed to connect to the server');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-100 py-8 px-4">
      <h1 className="text-3xl font-bold text-gray-800 mb-4">AI Text Generator</h1>

      <div className="w-full max-w-2xl bg-white shadow-md rounded-lg p-6">
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Enter your prompt here..."
          className="w-full h-32 p-4 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
        />
        <button
          onClick={handleGenerate}
          disabled={loading}
          className={`mt-4 w-full py-2 text-white rounded-md ${
            loading
              ? 'bg-purple-300 cursor-not-allowed'
              : 'bg-purple-500 hover:bg-purple-600'
          }`}
        >
          {loading ? 'Generating...' : 'Generate'}
        </button>
        {error && <p className="mt-2 text-red-500">{error}</p>}
        {response && (
          <div className="mt-6 bg-gray-50 border rounded-md p-4">
            <h2 className="text-lg font-semibold text-gray-800">Response:</h2>
            <p className="mt-2 text-gray-700 whitespace-pre-line">{response}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TextGeneration;
