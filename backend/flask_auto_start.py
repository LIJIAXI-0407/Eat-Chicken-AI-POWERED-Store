import os
import socket
import sqlite3
from flask import Flask, render_template
from blueprints.admin import admin_bp
from blueprints.customer import customer_bp

# 动态选择可用端口（8000起）
def find_free_port(start=8000):
    for port in range(start, start + 100):
        with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
            if s.connect_ex(('0.0.0.0', port)) != 0:
                return port
    raise RuntimeError("找不到可用端口")

# 获取本机局域网 IP 地址
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

# Flask 初始化
app = Flask(__name__)
DATABASE = os.path.join(os.path.abspath(os.path.dirname(__file__)), "database.db")
INIT_DB_SCRIPT = os.path.join(os.path.abspath(os.path.dirname(__file__)), "init_db.sql")
app.config['DATABASE'] = DATABASE

# 注册蓝图
app.register_blueprint(admin_bp, url_prefix='/admin')
app.register_blueprint(customer_bp, url_prefix='/customer')

@app.route('/')
def index():
    return render_template('index.html')

def init_db():
    if not os.path.exists(DATABASE):
        with sqlite3.connect(DATABASE) as conn:
            with open(INIT_DB_SCRIPT, 'r', encoding='utf-8') as f:
                conn.executescript(f.read())
        print("✅ 数据库已初始化。")

if __name__ == '__main__':
    init_db()
    local_ip = get_local_ip()
    port = find_free_port(8000)
    print(f"📱 手机访问地址：http://{local_ip}:{port}")
    app.run(debug=True, host='0.0.0.0', port=port)
