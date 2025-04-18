import os
import shutil
from pathlib import Path
import cv2

def convert_to_yolo_format():
    # Define paths
    base_path = Path('train/images')
    output_path = Path('train_yolo')
    output_path.mkdir(exist_ok=True)
    
    # Class mapping
    class_map = {'rock': 0, 'paper': 1, 'scissors': 2}
    
    # Process each class
    for class_name, class_id in class_map.items():
        class_path = base_path / class_name
        if not class_path.exists():
            continue
            
        # Process each image
        for img_path in class_path.glob('*.jpg'):
            # Read image to get dimensions
            img = cv2.imread(str(img_path))
            if img is None:
                continue
                
            h, w = img.shape[:2]
            
            # Create label file
            label_path = output_path / f"{img_path.stem}.txt"
            
            # Calculate center and size (full image)
            x_center = 0.5
            y_center = 0.5
            width = 1.0
            height = 1.0
            
            # Write YOLO format label
            with open(label_path, 'w') as f:
                f.write(f"{class_id} {x_center} {y_center} {width} {height}\n")
            
            # Copy image to output directory
            shutil.copy(img_path, output_path / img_path.name)

if __name__ == '__main__':
    convert_to_yolo_format() 