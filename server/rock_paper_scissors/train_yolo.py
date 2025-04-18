from ultralytics import YOLO
import os
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def train_model():
    try:
        # Load a model
        logger.info("Loading base classification model...")
        model = YOLO('yolov8n-cls.pt')  # Load the base classification model

        # Train the model
        logger.info("Starting training...")
        model.train(
            data='.',  # Current directory containing train/val folders
            epochs=50,
            imgsz=224,
            batch=32,
            device='cpu',
            verbose=True,
            patience=20,
            save=True,
            plots=True,
            augment=True,
            mixup=0.1,
            copy_paste=0.1,
            degrees=10.0,
            translate=0.1,
            scale=0.5,
            fliplr=0.5,
            mosaic=0.5
        )

    except Exception as e:
        logger.error(f"Training failed: {e}")
        raise

if __name__ == '__main__':
    train_model()