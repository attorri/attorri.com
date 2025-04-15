from flask import Flask, render_template_string, request, jsonify
from ultralytics import YOLO
import cv2
import numpy as np
import logging
import base64

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = Flask(__name__)

class Detection:
    def __init__(self):
        self.model = YOLO("yolov8n.pt")
        
    def draw_box(self, image, box, label, color=(0, 0, 255)):
        # Extract coordinates
        x1, y1, x2, y2 = map(int, box)
        
        # Draw thick red box
        cv2.rectangle(image, (x1, y1), (x2, y2), color, 3)
        
        # Add filled background for text
        text_size = cv2.getTextSize(label, cv2.FONT_HERSHEY_SIMPLEX, 0.8, 2)[0]
        cv2.rectangle(image, (x1, y1 - 25), (x1 + text_size[0], y1), color, -1)
        
        # Add white text
        cv2.putText(image, label, (x1, y1 - 5), cv2.FONT_HERSHEY_SIMPLEX, 0.8, (255, 255, 255), 2)
        
    def detect_from_image(self, image, conf=0.25):
        try:
            if image is None:
                return None, []
            
            # Ensure image is in correct format
            if len(image.shape) == 2:  # If grayscale
                image = cv2.cvtColor(image, cv2.COLOR_GRAY2BGR)
            
            # Make predictions
            results = self.model.predict(image, conf=conf)[0]
            detections = []
            
            # Process results and draw boxes
            for box in results.boxes:
                confidence = float(box.conf[0])
                class_id = int(box.cls[0])
                class_name = results.names[class_id]
                bbox = box.xyxy[0].tolist()  # Get box coordinates
                
                # Add to detections list
                detections.append({
                    'class': class_name,
                    'confidence': round(confidence * 100, 1),
                    'bbox': bbox
                })
                
                # Force draw box on image
                label = f'{class_name} {confidence:.1%}'
                self.draw_box(image, bbox, label)
                
                # Log detection for debugging
                logger.info(f"Drew box for {class_name} at {bbox}")
            
            return image, detections
            
        except Exception as e:
            logger.error(f"Detection error: {e}")
            return image, []

# Initialize detector
detector = Detection()

@app.route('/detect', methods=['POST'])
def detect():
    try:
        # Get the image data from the request
        image_data = request.json['image'].split(',')[1]
        nparr = np.frombuffer(base64.b64decode(image_data), np.uint8)
        image = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        
        # Process the image
        processed_image, detections = detector.detect_from_image(image)
        
        # Ensure we're getting detections
        logger.info(f"Number of detections: {len(detections)}")
        
        # Convert back to base64
        _, buffer = cv2.imencode('.jpg', processed_image)
        image_base64 = base64.b64encode(buffer).decode('utf-8')
        
        return jsonify({
            'image': f'data:image/jpeg;base64,{image_base64}',
            'detections': detections
        })
    except Exception as e:
        logger.error(f"Detection error: {e}")
        return jsonify({'error': str(e)}), 500

@app.route('/')
def home():
    return """
    <!DOCTYPE html>
    <html>
        <head>
            <title>YOLO Object Detection</title>
            <style>
                body { 
                    font-family: Arial, sans-serif; 
                    margin: 20px; 
                    text-align: center;
                    background-color: #f5f5f5;
                }
                .container {
                    max-width: 800px;
                    margin: 40px auto;
                    padding: 20px;
                    background-color: white;
                    border-radius: 10px;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                }
                .video-container {
                    margin: 20px auto;
                    width: 640px;
                    height: 480px;
                    border-radius: 8px;
                    overflow: hidden;
                    position: relative;
                    background-color: black;
                }
                #videoElement, #canvasElement {
                    width: 100%;
                    height: 100%;
                    object-fit: contain;
                    position: absolute;
                    top: 0;
                    left: 0;
                }
                #canvasElement {
                    z-index: 2;
                }
                #status {
                    margin: 10px 0;
                    padding: 10px;
                    border-radius: 5px;
                }
                .success { background-color: #dff0d8; color: #3c763d; }
                .error { background-color: #f2dede; color: #a94442; }
                #detections {
                    margin: 20px auto;
                    padding: 10px;
                    max-width: 640px;
                    text-align: left;
                    background-color: #f8f9fa;
                    border-radius: 5px;
                }
                .detection-item {
                    margin: 5px 0;
                    padding: 5px 10px;
                    background-color: #e9ecef;
                    border-radius: 3px;
                    display: inline-block;
                    margin-right: 5px;
                }
                .confidence {
                    color: #666;
                    font-size: 0.9em;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <h1>📸 Live YOLO Detection</h1>
                <div id="status"></div>
                <div class="video-container">
                    <video id="videoElement" autoplay playsinline></video>
                    <canvas id="canvasElement"></canvas>
                </div>
                <div id="detections">
                    <h3>Detected Objects</h3>
                    <div id="detectionsList"></div>
                </div>
            </div>
            
            <script>
                const video = document.getElementById('videoElement');
                const canvas = document.getElementById('canvasElement');
                const ctx = canvas.getContext('2d');
                const status = document.getElementById('status');
                const detectionsList = document.getElementById('detectionsList');
                let isProcessing = false;
                
                async function startCamera() {
                    try {
                        const stream = await navigator.mediaDevices.getUserMedia({ 
                            video: { 
                                width: { ideal: 640 },
                                height: { ideal: 480 }
                            } 
                        });
                        
                        video.srcObject = stream;
                        status.className = 'success';
                        status.textContent = '✅ Camera initialized successfully';
                        
                        // Set canvas size
                        canvas.width = 640;
                        canvas.height = 480;
                        
                        // Start detection loop
                        detectObjects();
                        
                    } catch (err) {
                        status.className = 'error';
                        status.textContent = '❌ Error accessing camera: ' + err.message;
                        console.error('Camera error:', err);
                    }
                }
                
                function updateDetectionsList(detections) {
                    detectionsList.innerHTML = detections.map(det => `
                        <div class="detection-item">
                            ${det.class} <span class="confidence">${det.confidence}%</span>
                        </div>
                    `).join('');
                }
                
                async function detectObjects() {
                    if (!isProcessing) {
                        isProcessing = true;
                        
                        try {
                            // Draw current frame to canvas
                            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
                            
                            // Get frame data
                            const imageData = canvas.toDataURL('image/jpeg', 0.8);
                            
                            // Send to server for detection
                            const response = await fetch('/detect', {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json'
                                },
                                body: JSON.stringify({
                                    image: imageData
                                })
                            });
                            
                            const data = await response.json();
                            
                            if (data.error) {
                                throw new Error(data.error);
                            }
                            
                            // Update detections list
                            updateDetectionsList(data.detections);
                            
                            // Draw detected frame
                            const img = new Image();
                            img.onload = () => {
                                ctx.clearRect(0, 0, canvas.width, canvas.height);
                                ctx.drawImage(img, 0, 0);
                                isProcessing = false;
                                requestAnimationFrame(detectObjects);
                            };
                            img.src = data.image;
                            
                        } catch (err) {
                            console.error('Detection error:', err);
                            isProcessing = false;
                            requestAnimationFrame(detectObjects);
                        }
                    } else {
                        requestAnimationFrame(detectObjects);
                    }
                }
                
                // Start camera when page loads
                startCamera();
                
                // Clean up on page unload
                window.onbeforeunload = () => {
                    const stream = video.srcObject;
                    if (stream) {
                        stream.getTracks().forEach(track => track.stop());
                    }
                };
            </script>
        </body>
    </html>
    """

if __name__ == '__main__':
    app.run(port=5001, debug=True)