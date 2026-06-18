'use client';

import React from 'react';
import { useCart } from '@/context/CartContext';
import { useRouter } from 'next/navigation';
import { X, Plus, Minus, Trash2 } from 'lucide-react';
import { createOrder } from '@/app/actions/order';
import { showToast } from '@/lib/toast';

interface CartDrawerProps {
  isLoggedIn: boolean;
}

export default function CartDrawer({ isLoggedIn }: CartDrawerProps) {
  const {
    items,
    isCartOpen,
    setIsCartOpen,
    updateQuantity,
    removeFromCart,
    cartTotal,
    clearCart,
  } = useCart();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [error, setError] = React.useState('');

  if (!isCartOpen) return null;

  const handleCheckout = async () => {
    if (!isLoggedIn) {
      showToast('주문하려면 로그인이 필요합니다.', 'error');
      setIsCartOpen(false);
      router.push('/login');
      return;
    }

    if (items.length === 0) return;

    setIsSubmitting(true);
    setError('');

    try {
      const result = await createOrder({
        restaurantId: items[0].restaurantId,
        totalPrice: cartTotal,
        items: items.map(item => ({
          menuId: item.id,
          quantity: item.quantity,
          price: item.price,
        })),
      });

      if (result.error) {
        setError(result.error);
      } else {
        showToast('주문이 완료되었습니다! 🍕');
        clearCart();
        setIsCartOpen(false);
        router.push('/orders');
        router.refresh();
      }
    } catch (e) {
      setError('주문 처리 중 오류가 발생했습니다. 다시 시도해 주세요.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="cart-overlay">
      <div className="cart-backdrop" onClick={() => setIsCartOpen(false)} />
      <div className="cart-content-drawer glass-panel">
        <div className="cart-header">
          <h2 className="cart-title">장바구니</h2>
          <button className="cart-close-btn" onClick={() => setIsCartOpen(false)}>
            <X size={20} />
          </button>
        </div>

        {error && (
          <div className="error-message" style={{ margin: '16px' }}>
            <span>⚠️</span>
            <span>{error}</span>
          </div>
        )}

        <div className="cart-body">
          {items.length === 0 ? (
            <div className="cart-empty">
              <span className="cart-empty-icon">🛒</span>
              <p>장바구니가 비어 있습니다.</p>
              <p className="cart-empty-sub">맛있는 음식을 담아보세요!</p>
            </div>
          ) : (
            <div className="cart-items-list">
              <div className="cart-restaurant-info">
                <span>📍 식당: <strong>{items[0].restaurantName}</strong></span>
              </div>
              {items.map((item) => (
                <div key={item.id} className="cart-item-card">
                  <div className="cart-item-info">
                    <h4 className="cart-item-name">{item.name}</h4>
                    <span className="cart-item-price">
                      {item.price.toLocaleString()}원
                    </span>
                  </div>
                  <div className="cart-item-controls">
                    <div className="quantity-selector">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="qty-btn"
                      >
                        <Minus size={12} />
                      </button>
                      <span className="qty-value">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="qty-btn"
                      >
                        <Plus size={12} />
                      </button>
                    </div>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="cart-item-delete"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {items.length > 0 && (
          <div className="cart-footer">
            <div className="cart-total-row">
              <span>총 결제금액</span>
              <span className="cart-total-price">
                {cartTotal.toLocaleString()}원
              </span>
            </div>
            <button
              onClick={handleCheckout}
              disabled={isSubmitting}
              className="btn btn-primary checkout-btn"
            >
              {isSubmitting ? '주문 처리 중...' : '주문하기'}
            </button>
          </div>
        )}
      </div>

      <style>{`
        .cart-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          z-index: 1000;
          display: flex;
          justify-content: flex-end;
        }
        .cart-backdrop {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.4);
          backdrop-filter: blur(4px);
        }
        .cart-content-drawer {
          position: relative;
          width: 100%;
          max-width: 420px;
          height: 100%;
          border-radius: 0;
          border-left: 1px solid var(--border-glass);
          display: flex;
          flex-direction: column;
          box-shadow: -10px 0 30px rgba(0,0,0,0.15);
          animation: slideIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        @keyframes slideIn {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
        .cart-header {
          padding: 24px;
          border-bottom: 1px solid var(--border-glass);
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .cart-close-btn {
          background: transparent;
          border: none;
          color: var(--text-muted);
          cursor: pointer;
          padding: 4px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s;
        }
        .cart-close-btn:hover {
          background: var(--primary-light);
          color: var(--primary);
        }
        .cart-body {
          flex: 1;
          overflow-y: auto;
          padding: 24px;
        }
        .cart-empty {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 100%;
          color: var(--text-muted);
          gap: 8px;
        }
        .cart-empty-icon {
          font-size: 48px;
          margin-bottom: 8px;
        }
        .cart-empty-sub {
          font-size: 13px;
        }
        .cart-restaurant-info {
          font-size: 13px;
          color: var(--text-muted);
          padding: 8px 12px;
          background: var(--primary-light);
          border-radius: var(--radius-sm);
          margin-bottom: 16px;
        }
        .cart-items-list {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        .cart-item-card {
          display: flex;
          justify-content: justify;
          align-items: center;
          padding: 16px;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid var(--border-glass);
          border-radius: var(--radius-md);
          gap: 12px;
        }
        .cart-item-info {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .cart-item-name {
          font-size: 15px;
          font-weight: 600;
          color: var(--text-main);
        }
        .cart-item-price {
          font-size: 13px;
          color: var(--primary);
          font-weight: 600;
        }
        .cart-item-controls {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .quantity-selector {
          display: flex;
          align-items: center;
          background: rgba(0, 0, 0, 0.05);
          border-radius: var(--radius-sm);
          padding: 4px;
          gap: 8px;
        }
        .qty-btn {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          border: none;
          background: var(--bg-card);
          color: var(--text-main);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s;
        }
        .qty-btn:hover {
          background: var(--primary);
          color: white;
        }
        .qty-value {
          font-size: 13px;
          font-weight: 600;
          min-width: 16px;
          text-align: center;
        }
        .cart-item-delete {
          background: transparent;
          border: none;
          color: var(--text-muted);
          cursor: pointer;
          padding: 6px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s;
        }
        .cart-item-delete:hover {
          color: var(--error);
          background: rgba(239, 68, 68, 0.1);
        }
        .cart-footer {
          padding: 24px;
          border-top: 1px solid var(--border-glass);
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        .cart-total-row {
          display: flex;
          justify-content: space-between;
          font-size: 15px;
          font-weight: 600;
          color: var(--text-main);
        }
        .cart-total-price {
          font-size: 18px;
          color: var(--primary);
          font-weight: 700;
        }
        .checkout-btn {
          width: 100%;
          padding: 14px;
          font-size: 16px;
        }
      `}</style>
    </div>
  );
}
