import React from 'react';
import { useNavigate } from 'react-router-dom';
import BackArrow from '../../components/BackArrow';
import Avatar from '../../components/Avatar';
import CartItem from '../../components/CartItem/CartItem';
import touchNGoIcon from '../../assets/images/icons/Touch n go.png';
import useQuantityStore from '../../store/quantityStore';
import useHistoryStore from '../../store/historyStore';
import useUserStore from '../../store/userStore';

const Cart = () => {
  const navigate = useNavigate();
  const [selectedPayment, setSelectedPayment] = React.useState('touchngo');
  const cartItems = useQuantityStore(state => state.cartItems);
  const updateQuantity = useQuantityStore(state => state.updateQuantity);
  const addToHistory = useHistoryStore(state => state.addToHistory);
  const updatePoints = useUserStore(state => state.updatePoints);
  const currentUser = useUserStore(state => state.currentUser);

  const handleBack = () => {
    navigate('/');
  };

  const handleCheckout = () => {
    if (!currentUser) {
      // Redirect to login if user is not authenticated
      navigate('/login');
      return;
    }

    // Save cart items to history
    addToHistory(cartItems);
    
    // Update user points
    const pointsToAdd = Math.floor(total);
    updatePoints(pointsToAdd);
    
    // Clear cart by setting quantity to 0 for all items
    cartItems.forEach(item => {
      updateQuantity(item.id, 0);
    });
    
    navigate('/payment-success');
  };

  // Calculate total
  const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return (
    <div style={{ 
      width: '100%', 
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      background: '#FBFBFD',
      position: 'fixed',
      top: 0,
      left: 0
    }}>
      {/* Fixed Header Section */}
      <div style={{
        padding: '20px',
        background: '#FBFBFD',
        position: 'relative',
        flexShrink: 0
      }}>
        {/* Back Arrow and Title */}
        <div style={{ 
          paddingTop: '40px',
          display: 'flex',
          alignItems: 'center',
          gap: '15px',
          marginBottom: '20px',
          paddingRight: '20px',
          marginRight: '200px'
        }}>
          <div onClick={handleBack} style={{ cursor: 'pointer', marginLeft: 'auto' }}>
            <BackArrow />
          </div>
          <h1 style={{ 
            fontFamily: 'SF Pro Display, sans-serif',
            fontSize: '28px',
            fontWeight: '800',
            margin: 0,
            lineHeight: '30px'
          }}>Cart</h1>
        </div>

        {/* Avatar */}
        <div style={{
          position: 'absolute',
          top: '60px',
          right: '35px'
        }}>
          <Avatar />
        </div>

        {/* My Cart List text */}
        <div>
          <div style={{
            color: '#000',
            fontFamily: 'SF Pro Display',
            fontSize: '44px',
            fontWeight: 700,
            lineHeight: '32px',
            marginLeft: '-10px'
          }}>
            My
          </div>
          <div style={{
            color: '#000',
            fontFamily: 'SF Pro Display',
            fontSize: '42px',
            fontWeight: 400,
            lineHeight: '32px',
            marginTop: '10px'
          }}>
            Cart List
          </div>
        </div>
      </div>

      {/* Scrollable Cart Items Section */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: '0 20px',
        marginBottom: '20px'
      }}>
        {cartItems.map(item => (
          <CartItem 
            key={item.id}
            productName={item.productName}
            price={item.price}
            quantity={item.quantity}
            onIncrement={() => updateQuantity(item.id, item.quantity + 1)}
            onDecrement={() => updateQuantity(item.id, item.quantity - 1)}
          />
        ))}
      </div>

      {/* Fixed Payment Section */}
      <div style={{
        background: '#FBFBFD',
        padding: '15px 105px 50px 105px',
        boxShadow: '0px -4px 10px rgba(0, 0, 0, 0.1)',
        flexShrink: 0,
        marginTop: '-15px',
        maxWidth: '390px',
        margin: '0 auto'
      }}>
        {!currentUser && (
          <div style={{
            color: '#FF4D4F',
            fontFamily: 'SF Pro Display',
            fontSize: '14px',
            textAlign: 'center',
            marginBottom: '10px'
          }}>
            Please login to checkout
          </div>
        )}
        
        {/* Payment Methods */}
        <div style={{ marginBottom: '5px' }}>
          {/* Touch n Go */}
          <div 
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              height: '45px',
              marginTop: '0',
              padding: '0 5px',
              cursor: 'pointer'
            }}
            onClick={() => navigate('/touch-n-go')}
          >
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              position: 'relative',
              width: '100%'
            }}>
              <img 
                src={touchNGoIcon}
                alt="Touch n Go"
                style={{
                  width: '55px',
                  height: '55px',
                  objectFit: 'contain',
                  marginLeft: '-75px',
                  marginTop: '-5px'
                }}
              />
              <div style={{
                color: '#000',
                fontFamily: 'SF Pro Display',
                fontSize: '15px',
                fontWeight: 200,
                position: 'absolute',
                right: '-80px'
              }}>
                123456789
              </div>
            </div>
          </div>
        </div>

        {/* Dashed line */}
        <div style={{
          width: '180%',
          height: 0,
          border: 'none',
          borderTop: '3px dashed #000',
          margin: '10px -60px 10px -70px'
        }}></div>

        {/* Total */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '20px',
          padding: '0 20px'
        }}>
          <div style={{
            color: '#000',
            fontFamily: 'SF Pro Display',
            fontSize: '28px',
            fontWeight: 600,
            marginLeft: '-90px'
          }}>
            Total
          </div>
          <div style={{
            color: '#000',
            fontFamily: 'SF Pro Display',
            fontSize: '28px',
            fontWeight: 600,
            marginRight: '-80px'
          }}>
            ${total.toFixed(2)}
          </div>
        </div>

        {/* Checkout Button */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          marginTop: '5px'
        }}>
          <button 
            onClick={handleCheckout}
            className="interactive-btn"
            style={{
              width: '172px',
              height: '50px',
              borderRadius: '10px',
              background: '#1DA1FA',
              boxShadow: '1px 1px 1px 0px rgba(0, 0, 0, 0.25)',
              border: 'none',
              cursor: 'pointer',
              color: '#FFFBFB',
              fontFamily: 'SF Pro Display',
              fontSize: '18px',
              fontWeight: 500,
              lineHeight: '125%',
              letterSpacing: '0.36px'
            }}
          >
            Checkout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart; 