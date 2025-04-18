from flask import Flask, Response, render_template_string
from flask_cors import CORS
from ultralytics import YOLO
import cv2
import numpy as np
import logging
import sys
import os
import atexit

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = Flask(__name__)
CORS(app)  # Enable CORS for cross-origin requests

# Configuration
RPS_MODEL_PATH = os.path.join(os.path.dirname(__file__), "runs/detect/train/weights/best.pt")
FALLBACK_MODEL_PATH = os.path.join(os.path.dirname(__file__), "yolov8n-cls.pt")

CAMERA_CONFIG = [
    (0, cv2.CAP_ANY),
    (0, cv2.CAP_AVFOUNDATION),
    (1, cv2.CAP_AVFOUNDATION),
    (0, cv2.CAP_MSMF),
]

class Detection:
    def __init__(self):
        logger.info("Initializing model...")
        try:
            # Try to load the RPS model first
            if os.path.exists(RPS_MODEL_PATH):
                logger.info("Loading RPS model...")
                self.model = YOLO(RPS_MODEL_PATH)
                self.is_rps_model = True
            else:
                logger.warning(f"RPS model not found at {RPS_MODEL_PATH}")
                logger.info("Loading classification model as fallback...")
                self.model = YOLO(FALLBACK_MODEL_PATH)
                self.is_rps_model = False
            
            self.device = 'cuda' if cv2.cuda.getCudaEnabledDeviceCount() > 0 else 'cpu'
            logger.info(f"Using device: {self.device}")
            self.model.to(self.device)
            
            self.cap = None
            self.colors = {
                'rock': (255, 0, 0),      # Red
                'paper': (0, 255, 0),     # Green
                'scissors': (0, 0, 255),   # Blue
            }
            self.default_color = (128, 128, 128)  # Gray for other objects
            
            logger.info(f"Model loaded successfully. Available classes: {self.model.names}")
            
        except Exception as e:
            logger.error(f"Initialization failed: {e}")
            sys.exit(1)

    def cleanup(self):
        if self.cap and self.cap.isOpened():
            self.cap.release()
            logger.info("Camera released during cleanup")

    def draw_box(self, image, box, label, class_name):
        try:
            x1, y1, x2, y2 = map(int, box)
            color = self.colors.get(class_name.lower(), self.default_color)
            cv2.rectangle(image, (x1, y1), (x2, y2), color, 2)
            text_size = cv2.getTextSize(label, cv2.FONT_HERSHEY_SIMPLEX, 0.7, 2)[0]
            cv2.rectangle(image, (x1, y1 - 25), (x1 + text_size[0], y1), color, -1)
            cv2.putText(image, label, (x1, y1 - 5), cv2.FONT_HERSHEY_SIMPLEX, 0.7, (255, 255, 255), 2)
        except Exception as e:
            logger.error(f"Drawing error: {e}")

    def process_frame(self, frame):
        if frame is None:
            return None
        try:
            # Process based on model type
            if self.is_rps_model:
                # RPS detection
                results = self.model.predict(
                    frame,
                    conf=0.3,  # Lower threshold for RPS detection
                    iou=0.45,
                    verbose=False
                )[0]
                
                # Process each detection
                for box in results.boxes:
                    confidence = float(box.conf[0])
                    class_id = int(box.cls[0])
                    class_name = results.names[class_id]
                    
                    # Draw the detection
                    self.draw_box(
                        frame,
                        box.xyxy[0].tolist(),
                        f'{class_name} {confidence:.1%}',
                        class_name
                    )
            else:
                # Show warning about missing RPS model
                cv2.putText(frame, "RPS model not loaded - waiting for training",
                          (10, 30), cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0, 0, 255), 2)
                cv2.putText(frame, "Please wait for training to complete",
                          (10, 60), cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0, 0, 255), 2)
            
            return frame
            
        except Exception as e:
            logger.error(f"Processing error: {e}")
            logger.exception(e)
            return frame

    def initialize_camera(self):
        if self.cap and self.cap.isOpened():
            self.cap.release()
        
        for idx, api in CAMERA_CONFIG:
            try:
                self.cap = cv2.VideoCapture(idx, api)
                if self.cap.isOpened():
                    logger.info(f"Camera {idx} opened with API {api}")
                    self.cap.set(cv2.CAP_PROP_FRAME_WIDTH, 640)
                    self.cap.set(cv2.CAP_PROP_FRAME_HEIGHT, 480)
                    self.cap.set(cv2.CAP_PROP_FPS, 30)
                    return True
            except Exception as e:
                logger.error(f"Failed to open camera {idx} with API {api}: {e}")
                continue
        
        logger.error("No camera found")
        return False

    def generate_frames(self):
        logger.info("Starting video capture...")
        try:
            if not self.initialize_camera():
                return

            while True:
                if not self.cap.isOpened():
                    if not self.initialize_camera():
                        break
                
                success, frame = self.cap.read()
                if not success:
                    logger.warning("Frame read failed")
                    if not self.initialize_camera():
                        break
                    continue
                
                yield self._frame_to_bytes(self.process_frame(frame))
        except Exception as e:
            logger.error(f"Video error: {e}")
        finally:
            self.cleanup()

    def _frame_to_bytes(self, frame):
        try:
            _, buffer = cv2.imencode('.jpg', frame, [cv2.IMWRITE_JPEG_QUALITY, 80])
            return b'--frame\r\nContent-Type: image/jpeg\r\n\r\n' + buffer.tobytes() + b'\r\n'
        except Exception as e:
            logger.error(f"Encoding error: {e}")
            return b''

detector = Detection()
atexit.register(detector.cleanup)

@app.route('/')
def home():
    return render_template_string("""
    <!DOCTYPE html>
    <html><body>
        <h1>Rock Paper Scissors Detection</h1>
        <p>Access via React app at <a href="http://localhost:5173/yolo">http://localhost:5173/yolo</a></p>
    </body></html>
    """)

@app.route('/video_feed')
def video_feed():
    return Response(detector.generate_frames(),
                   mimetype='multipart/x-mixed-replace; boundary=frame')

if __name__ == '__main__':
    logger.info("Starting development server...")
    app.run(host='0.0.0.0', port=5001)