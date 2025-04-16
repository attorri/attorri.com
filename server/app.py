from flask import Flask, Response, render_template_string
from ultralytics import YOLO
import cv2
import numpy as np
import logging
import sys

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = Flask(__name__)

class Detection:
    def __init__(self):
        logger.info("Initializing YOLO model...")
        self.model = YOLO("yolov8n.pt")
        self.device = 'cuda' if cv2.cuda.getCudaEnabledDeviceCount() > 0 else 'cpu'
        logger.info(f"Using device: {self.device}")
        self.model.to(self.device)
        self.cap = None
        # Color mapping for different classes (BGR format)
        self.colors = {
            'person': (0, 255, 0),    # Green
            'car': (255, 0, 0),       # Blue
            'dog': (0, 165, 255),     # Orange
            'cat': (255, 0, 255),     # Magenta
            'bird': (255, 255, 0),    # Cyan
            'laptop': (128, 0, 255),  # Purple
            'cell phone': (0, 255, 255),  # Yellow
        }
        self.default_color = (0, 0, 255)  # Red for any other class
        
    def draw_box(self, image, box, label, class_name):
        try:
            x1, y1, x2, y2 = map(int, box)
            # Get color for class, default to red if not in mapping
            color = self.colors.get(class_name.lower(), self.default_color)
            # Draw thick box
            cv2.rectangle(image, (x1, y1), (x2, y2), color, 3)
            # Add filled background for text
            text_size = cv2.getTextSize(label, cv2.FONT_HERSHEY_SIMPLEX, 0.8, 2)[0]
            cv2.rectangle(image, (x1, y1 - 25), (x1 + text_size[0], y1), color, -1)
            # Add white text
            cv2.putText(image, label, (x1, y1 - 5), cv2.FONT_HERSHEY_SIMPLEX, 0.8, (255, 255, 255), 2)
            logger.debug(f"Drew {class_name} box at coordinates: ({x1}, {y1}, {x2}, {y2})")
        except Exception as e:
            logger.error(f"Error drawing box: {e}")

    def process_frame(self, frame):
        if frame is None:
            return None

        try:
            # Make predictions
            results = self.model.predict(frame, conf=0.25, verbose=False)[0]
            
            # Process results and draw boxes
            for box in results.boxes:
                confidence = float(box.conf[0])
                class_id = int(box.cls[0])
                class_name = results.names[class_id]
                bbox = box.xyxy[0].tolist()  # Get box coordinates
                
                # Draw box and label
                label = f'{class_name} {confidence:.1%}'
                self.draw_box(frame, bbox, label, class_name)
                logger.info(f"Detected {class_name} with confidence {confidence:.1%}")
            
            return frame
            
        except Exception as e:
            logger.error(f"Error processing frame: {e}")
            return frame

    def generate_frames(self):
        logger.info("Starting frame generation...")
        try:
            # For macOS, explicitly try different camera indices and backends
            camera_options = [
                (0, cv2.CAP_ANY),           # Try default first
                (0, cv2.CAP_AVFOUNDATION),  # Try AVFoundation
                (1, cv2.CAP_AVFOUNDATION),  # Try external camera
                (0, cv2.CAP_MSMF),          # Try Media Foundation
            ]

            for idx, api in camera_options:
                logger.info(f"Attempting to open camera with index {idx} and API {api}")
                self.cap = cv2.VideoCapture(idx, api)
                if self.cap is not None and self.cap.isOpened():
                    logger.info(f"Successfully opened camera with index {idx} and API {api}")
                    break
            
            if not self.cap.isOpened():
                logger.error("Could not open camera with any available backend")
                return

            # Set camera properties
            self.cap.set(cv2.CAP_PROP_FRAME_WIDTH, 640)
            self.cap.set(cv2.CAP_PROP_FRAME_HEIGHT, 480)
            self.cap.set(cv2.CAP_PROP_FPS, 30)
            
            logger.info("Camera initialized successfully")
            
            while True:
                success, frame = self.cap.read()
                if not success:
                    logger.error("Failed to read frame")
                    break
                
                # Process frame with detections
                processed_frame = self.process_frame(frame)
                
                try:
                    # Encode frame to JPEG
                    _, buffer = cv2.imencode('.jpg', processed_frame, [cv2.IMWRITE_JPEG_QUALITY, 80])
                    frame_bytes = buffer.tobytes()
                    
                    yield (b'--frame\r\n'
                           b'Content-Type: image/jpeg\r\n\r\n' + frame_bytes + b'\r\n')
                except Exception as e:
                    logger.error(f"Error encoding frame: {e}")
                    break

        except Exception as e:
            logger.error(f"Camera initialization error: {e}")
            return

        finally:
            if hasattr(self, 'cap') and self.cap is not None:
                self.cap.release()
                logger.info("Camera released")

# Initialize detector
detector = Detection()

