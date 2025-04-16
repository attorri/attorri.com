import { useState, useEffect } from 'react';
import styled from '@emotion/styled';

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
  background-color: #0c1c2c;
  min-height: 100vh;
  color: white;
`;

const VideoContainer = styled.div`
  width: 100%;
  height: 600px;
  border-radius: 8px;
  overflow: hidden;
  background-color: #1b2b3d;
  position: relative;
  margin: 20px 0;
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
`;

const Spinner = styled.div`
  width: 40px;
  height: 40px;
  border: 3px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: #0069ff;
  animation: spin 1s linear infinite;
  
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;

const PermissionPanel = styled.div`
  background: #1b2b3d;
  padding: 2rem;
  border-radius: 8px;
  text-align: center;
  margin: 2rem 0;
`;

const Button = styled.button`
  background: #0069ff;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.2s;
  
  &:hover {
    background: #005ce6;
  }
`;

const ErrorMessage = styled.div`
  color: #ff4444;
  padding: 1rem;
  background: rgba(255, 68, 68, 0.1);
  border-radius: 8px;
  margin: 1rem 0;
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
      <h1>Real-Time Object Detection</h1>
      <p>Ensure Flask server is running on port 5001</p>

      {!hasPermission ? (
        <PermissionPanel>
          <h3>Camera Access Required</h3>
          <p>You need to grant camera permissions to use this feature:</p>
          <Button onClick={requestAccess}>Enable Camera Access</Button>
          {error && <ErrorMessage>{error}</ErrorMessage>}
          <p style={{ marginTop: '1rem', color: '#5c7999' }}>
            Note: On macOS, you may need to grant permissions to both your browser and terminal
          </p>
        </PermissionPanel>
      ) : (
        <VideoContainer>
          {isLoading && (
            <LoadingOverlay>
              <Spinner />
              <p>Connecting to local detection server...</p>
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