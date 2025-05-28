
from flask import Flask, render_template, request, jsonify
import sqlite3
import os
import socket
from blueprints.admin import admin_bp
from blueprints.customer import customer_bp
from blueprints.ai import ai_bp
from ai.detector import count_people_from_image

# 数据库文件路径
DATABASE = os.path.join(os.path.abspath(os.path.dirname(__file__)), "database.db")
INIT_DB_SCRIPT = os.path.join(os.path.abspath(os.path.dirname(__file__)), "init_db.sql")

app = Flask(__name__)
app.config['DATABASE'] = DATABASE

# 注册蓝图：AI模块、管理端、顾客端
app.register_blueprint(ai_bp)
app.register_blueprint(admin_bp, url_prefix='/admin')
app.register_blueprint(customer_bp, url_prefix='/customer')

# 首页
@app.route('/')
def index():
    return render_template('index.html')

# 管理端菜单页面
@app.route('/admin/menu')
def admin_menu():
    return render_template('admin_menu.html')

# AI人数识别接口
@app.route('/ai/infer_people', methods=['POST'])
def infer_people():
    file = request.files['image']
    path = 'temp.jpg'
    file.save(path)
    print("收到图片，开始识别...")

    try:
        count = count_people_from_image(path)
        print(f"识别结果：{count}")
        return jsonify({"num_people": count})
    except Exception as e:
        print("识别失败：", e)
        return jsonify({"num_people": 0})
    finally:
        if os.path.exists(path):
            os.remove(path)

# AI人数识别演示页面
@app.route('/ai_demo')
def ai_demo():
    return render_template('ai_demo.html')

# AI聊天页面（小机器人跳转目标）
@app.route('/ai_chat')
def ai_chat_page():
    return render_template('ai_chat.html')

# 初始化数据库
def init_db():
    with sqlite3.connect(app.config['DATABASE']) as conn:
        with open(INIT_DB_SCRIPT, 'r', encoding='utf-8') as f:
            conn.executescript(f.read())
        print("✅ 数据库已强制初始化。")

# 获取局域网 IP（用于本地网络访问）
def get_local_ip():
    s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    try:
        s.connect(('10.255.255.255', 1))
        IP = s.getsockname()[0]
    except Exception:
        IP = '127.0.0.1'
    finally:
        s.close()
    return IP

if __name__ == '__main__':
    init_db()
    local_ip = get_local_ip()
    print(f"📱 手机访问地址：http://{local_ip}:8080")
    app.run(debug=True, host='0.0.0.0', port=8080)
