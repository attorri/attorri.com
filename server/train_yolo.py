from ultralytics import YOLO

model = YOLO('yolov8n-cls.pt')

data_dir = 'rock_paper_scissors'

results= model.train(
    data=data_dir,
    epochs=32,
    imgsz=300,
    device='cpu'
)

last_run_dir = results.save_dir + '/weights/best.pt'

trained = YOLO(last_run_dir)

metrics = trained.val(data='rock_paper_scissors', split='test')

print('Test Top 1 Accuracy: {}'.format(metrics['accuracy_top1']))
print('Full Metrics: \n{}'.format(metrics))