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

def get_latest_model(base_path, prefix="train"):
    """Get the latest model from training runs"""
    try:
        runs_dir = os.path.join(base_path, "runs")
        if not os.path.exists(runs_dir):
            return None
            
        train_dirs = [d for d in os.listdir(runs_dir) if d.startswith(prefix)]
        if not train_dirs:
            return None
            
        latest_dir = max(train_dirs, key=lambda x: os.path.getctime(os.path.join(runs_dir, x)))
        weights_path = os.path.join(runs_dir, latest_dir, "weights", "best.pt")
        
        return weights_path if os.path.exists(weights_path) else None
    except Exception as e:
        logger.error(f"Error finding latest model: {e}")
        return None

# Configuration
YOLO_MODEL_PATH = os.path.join(os.path.dirname(__file__), "yolov8n.pt")
RPS_BASE_PATH = os.path.join(os.path.dirname(__file__), "rock_paper_scissors")
RPS_MODEL_PATH = get_latest_model(RPS_BASE_PATH) or os.path.join(RPS_BASE_PATH, "yolov8n.pt")

class Detection:
    def __init__(self):
        logger.info("Initializing models...")
        try:
            # Load YOLO model for general object detection
            logger.info(f"Loading YOLO model from {YOLO_MODEL_PATH}")
            self.yolo_model = YOLO(YOLO_MODEL_PATH)
            
            # Load RPS model for detection
            if os.path.exists(RPS_MODEL_PATH):
                logger.info(f"Loading RPS detection model from {RPS_MODEL_PATH}")
                self.rps_model = YOLO(RPS_MODEL_PATH)
                logger.info(f"RPS model classes: {self.rps_model.names}")
            else:
                logger.error(f"RPS model not found at {RPS_MODEL_PATH}")
                self.rps_model = None
            
            # Initialize camera
            self.cap = cv2.VideoCapture(0)
            if not self.cap.isOpened():
                raise Exception("Could not open camera")
                
            # Set camera properties
            self.cap.set(cv2.CAP_PROP_FRAME_WIDTH, 640)
            self.cap.set(cv2.CAP_PROP_FRAME_HEIGHT, 480)
            
            # Colors for different detections
            self.colors = {
                'rock': (0, 0, 255),      # Red
                'paper': (0, 255, 0),     # Green
                'scissors': (255, 0, 0),   # Blue
                'other': (0, 140, 255)    # Orange for YOLO objects
            }
            
        except Exception as e:
            logger.error(f"Initialization failed: {e}")
            logger.exception(e)
            sys.exit(1)

    def draw_status_overlay(self, image, rps_detections, yolo_detections):
        try:
            h, w = image.shape[:2]
            
            # Create semi-transparent overlay for the top status bar
            overlay = image.copy()
            status_height = 60
            cv2.rectangle(overlay, (0, 0), (w, status_height), (0, 0, 0), -1)
            cv2.addWeighted(overlay, 0.7, image, 0.3, 0, image)
            
            # Prepare text
            font = cv2.FONT_HERSHEY_SIMPLEX
            font_scale = 0.7
            thickness = 2
            padding = 10
            
            # Show RPS detections
            rps_text = "RPS: None detected"
            if rps_detections:
                rps_text = f"RPS: {', '.join(rps_detections)}"
            
            # Show YOLO detections
            yolo_text = "Objects: None detected"
            if yolo_detections:
                yolo_text = "Objects: " + ", ".join(yolo_detections)
            
            # Draw RPS text
            cv2.putText(image, rps_text, (padding, 25),
                       font, font_scale, (255, 255, 255), thickness)
            
            # Draw YOLO text
            cv2.putText(image, yolo_text, (padding, 50),
                       font, font_scale, (255, 255, 255), thickness)
            
        except Exception as e:
            logger.error(f"Status overlay error: {e}")

    def process_frame(self, frame):
        if frame is None:
            return None
        try:
            rps_detections = []
            yolo_detections = []
            
            # Run RPS detection
            if self.rps_model:
                rps_results = self.rps_model.predict(
                    frame,
                    conf=0.5,  # Higher confidence threshold for RPS
                    verbose=False
                )[0]
                
                # Process RPS detections
                for box in rps_results.boxes:
                    confidence = float(box.conf[0])
                    class_id = int(box.cls[0])
                    class_name = rps_results.names[class_id]
                    
                    if confidence > 0.5:  # Additional confidence check
                        rps_detections.append(f"{class_name} ({confidence:.0%})")
                        # Draw RPS detection with class-specific color
                        self.draw_detection(
                            frame,
                            box.xyxy[0].tolist(),
                            class_name,
                            confidence,
                            self.colors.get(class_name.lower(), self.colors['other'])
                        )
            
            # Run YOLO object detection
            yolo_results = self.yolo_model.predict(
                frame,
                conf=0.4,
                verbose=False
            )[0]
            
            # Process YOLO detections
            for box in yolo_results.boxes:
                confidence = float(box.conf[0])
                class_id = int(box.cls[0])
                class_name = yolo_results.names[class_id]
                
                # Skip persons and low confidence detections
                if class_name.lower() == 'person' or confidence < 0.4:
                    continue
                
                # Add to status list
                yolo_detections.append(f"{class_name} ({confidence:.0%})")
                
                # Draw YOLO detection with orange color
                self.draw_detection(
                    frame,
                    box.xyxy[0].tolist(),
                    class_name,
                    confidence,
                    self.colors['other']
                )
            
            # Draw status overlay
            self.draw_status_overlay(frame, rps_detections, yolo_detections)
            
            return frame
            
        except Exception as e:
            logger.error(f"Processing error: {e}")
            logger.exception(e)
            return frame

    def draw_detection(self, image, box, label, confidence, color):
        try:
            x1, y1, x2, y2 = map(int, box)
            
            # Skip if box is too large (>80% of frame)
            h, w = image.shape[:2]
            box_area = (x2 - x1) * (y2 - y1)
            frame_area = h * w
            if box_area > 0.8 * frame_area:
                return
            
            # Draw box
            cv2.rectangle(image, (x1, y1), (x2, y2), color, 2)
            
            # Prepare text
            text = f'{label} {confidence:.0%}'
            font = cv2.FONT_HERSHEY_SIMPLEX
            font_scale = 0.7
            thickness = 2
            
            # Get text size
            text_size = cv2.getTextSize(text, font, font_scale, thickness)[0]
            
            # Draw background rectangle for text
            text_x = x1
            text_y = y1 - 10 if y1 - 10 > text_size[1] else y1 + text_size[1]
            cv2.rectangle(image, 
                         (text_x, text_y - text_size[1] - 10),
                         (text_x + text_size[0], text_y + 5),
                         color, -1)
            
            # Draw text
            cv2.putText(image, text, (text_x, text_y),
                       font, font_scale, (255, 255, 255), thickness)
            
        except Exception as e:
            logger.error(f"Drawing error: {e}")

    def cleanup(self):
        if self.cap and self.cap.isOpened():
            self.cap.release()
            logger.info("Camera released")

    def generate_frames(self):
        logger.info("Starting video capture...")
        try:
            while True:
                success, frame = self.cap.read()
                if not success:
                    continue
                
                processed_frame = self.process_frame(frame)
                if processed_frame is not None:
                    yield self._frame_to_bytes(processed_frame)
                
        except Exception as e:
            logger.error(f"Video capture error: {e}")
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
        <h1>Object and RPS Detection</h1>
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