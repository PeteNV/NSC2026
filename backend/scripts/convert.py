from ultralytics import YOLO

# Insert path to weights file
model = YOLO('v1/v1.pt')

# For image trained at 640px
# Export to CoreML
# nms=True adds 'Non-Maximum Suppression' logic directly into the model
model.export(format='coreml', imgsz=640, nms=True)
