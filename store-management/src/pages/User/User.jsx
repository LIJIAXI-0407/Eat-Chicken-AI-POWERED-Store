import React, { useState } from 'react';
import Sidebar from '../../components/Sidebar';
import WelcomeHeader from '../../components/WelcomeHeader';
import WhiteRectangle from '../../components/WhiteRectangle';
// import NotificationBell from '../../components/NotificationBell';
import '../../styles/shared.css';
import './user.css';

const User = () => {
  const [users, setUsers] = useState([
    {
      no: '001',
      name: 'Tom Lee',
      birthday: '08/08/2000',
      career: 'Student',
      email: '12345@qq.com',
      rewards: '20/1000'
    }
  ]);
  // const [editingCell, setEditingCell] = useState(null);

  // const handleCellClick = (userId, field) => {
  //   setEditingCell({ id: userId, field });
  // };

  // const handleCellChange = (e, userId, field) => {
  //   const value = e.target.value;
  //   setUsers(users.map(user => {
  //     if (user.no === userId) {
  //       return { ...user, [field]: value };
  //     }
  //     return user;
  //   }));
  // };

  // const handleInputBlur = () => {
  //   setEditingCell(null);
  // };

  // const handleInputKeyDown = (e) => {
  //   if (e.key === 'Enter') {
  //     setEditingCell(null);
  //   }
  // };

  // 移除 renderCell 函数
  // const renderCell = (user, field) => { ... };

  return (
    <div className="dashboard-container">
      <Sidebar />
      <div className="dashboard-main">
        {/* <NotificationBell /> */}
        <div className="user-welcome-container">
          <WelcomeHeader />
        </div>
        <div className="user-rectangle-wrapper">
          <WhiteRectangle title="User List">
            <div className="user-labels-row">
              <div className="user-label">No.</div>
              <div className="user-label">Name</div>
              <div className="user-label">Birthday</div>
              <div className="user-label">Career</div>
              <div className="user-label">Email</div>
              <div className="user-label">Rewards</div>
            </div>
            <div className="user-separator"></div>
            {users
              .slice() // 创建一个副本以避免直接修改state
              .sort((a, b) => a.no.localeCompare(b.no)) // 按用户编号升序排序
              .map((user, index) => (
                <div key={index} className="user-data-row">
                  <div className="user-data-cell">{user.no}</div>
                  {/* 直接渲染静态文本 */}
                  <div className="user-data-cell">{user.name}</div>
                  <div className="user-data-cell">{user.birthday}</div>
                  <div className="user-data-cell">{user.career}</div>
                  <div className="user-data-cell">{user.email}</div>
                  <div className="user-data-cell">{user.rewards}</div>
                </div>
              ))}
          </WhiteRectangle>
        </div>
      </div>
    </div>
  );
};

export default User; 