import React, { useState } from 'react';
import TextGeneration from './TextGeneration';
import ImageGeneration from './ImageGeneration';
import AudioGeneration from './AudioGeneration';

const HyperbolicPromptGenerator = () => {
  const [activeTab, setActiveTab] = useState('text'); // State to manage active tab

  
  // Tab content rendering logic
  const renderTabContent = () => {
    switch (activeTab) {
      case 'text':
        return <TextGeneration />;
      case 'image':
        return <ImageGeneration />;
      case 'audio':
        return <AudioGeneration />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900">
      <header className="bg-purple-900 text-white py-4">
        <h1 className="text-center text-2xl font-bold">Hyperbolic Prompt Generator</h1>
      </header>
      <div className="container mx-auto mt-6">
        <div className="flex justify-center space-x-4 mb-6">
          {/* Tab Buttons */}
          <button
            onClick={() => setActiveTab('text')}
            className={`px-4 py-2 rounded ${
              activeTab === 'text' ? 'bg-purple-500 text-white' : 'bg-gray-200'
            }`}
          >
            Text Generation
          </button>
          <button
            onClick={() => setActiveTab('image')}
            className={`px-4 py-2 rounded ${
              activeTab === 'image' ? 'bg-purple-500 text-white' : 'bg-gray-200'
            }`}
          >
            Image Generation
          </button>
          <button
            onClick={() => setActiveTab('audio')}
            className={`px-4 py-2 rounded ${
              activeTab === 'audio' ? 'bg-purple-500 text-white' : 'bg-gray-200'
            }`}
          >
            Audio Generation
          </button>
        </div>
        {/* Tab Content */}
        <div className="bg-white p-6 shadow rounded">{renderTabContent()}</div>
      </div>
    <footer className="bg-gray-800 text-white py-4">
      <div className="container mx-auto text-center">
        <p className="text-lg font-semibold">
          Developed by Austin-Chris
        </p>
      </div>
    </footer>
    </div>
  );
};


export default HyperbolicPromptGenerator;
