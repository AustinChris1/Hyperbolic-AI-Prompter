import React, { useState } from 'react';

const AudioGeneration = () => {
  const [text, setText] = useState('');
  const [audioUrl, setAudioUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGenerate = async () => {
    if (!text) {
      setError('Text cannot be empty');
      return;
    }

    setLoading(true);
    setError('');
    setAudioUrl(null); // Reset previous audio URL

    try {
      const res = await fetch('http://localhost:5000/generate-audio', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        setError(errorData.error || 'Failed to generate audio');
      } else {
        const data = await res.json();
        const audioData = data.audio; // Base64 audio string

        // Create a blob and audio URL
        const audioBlob = new Blob([new Uint8Array(atob(audioData).split('').map(c => c.charCodeAt(0)))], { type: 'audio/mp3' });
        const audioUrl = URL.createObjectURL(audioBlob);

        setAudioUrl(audioUrl);
      }
    } catch (err) {
      setError('Failed to connect to the server');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-100 py-8 px-4">
      <h1 className="text-3xl font-bold text-gray-800 mb-4">AI Audio Generator</h1>

      <div className="w-full max-w-2xl bg-white shadow-md rounded-lg p-6">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Enter text to generate speech..."
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
        {audioUrl && (
          <div className="mt-6">
            <h2 className="text-lg font-semibold text-gray-800">Generated Audio:</h2>
            <audio controls className="mt-4">
              <source src={audioUrl} type="audio/mp3" />
              Your browser does not support the audio element.
            </audio>
          </div>
        )}
      </div>
    </div>
  );
};

export default AudioGeneration;
