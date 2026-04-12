from ultralytics import YOLO

# Insert path to weights file
model = YOLO('weights.pt')

# Foor image trained at 640px
# Export to CoreML
# nms=True adds 'Non-Maximum Suppression' logic directly into the model
model.export(format='coreml', imgsz=640, nms=True)
