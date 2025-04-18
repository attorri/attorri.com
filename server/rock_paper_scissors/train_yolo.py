from ultralytics import YOLO
import os
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def train_model():
    try:
        # Load a model
        logger.info("Loading base model...")
        model = YOLO('yolov8n.pt')

        # Train the model with minimal settings
        logger.info("Starting training...")
        model.train(
            data='data.yaml',
            epochs=5,           # Very few epochs
            imgsz=320,         # Smaller image size
            batch=4,           # Small batch size
            device='cpu',
            verbose=True
        )

    except Exception as e:
        logger.error(f"Training failed: {e}")
        raise

if __name__ == '__main__':
    train_model()