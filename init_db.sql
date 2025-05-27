-- 初始化数据库表结构

DROP TABLE IF EXISTS purchases;
DROP TABLE IF EXISTS redemptions;
DROP TABLE IF EXISTS members;
DROP TABLE IF EXISTS products;

-- 商品表
CREATE TABLE products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    barcode TEXT NOT NULL UNIQUE,
    price REAL NOT NULL,
    stock INTEGER NOT NULL,
    category TEXT
);

-- 会员表
CREATE TABLE members (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    phone TEXT NOT NULL UNIQUE,
    gender TEXT,
    birthday TEXT,
    email TEXT,
    photo TEXT,
    points INTEGER DEFAULT 0
);

-- 兑换记录表
CREATE TABLE redemptions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    member_id INTEGER NOT NULL,
    quantity INTEGER NOT NULL,
    points_used INTEGER NOT NULL,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (member_id) REFERENCES members(id) ON DELETE CASCADE
);

-- 购买记录表
CREATE TABLE purchases (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    member_id INTEGER NOT NULL,
    product_id INTEGER NOT NULL,
    product_name TEXT NOT NULL,
    category TEXT,
    purchased_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (member_id) REFERENCES members(id),
    FOREIGN KEY (product_id) REFERENCES products(id)
);

-- 插入初始商品数据（包含条码、分类）
INSERT INTO products (name, barcode, price, stock, category) VALUES
('矿泉水', '123456789012', 2.50, 30, '饮品'),
('纸巾',   '234567890123', 3.00, 52, '生活用品'),
('可乐',   '345678901234', 4.50, 30, '饮品'),
('垃圾袋', '456789012345', 1.50, 15, '家居'),
('保温杯', '567890123456', 25.00, 21, '杯具');
