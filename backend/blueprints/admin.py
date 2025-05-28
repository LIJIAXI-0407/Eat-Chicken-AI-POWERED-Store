
from flask import Blueprint, render_template, request, jsonify, current_app
import sqlite3

# 注册 Blueprint，指定模板目录为 admin 子目录
admin_bp = Blueprint('admin_bp', __name__, template_folder='../templates/admin')

# 数据库连接工具
def get_db_connection():
    conn = sqlite3.connect(current_app.config['DATABASE'])
    conn.row_factory = sqlite3.Row
    return conn

# --------------------- 管理端菜单页 ---------------------
@admin_bp.route('/menu')
def admin_menu():
    return render_template('admin_menu.html')

# --------------------- 添加商品页 ---------------------
@admin_bp.route('/add_product', methods=['GET', 'POST'])
def add_product():
    if request.method == 'POST':
        name = request.form.get('name')
        price = request.form.get('price')
        stock = request.form.get('stock')
        if name and price and stock:
            conn = get_db_connection()
            conn.execute('INSERT INTO products (name, price, stock) VALUES (?, ?, ?)', (name, price, stock))
            conn.commit()
            conn.close()
            return jsonify({'status': '商品添加成功'})
    return render_template('add_product.html')

# --------------------- 商品列表页 ---------------------
@admin_bp.route('/product_list')
def product_list():
    conn = get_db_connection()
    products = conn.execute('SELECT * FROM products').fetchall()
    conn.close()
    return render_template('product_list.html', products=products)

# --------------------- 会员积分总览页 ---------------------
@admin_bp.route('/points')
def points_summary():
    conn = get_db_connection()
    members = conn.execute('SELECT id, name, points FROM members').fetchall()
    conn.close()
    return render_template('points.html', members=members)

# --------------------- 顾客信息查看页 ---------------------
@admin_bp.route('/members')
def members_list():
    conn = get_db_connection()
    members = conn.execute('SELECT * FROM members').fetchall()
    conn.close()
    return render_template('members_list.html', members=members)

# --------------------- API：获取商品列表（供前端调用） ---------------------
@admin_bp.route('/products', methods=['GET'])
def api_get_products():
    conn = get_db_connection()
    products = conn.execute('SELECT * FROM products').fetchall()
    result = [dict(row) for row in products]
    conn.close()
    return jsonify(result)

# --------------------- API：添加新商品 ---------------------
@admin_bp.route('/products', methods=['POST'])
def api_add_product():
    data = request.json
    name = data.get('name', '')
    barcode = data.get('barcode', '')
    price = float(data.get('price', 0))
    stock = int(data.get('stock', 0))
    conn = get_db_connection()
    cursor = conn.execute('INSERT INTO products (name, barcode, price, stock) VALUES (?, ?, ?, ?)',
                          (name, barcode, price, stock))
    conn.commit()
    new_id = cursor.lastrowid
    conn.close()
    return jsonify({'success': True, 'product': {
        'id': new_id, 'name': name, 'barcode': barcode, 'price': price, 'stock': stock
    }})

# --------------------- API：更新商品信息 ---------------------
@admin_bp.route('/products/<int:product_id>', methods=['PUT'])
def api_update_product(product_id):
    data = request.json
    name = data.get('name', '')
    barcode = data.get('barcode', '')
    price = float(data.get('price', 0))
    stock = int(data.get('stock', 0))
    conn = get_db_connection()
    conn.execute('UPDATE products SET name=?, barcode=?, price=?, stock=? WHERE id=?',
                 (name, barcode, price, stock, product_id))
    conn.commit()
    conn.close()
    return jsonify({'success': True})

# --------------------- API：删除商品 ---------------------
@admin_bp.route('/products/<int:product_id>', methods=['DELETE'])
def api_delete_product(product_id):
    conn = get_db_connection()
    conn.execute('DELETE FROM products WHERE id=?', (product_id,))
    conn.commit()
    conn.close()
    return jsonify({'success': True})
