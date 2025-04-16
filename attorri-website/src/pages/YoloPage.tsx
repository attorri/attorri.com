import { useState, useEffect } from 'react';
import styled from '@emotion/styled';

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  margin-bottom: 1rem;
  background: var(--primary-gradient);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

const VideoContainer = styled.div`
  width: 100%;
  height: 600px;
  border-radius: 12px;
  overflow: hidden;
  background-color: #000;
  position: relative;
  margin: 20px 0;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const VideoFeed = styled.img<{ loaded: boolean }>`
  width: 100%;
  height: 100%;
  object-fit: contain;
  opacity: ${({ loaded }) => (loaded ? 1 : 0)};
  transition: opacity 0.3s ease;
`;

const LoadingOverlay = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  color: white;
`;

const Spinner = styled.div`
  width: 40px;
  height: 40px;
  border: 3px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: #0069ff;
  animation: spin 1s linear infinite;
  margin: 0 auto 1rem;
  
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;

const PermissionPanel = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 12px;
  text-align: center;
  margin: 2rem 0;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  border: 1px solid #eee;
`;

const Button = styled.button`
  background: #0069ff;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 1rem;
  cursor: pointer;
  transition: transform 0.2s;
  margin: 1rem 0;
  display: inline-block;
  
  &:hover {
    transform: translateY(-2px);
  }
`;

const ErrorMessage = styled.div`
  color: #ff4444;
  padding: 1rem;
  background: rgba(255, 68, 68, 0.1);
  border-radius: 8px;
  margin: 1rem 0;
`;

const Description = styled.p`
  color: #667;
  font-size: 1.1rem;
  margin-bottom: 2rem;
  line-height: 1.6;
`;

export default function YoloPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string|null>(null);
  const [hasPermission, setHasPermission] = useState(false);

  useEffect(() => {
    navigator.mediaDevices.enumerateDevices()
      .then(devices => {
        const hasCamera = devices.some(d => d.kind === 'videoinput');
        if (!hasCamera) setError('No camera devices found');
      })
      .catch(() => setError('Cannot access media devices'));
  }, []);

  const requestAccess = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      stream.getTracks().forEach(track => track.stop());
      setHasPermission(true);
    } catch (err) {
      setError('Camera access denied. Please enable permissions in your browser and OS settings.');
    }
  };

  return (
    <Container>
      <Title>Real-Time Object Detection</Title>
      <Description>
        Experience live object detection powered by YOLOv8. Point your camera at any object to see instant recognition in action.
      </Description>

      {!hasPermission ? (
        <PermissionPanel>
          <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Camera Access Required</h3>
          <p style={{ marginBottom: '1.5rem' }}>To start detecting objects, please enable your camera:</p>
          <Button onClick={requestAccess}>Enable Camera Access</Button>
          {error && <ErrorMessage>{error}</ErrorMessage>}
          <p style={{ marginTop: '1rem', color: '#667', fontSize: '0.9rem' }}>
            Note: On macOS, you may need to grant permissions to both your browser and terminal
          </p>
        </PermissionPanel>
      ) : (
        <VideoContainer>
          {isLoading && (
            <LoadingOverlay>
              <Spinner />
              <p>Initializing detection...</p>
            </LoadingOverlay>
          )}
          
          <VideoFeed
            src="http://localhost:5001/video_feed"
            loaded={!isLoading}
            onLoad={() => setIsLoading(false)}
            onError={() => setError('Failed to connect to detection server. Ensure it\'s running on port 5001.')}
            alt="Live detection feed"
          />
          
          {error && <ErrorMessage>{error}</ErrorMessage>}
        </VideoContainer>
      )}
    </Container>
  );
}