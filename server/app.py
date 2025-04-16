from flask import Flask, Response, render_template_string
from flask_cors import CORS
from ultralytics import YOLO
import cv2
import numpy as np
import logging
import sys
import os

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = Flask(__name__)
CORS(app)  # Enable CORS for cross-origin requests

# Configuration
MODEL_PATH = os.path.join(os.path.dirname(__file__), "yolov8n.pt")
CAMERA_CONFIG = [
    (0, cv2.CAP_ANY),
    (0, cv2.CAP_AVFOUNDATION),
    (1, cv2.CAP_AVFOUNDATION),
    (0, cv2.CAP_MSMF),
]

class Detection:
    def __init__(self):
        logger.info("Initializing YOLO model...")
        try:
            self.model = YOLO(MODEL_PATH)
            self.device = 'cuda' if cv2.cuda.getCudaEnabledDeviceCount() > 0 else 'cpu'
            logger.info(f"Using device: {self.device}")
            self.model.to(self.device)
            self.cap = None
            self.colors = {
                'person': (0, 255, 0),    'car': (255, 0, 0),
                'dog': (0, 165, 255),     'cat': (255, 0, 255),
                'bird': (255, 255, 0),    'laptop': (128, 0, 255),
                'cell phone': (0, 255, 255)
            }
            self.default_color = (0, 0, 255)
        except Exception as e:
            logger.error(f"Initialization failed: {e}")
            sys.exit(1)

    def draw_box(self, image, box, label, class_name):
        try:
            x1, y1, x2, y2 = map(int, box)
            color = self.colors.get(class_name.lower(), self.default_color)
            cv2.rectangle(image, (x1, y1), (x2, y2), color, 3)
            text_size = cv2.getTextSize(label, cv2.FONT_HERSHEY_SIMPLEX, 0.8, 2)[0]
            cv2.rectangle(image, (x1, y1 - 25), (x1 + text_size[0], y1), color, -1)
            cv2.putText(image, label, (x1, y1 - 5), cv2.FONT_HERSHEY_SIMPLEX, 0.8, (255, 255, 255), 2)
        except Exception as e:
            logger.error(f"Drawing error: {e}")

    def process_frame(self, frame):
        if frame is None:
            return None
        try:
            results = self.model.predict(frame, conf=0.25, verbose=False)[0]
            for box in results.boxes:
                confidence = float(box.conf[0])
                class_id = int(box.cls[0])
                class_name = results.names[class_id]
                self.draw_box(frame, box.xyxy[0].tolist(), f'{class_name} {confidence:.1%}', class_name)
            return frame
        except Exception as e:
            logger.error(f"Processing error: {e}")
            return frame

    def generate_frames(self):
        logger.info("Starting video capture...")
        try:
            for idx, api in CAMERA_CONFIG:
                self.cap = cv2.VideoCapture(idx, api)
                if self.cap.isOpened():
                    logger.info(f"Camera {idx} opened with API {api}")
                    self.cap.set(cv2.CAP_PROP_FRAME_WIDTH, 640)
                    self.cap.set(cv2.CAP_PROP_FRAME_HEIGHT, 480)
                    self.cap.set(cv2.CAP_PROP_FPS, 30)
                    break
            else:
                logger.error("No camera found")
                return

            while True:
                success, frame = self.cap.read()
                if not success:
                    logger.warning("Frame read failed")
                    break
                yield self._frame_to_bytes(self.process_frame(frame))
        except Exception as e:
            logger.error(f"Video error: {e}")
        finally:
            if self.cap:
                self.cap.release()
                logger.info("Camera released")

    def _frame_to_bytes(self, frame):
        try:
            _, buffer = cv2.imencode('.jpg', frame, [cv2.IMWRITE_JPEG_QUALITY, 80])
            return b'--frame\r\nContent-Type: image/jpeg\r\n\r\n' + buffer.tobytes() + b'\r\n'
        except Exception as e:
            logger.error(f"Encoding error: {e}")
            return b''

detector = Detection()

@app.route('/')
def home():
    return render_template_string("""
    <!DOCTYPE html>
    <html><body>
        <h1>Flask Detection Server</h1>
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