@app.route('/')
def home():
    return render_template_string("""
    <!DOCTYPE html>
    <html>
        <head>
            <title>Real-Time Object Detection</title>
            <style>
                :root {
                    --primary-blue: #0069ff;
                    --bg-dark: #0c1c2c;
                    --text-light: #ffffff;
                    --text-secondary: #5c7999;
                    --border-radius: 8px;
                    --card-bg: #1b2b3d;
                }
                
                body { 
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
                    margin: 0;
                    padding: 0;
                    background-color: var(--bg-dark);
                    color: var(--text-light);
                    min-height: 100vh;
                    line-height: 1.5;
                }
                
                .container {
                    max-width: 1200px;
                    margin: 0 auto;
                    padding: 40px 20px;
                }
                
                .header {
                    margin-bottom: 32px;
                }
                
                h1 {
                    font-size: 36px;
                    font-weight: 600;
                    margin: 0 0 8px 0;
                    color: var(--text-light);
                }
                
                .subtitle {
                    font-size: 16px;
                    color: var(--text-secondary);
                    margin: 0;
                }
                
                .main-content {
                    background: var(--card-bg);
                    border-radius: var(--border-radius);
                    padding: 24px;
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
                }
                
                .video-container {
                    width: 100%;
                    height: 600px;
                    border-radius: var(--border-radius);
                    overflow: hidden;
                    background-color: var(--bg-dark);
                    position: relative;
                    margin: 20px 0;
                }
                
                #video-feed {
                    width: 100%;
                    height: 100%;
                    object-fit: contain;
                    background-color: var(--bg-dark);
                    opacity: 0;
                    transition: opacity 0.3s ease;
                }

                #video-feed.loaded {
                    opacity: 1;
                }
                
                .loading-container {
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    text-align: center;
                }

                .loading-spinner {
                    width: 40px;
                    height: 40px;
                    border: 3px solid var(--card-bg);
                    border-radius: 50%;
                    border-top-color: var(--primary-blue);
                    animation: spin 1s linear infinite;
                    margin-bottom: 16px;
                }

                .loading-text {
                    color: var(--text-secondary);
                    font-size: 14px;
                }

                @keyframes spin {
                    to {
                        transform: rotate(360deg);
                    }
                }
                
                .permission-button {
                    background-color: var(--primary-blue);
                    color: white;
                    border: none;
                    padding: 12px 24px;
                    border-radius: var(--border-radius);
                    font-size: 14px;
                    font-weight: 500;
                    cursor: pointer;
                    transition: all 0.2s ease;
                    display: inline-flex;
                    align-items: center;
                    gap: 8px;
                }
                
                .permission-button:hover {
                    background-color: #005ae0;
                }
                
                .instructions {
                    background: var(--bg-dark);
                    border-radius: var(--border-radius);
                    padding: 24px;
                    margin: 24px 0;
                }
                
                .instructions h3 {
                    margin: 0 0 16px 0;
                    color: var(--text-light);
                    font-size: 18px;
                    font-weight: 500;
                }
                
                .instructions ol {
                    margin: 0;
                    padding-left: 20px;
                    color: var(--text-secondary);
                }
                
                .instructions li {
                    margin: 8px 0;
                }
                
                #error-message {
                    color: #ff4444;
                    margin-top: 16px;
                    display: none;
                    padding: 12px;
                    border-radius: var(--border-radius);
                    background: rgba(255, 68, 68, 0.1);
                    font-size: 14px;
                }
                
                @media (max-width: 768px) {
                    .container {
                        padding: 20px;
                    }
                    
                    h1 {
                        font-size: 28px;
                    }

                    .video-container {
                        height: 400px;
                    }
                }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>Real-Time Object Detection</h1>
                    <p class="subtitle">Powered by YOLO v8 Neural Network</p>
                </div>
                
                <div class="main-content">
                    <div id="permission-container">
                        <div class="instructions">
                            <h3>Camera Access Required</h3>
                            <ol>
                                <li>Click the button below to enable camera access</li>
                                <li>Allow camera permissions when prompted by your browser</li>
                                <li>For macOS users, grant camera access in System Settings if requested</li>
                            </ol>
                        </div>
                        <button id="request-permission" class="permission-button">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <circle cx="12" cy="12" r="3"/>
                                <path d="M19 12H5M12 19V5"/>
                            </svg>
                            Enable Camera
                        </button>
                        <div id="error-message"></div>
                    </div>
                    <div class="video-container" id="video-container">
                        <div class="loading-container" id="loading-container">
                            <div class="loading-spinner"></div>
                            <div class="loading-text">Initializing camera...</div>
                        </div>
                        <img id="video-feed" src="{{ url_for('video_feed') }}" />
                    </div>
                </div>
            </div>
            <script>
                document.getElementById('request-permission').addEventListener('click', async () => {
                    const errorMessage = document.getElementById('error-message');
                    try {
                        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
                        stream.getTracks().forEach(track => track.stop());
                        
                        document.getElementById('permission-container').style.display = 'none';
                        document.getElementById('video-container').style.display = 'block';
                        
                        const videoFeed = document.getElementById('video-feed');
                        const loadingContainer = document.getElementById('loading-container');
                        
                        videoFeed.onload = () => {
                            loadingContainer.style.display = 'none';
                            videoFeed.classList.add('loaded');
                        };
                        
                        videoFeed.src = "{{ url_for('video_feed') }}";
                        
                        videoFeed.onerror = () => {
                            errorMessage.textContent = 'Error accessing camera. Please check your camera permissions in system settings.';
                            errorMessage.style.display = 'block';
                            document.getElementById('permission-container').style.display = 'block';
                            document.getElementById('video-container').style.display = 'none';
                        };
                    } catch (err) {
                        console.error('Error accessing camera:', err);
                        errorMessage.textContent = 'Could not access camera. Please ensure camera permissions are granted in both browser and system settings.';
                        errorMessage.style.display = 'block';
                    }
                });
            </script>
        </body>
    </html>
    """)

@app.route('/video_feed')
def video_feed():
    return Response(detector.generate_frames(),
                   mimetype='multipart/x-mixed-replace; boundary=frame')

if __name__ == '__main__':
    logger.info("Starting Flask server...")
    app.run(host='0.0.0.0', port=5001, debug=False)