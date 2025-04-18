import { useState } from 'react';
import SectionBox from '../SectionBox';
import '../styles.css';
import './StabilityAI.css';

function StabilityAI() {
  const [prompt, setPrompt] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const generateImage = async () => {
    if (!prompt.trim()) {
      setError('Please enter a prompt');
      return;
    }

    setLoading(true);
    setError('');
    try {
      console.log('Sending request with prompt:', prompt);
      const response = await fetch(`http://localhost:5002/generate?prompt=${encodeURIComponent(prompt)}`);
      console.log('Response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error response:', errorText);
        throw new Error(`Failed to generate image: ${errorText}`);
      }
      
      // Convert the response to a blob and create an object URL
      const blob = await response.blob();
      console.log('Received blob:', blob.type, blob.size);
      const url = URL.createObjectURL(blob);
      setImageUrl(url);
    } catch (err) {
      console.error('Error details:', err);
      setError(err instanceof Error ? err.message : 'Failed to generate image. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-content">
      <div className="blue-orb orb-1"></div>
      <div className="blue-orb orb-2"></div>

      <div className="stability-container">
        <h1 className="gradient-text">AI Image Generation</h1>
        <p className="subtitle">Create unique images using AI</p>

        <div className="input-container">
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Describe the image you want to generate..."
            className="prompt-input"
          />
          <button 
            onClick={generateImage} 
            disabled={loading}
            className="generate-button"
          >
            {loading ? 'Generating...' : 'Generate'}
          </button>
        </div>

        {error && <p className="error-message">{error}</p>}

        {imageUrl && (
          <div className="image-container">
            <img src={imageUrl} alt="Generated" className="generated-image" />
            <a 
              href={imageUrl} 
              download={`generated-${prompt.replace(/\s+/g, '-')}.webp`}
              className="download-button"
            >
              Download Image
            </a>
          </div>
        )}
      </div>
    </div>
  );
}

export default StabilityAI;
