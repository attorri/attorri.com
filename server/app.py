from flask import Flask, Response, render_template_string
from ultralytics import YOLO
import cv2
import numpy as np
import logging

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
        self.cap = cv2.VideoCapture(0)
        self.cap.set(cv2.CAP_PROP_FRAME_WIDTH, 640)
        self.cap.set(cv2.CAP_PROP_FRAME_HEIGHT, 480)
        self.cap.set(cv2.CAP_PROP_FPS, 30)

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

        if self.cap:
            self.cap.release()

# Initialize detector
detector = Detection()

@app.route('/')
def home():
    return render_template_string("""
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
                #video-feed {
                    width: 100%;
                    height: 100%;
                    object-fit: contain;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <h1>📸 Live YOLO Detection</h1>
                <div class="video-container">
                    <img id="video-feed" src="{{ url_for('video_feed') }}" />
                </div>
            </div>
        </body>
    </html>
    """)

@app.route('/video_feed')
def video_feed():
    return Response(detector.generate_frames(),
                   mimetype='multipart/x-mixed-replace; boundary=frame')

if __name__ == '__main__':
    logger.info("Starting Flask server...")
    app.run(host='0.0.0.0', port=5001, debug=True)