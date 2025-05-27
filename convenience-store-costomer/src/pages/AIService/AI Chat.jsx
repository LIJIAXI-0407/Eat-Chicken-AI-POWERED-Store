import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BackArrow from '../../components/BackArrow';
import chatSupportRobot from '../../assets/images/UI/8. Chat Support Robot.png';

const AIChat = () => {
  const navigate = useNavigate();
  const [isVoiceMode, setIsVoiceMode] = useState(false);
  const [inputText, setInputText] = useState('');
  const [messages, setMessages] = useState([]);

  const handleBack = () => {
    navigate('/');
  };

  const toggleInputMode = () => {
    setIsVoiceMode(!isVoiceMode);
  };

  const handleSendMessage = () => {
    if (inputText.trim()) {
      setMessages([...messages, { text: inputText, isUser: true }]);
      setInputText('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      <style>
        {`
          @keyframes shake {
            0%, 100% {
              transform: rotate(0deg);
            }
            25% {
              transform: rotate(-10deg);
            }
            75% {
              transform: rotate(10deg);
            }
          }
          .bouncing-robot {
            animation: shake 2s ease-in-out infinite;
            transform-origin: bottom center;
          }
        `}
      </style>
      {/* 标题栏与返回箭头 */}
      <div style={{ 
        paddingTop: '35px',
        paddingLeft: '35px',
        paddingRight: '10px',
        marginBottom: '20px'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'flex-start'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '15px',
            marginTop: '15px'
          }}>
            <div onClick={handleBack} style={{ cursor: 'pointer' }}>
              <BackArrow />
            </div>
            <img 
              src={chatSupportRobot}
              alt="Chat Support Robot"
              className="bouncing-robot"
              style={{
                width: '90px',
                height: '90px',
                marginTop: '-20px'
              }}
            />
          </div>
        </div>
      </div>

      {/* 聊天消息区域 */}
      <div style={{
        padding: '0 20px',
        height: 'calc(100% - 180px)',
        overflowY: 'auto'
      }}>
        {messages.map((message, index) => (
          <div
            key={index}
            style={{
              display: 'flex',
              justifyContent: message.isUser ? 'flex-end' : 'flex-start',
              marginBottom: '16px'
            }}
          >
            <div style={{
              maxWidth: '80%',
              padding: '12px 16px',
              borderRadius: message.isUser ? '20px 20px 4px 20px' : '20px 20px 20px 4px',
              backgroundColor: message.isUser ? '#1DA1FA' : '#F0F0F0',
              color: message.isUser ? '#FFFFFF' : '#000000',
              fontSize: '16px',
              lineHeight: '1.4'
            }}>
              {message.text}
            </div>
          </div>
        ))}
      </div>

      {/* 底部聊天输入框 */}
      <div style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        padding: '20px',
        backgroundColor: '#fff',
        boxShadow: '0px -2px 10px rgba(0, 0, 0, 0.1)'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          maxWidth: '600px',
          margin: '0 auto'
        }}>
          {/* 切换语音/文字按钮 */}
          <button
            onClick={toggleInputMode}
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              border: 'none',
              backgroundColor: '#1DA1FA',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              cursor: 'pointer',
              flexShrink: 0
            }}
          >
            {isVoiceMode ? (
              <span style={{ color: '#fff', fontSize: '20px' }}>Aa</span>
            ) : (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 14C13.66 14 15 12.66 15 11V5C15 3.34 13.66 2 12 2C10.34 2 9 3.34 9 5V11C9 12.66 10.34 14 12 14Z" fill="white"/>
                <path d="M17 11C17 13.76 14.76 16 12 16C9.24 16 7 13.76 7 11H5C5 14.53 7.61 17.43 11 17.92V21H13V17.92C16.39 17.43 19 14.53 19 11H17Z" fill="white"/>
              </svg>
            )}
          </button>

          {/* 输入框 */}
          {!isVoiceMode ? (
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
              style={{
                flex: 1,
                height: '40px',
                borderRadius: '20px',
                border: '1px solid #E0E0E0',
                padding: '0 20px',
                fontSize: '16px',
                outline: 'none'
              }}
            />
          ) : (
            <div style={{
              flex: 1,
              height: '40px',
              borderRadius: '20px',
              backgroundColor: '#F5F5F5',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              fontSize: '16px',
              color: '#666'
            }}>
              Hold to speak
            </div>
          )}

          {/* 发送按钮 */}
          <button
            onClick={handleSendMessage}
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              border: 'none',
              backgroundColor: '#1DA1FA',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              cursor: 'pointer',
              flexShrink: 0
            }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M2.01 21L23 12L2.01 3L2 10L17 12L2 14L2.01 21Z" fill="white"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AIChat; 