import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import WelcomeHeader from '../../components/WelcomeHeader';
import WhiteRectangle from '../../components/WhiteRectangle';
// import NotificationBell from '../../components/NotificationBell';
import '../../styles/shared.css';
import './order.css';

const Order = () => {
  // 订单记录状态
  const [orders, setOrders] = useState([
    {
      revenue: '$3.99',
      date: '24/5/2025 14:38',
      product: 'Cocacola',
      customer: 'Tom Lee',
      amount: '1',
      status: 'Brought'
    }
  ]);

  // 总收益状态
  const [totalRevenue, setTotalRevenue] = useState(0);

  // 计算总收益的函数
  const calculateTotalRevenue = (orderList) => {
    const total = orderList.reduce((sum, order) => {
      // 移除 $ 符号并转换为数字
      const price = parseFloat(order.revenue.replace('$', ''));
      return sum + price;
    }, 0);
    return total.toFixed(2); // 保留两位小数
  };

  // 当订单记录改变时更新总收益
  useEffect(() => {
    const total = calculateTotalRevenue(orders);
    setTotalRevenue(total);
  }, [orders]);

  // 添加新订单的函数（后续可以连接到实际的销售系统）
  const addNewOrder = (newOrder) => {
    setOrders(prevOrders => [...prevOrders, newOrder]);
  };

  return (
    <div className="dashboard-container">
      <Sidebar />
      <div className="dashboard-main">
        {/* <NotificationBell /> */}
        <div className="order-welcome-container">
          <WelcomeHeader />
        </div>
        <div className="order-rectangle-wrapper">
          <WhiteRectangle title={`Total Revenue: $${totalRevenue}`}>
            <div className="order-labels-row">
              <div className="order-label">Revenue</div>
              <div className="order-label">Date</div>
              <div className="order-label">Product Name</div>
              <div className="order-label">Customer</div>
              <div className="order-label">Total Amount</div>
              <div className="order-label">Status</div>
            </div>
            <div className="order-separator"></div>
            {orders.map((order, index) => (
              <div key={index} className="order-data-row">
                <div className="order-data-cell">{order.revenue}</div>
                <div className="order-data-cell">{order.date}</div>
                <div className="order-data-cell">{order.product}</div>
                <div className="order-data-cell">{order.customer}</div>
                <div className="order-data-cell">{order.amount}</div>
                <div className="order-data-cell">{order.status}</div>
              </div>
            ))}
          </WhiteRectangle>
        </div>
      </div>
    </div>
  );
};

export default Order; 