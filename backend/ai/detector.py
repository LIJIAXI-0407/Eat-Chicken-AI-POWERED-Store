from ultralytics import YOLO

# 加载模型（首次运行会自动下载 yolov8n.pt）
model = YOLO("yolov8n.pt")

def count_people_from_image(image_path):
    results = model(image_path)
    count = 0
    for r in results:
        for c in r.boxes.cls:
            if int(c) == 0:  # 类别0表示“person”
                count += 1
    return count