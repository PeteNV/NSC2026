from ultralytics import YOLO

model = YOLO('v2/v2.pt')
model.export(format='coreml', imgsz=640, nms=True)
