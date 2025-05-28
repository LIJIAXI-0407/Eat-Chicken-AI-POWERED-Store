from flask import Blueprint, render_template, request, jsonify, current_app
import sqlite3
import math
import re
import time
import cv2
import numpy as np
from ultralytics import YOLO
from datetime import datetime, timedelta
import os

# 创建 Blueprint（注意：不要重复定义）
customer_bp = Blueprint('customer_bp', __name__, template_folder='../templates/customer')

# ----------------------- 数据库连接 -----------------------
def get_db_connection():
    conn = sqlite3.connect(current_app.config['DATABASE'])
    conn.row_factory = sqlite3.Row
    return conn

# ----------------------- 人脸检测模型初始化 -----------------------
FACE_MODEL_PATH = os.path.join(os.path.dirname(__file__), '../yolov8x-face-lindevs.pt')
face_model = YOLO(FACE_MODEL_PATH)

next_person_id = 0
lastDetections = {}
person_entry_times = {}
person_exit_times = {}

# ----------------------- AI 摄像检测相关 -----------------------
@customer_bp.route('/camera')
def camera_page():
    return render_template('customer/ai_detect.html')

@customer_bp.route('/detect', methods=['POST'])
def detect():
    global next_person_id, lastDetections, person_entry_times, person_exit_times

    file = request.files.get('image')
    if not file:
        return jsonify({'success': False, 'message': '未收到图片'}), 400

    img_bytes = np.frombuffer(file.read(), np.uint8)
    img = cv2.imdecode(img_bytes, cv2.IMREAD_COLOR)

    try:
        results = face_model(img, imgsz=640)[0]
    except Exception:
        return jsonify({'success': False, 'message': '推理失败'}), 500

    current_faces = []

    if results.boxes.xyxy is not None:
        for box in results.boxes.xyxy.cpu().numpy():
            x1, y1, x2, y2 = map(int, box)
            cx, cy = (x1 + x2) // 2, (y1 + y2) // 2

            matched_id = None
            for pid, last in lastDetections.items():
                lx, ly = last['center']
                distance = np.sqrt((cx - lx) ** 2 + (cy - ly) ** 2)
                if distance < 50:
                    matched_id = pid
                    break

            if matched_id is None:
                matched_id = next_person_id
                next_person_id += 1
                person_entry_times[matched_id] = time.time()

            current_faces.append({
                'x': x1,
                'y': y1,
                'width': x2 - x1,
                'height': y2 - y1,
                'id': matched_id,
                'center': (cx, cy)
            })

    detected_ids = set(face['id'] for face in current_faces)
    existing_ids = set(lastDetections.keys())
    exited_ids = existing_ids - detected_ids

    for pid in exited_ids:
        if pid in person_entry_times and pid not in person_exit_times:
            person_exit_times[pid] = time.time()

    lastDetections = {face['id']: face for face in current_faces}
    detections = [{k: v for k, v in face.items() if k != 'center'} for face in current_faces]

    return jsonify({'detections': detections})

@customer_bp.route('/average_stay_time', methods=['GET'])
def average_stay_time():
    total_time = 0
    count = 0
    for pid, entry_time in person_entry_times.items():
        if pid in person_exit_times:
            total_time += person_exit_times[pid] - entry_time
            count += 1
    average_time = total_time / count if count else 0
    return jsonify({'average_stay_time_seconds': average_time})

# ----------------------- AI 人数识别展示页 -----------------------

@customer_bp.route('/ai_demo')
def ai_demo():
    return render_template('customer/ai_detect.html')

# ----------------------- 顾客功能页 -----------------------
@customer_bp.route('/menu')
def customer_menu():
    return render_template('customer_menu.html')

@customer_bp.route('/register', methods=['GET', 'POST'])
def register():
    if request.method == 'POST':
        return jsonify({'status': '注册成功'})
    return render_template('customer/register.html')

@customer_bp.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        return jsonify({'status': '登录成功'})
    return render_template('customer/login.html')

@customer_bp.route('/scan')
def scan_redirect():
    return render_template('customer/scan_purchase.html')

@customer_bp.route('/scan_purchase')  # 保留旧路径兼容性
def scan_purchase():
    return render_template('customer/scan_purchase.html')

@customer_bp.route('/points')
def points():
    return render_template('customer/points.html')

@customer_bp.route('/home')
def customer_home():
    return render_template('customer/home.html')

@customer_bp.route('/cart')
def cart():
    return render_template('customer/cart.html')

@customer_bp.route('/member/<int:member_id>')
def member_detail(member_id):
    conn = get_db_connection()
    member = conn.execute('SELECT * FROM members WHERE id = ?', (member_id,)).fetchone()
    purchases = conn.execute('SELECT * FROM purchases WHERE member_id = ?', (member_id,)).fetchall()
    conn.close()
    return render_template('customer/member_detail.html', member=member, purchases=purchases)
