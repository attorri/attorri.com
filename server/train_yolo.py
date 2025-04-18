from ultralytics import YOLO
import os

model = YOLO('yolov8n-cls.pt') 

# Train the model with 3 GPUs
results = model.train(
    data='rock_paper_scissors',
    epochs=100,
    imgsz=64,
    device='cpu'
)

last_run_dir = os.path.join(str(results.save_dir), 'weights', 'best.pt')

model.export(format='onnx') 

trained = YOLO(last_run_dir)

metrics = trained.val(data='rock_paper_scissors', split='test')

print('Test Top 1 Accuracy: {}'.format(metrics['accuracy_top1']))
print('Full Metrics: \n{}'.format(metrics))