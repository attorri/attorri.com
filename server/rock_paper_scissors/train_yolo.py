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
        base_model_path = os.path.join('..', 'yolov8n.pt')
        model = YOLO(base_model_path)  # load a pretrained DETECTION model

        # Train the model
        logger.info("Starting training...")
        results = model.train(
            data='data.yaml',  # Use local data.yaml since we're in the same directory
            epochs=50,
            imgsz=640,
            patience=10,
            batch=16,
            device='cpu',
            verbose=True
        )

        # Validate the model
        logger.info("Validating model...")
        metrics = model.val()
        logger.info(f"\nValidation Results:")
        logger.info(f"mAP50: {metrics.box.map50:.3f}")
        logger.info(f"mAP50-95: {metrics.box.map:.3f}")

        # Export the model
        logger.info("Exporting model...")
        model.export(format='onnx')

    except Exception as e:
        logger.error(f"Training failed: {e}")
        raise

if __name__ == '__main__':
    train_model()