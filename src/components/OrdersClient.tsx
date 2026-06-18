'use client';

import React, { useActionState, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createReview, ReviewActionState } from '@/app/actions/review';
import { updateOrderStatus } from '@/app/actions/order';
import { X, Star } from 'lucide-react';

interface OrderItem {
  id: string;
  quantity: number;
  price: number;
  menu: {
    name: string;
  } | null;
}

interface Order {
  id: string;
  totalPrice: number;
  status: string;
  createdAt: Date | string;
  restaurant: {
    name: string;
  };
  review: {
    id: string;
    rating: number;
    content: string;
  } | null;
  orderItems: OrderItem[];
}

interface OrdersClientProps {
  orders: Order[];
}

const STATUS_TEXT: Record<string, { label: string; color: string }> = {
  PENDING: { label: '주문 접수', color: '#ff9f43' },
  DELIVERING: { label: '배달 중', color: '#2e86de' },
  COMPLETED: { label: '배달 완료', color: '#10ac84' },
};

const initialActionState: ReviewActionState = {
  error: '',
  success: false,
};

export default function OrdersClient({ orders }: OrdersClientProps) {
  const router = useRouter();
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [rating, setRating] = useState(5);
  const [state, formAction, isPending] = useActionState(createReview, initialActionState);

  useEffect(() => {
    if (state?.success) {
      alert('리뷰가 등록되었습니다!');
      setSelectedOrder(null);
      setRating(5);
      router.refresh();
    }
  }, [state, router]);

  const handleOpenModal = (order: Order) => {
    setSelectedOrder(order);
    setRating(5);
  };

  const handleStatusUpdate = async (orderId: string, status: 'PENDING' | 'DELIVERING' | 'COMPLETED') => {
    const confirmUpdate = window.confirm(
      status === 'DELIVERING'
        ? '배달을 시작하시겠습니까?'
        : '배달을 완료 처리하시겠습니까?'
    );
    if (!confirmUpdate) return;
    
    try {
      const result = await updateOrderStatus(orderId, status);
      if (result.error) {
        alert(result.error);
      } else {
        router.refresh();
      }
    } catch (e) {
      alert('주문 상태 변경 중 오류가 발생했습니다.');
    }
  };

  return (
    <div className="orders-container">
      <h1 className="section-title">내 주문 내역</h1>

      {orders.length === 0 ? (
        <div className="no-orders glass-panel">
          <span className="no-orders-icon">🥡</span>
          <p>주문 내역이 없습니다.</p>
          <p className="no-orders-sub">Vibe Delivery에서 첫 주문을 완료해 보세요!</p>
        </div>
      ) : (
        <div className="orders-list">
          {orders.map((order) => {
            const status = STATUS_TEXT[order.status] || { label: order.status, color: 'var(--text-muted)' };
            const formattedDate = new Date(order.createdAt).toLocaleString('ko-KR', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            });

            return (
              <div key={order.id} className="order-card glass-panel">
                <div className="order-header">
                  <div className="order-header-left">
                    <span className="order-restaurant">{order.restaurant.name}</span>
                    <span className="order-date">{formattedDate}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    {order.status === 'PENDING' && (
                      <button
                        onClick={() => handleStatusUpdate(order.id, 'DELIVERING')}
                        className="btn btn-outline"
                        style={{ padding: '6px 12px', fontSize: '12px', borderColor: '#2e86de', color: '#2e86de' }}
                      >
                        🛵 배달 시작
                      </button>
                    )}
                    {order.status === 'DELIVERING' && (
                      <button
                        onClick={() => handleStatusUpdate(order.id, 'COMPLETED')}
                        className="btn btn-outline"
                        style={{ padding: '6px 12px', fontSize: '12px', borderColor: '#10ac84', color: '#10ac84' }}
                      >
                        ✅ 배달 완료
                      </button>
                    )}
                    {order.review ? (
                      <span className="review-done-badge">리뷰 작성 완료</span>
                    ) : order.status === 'COMPLETED' ? (
                      <button
                        onClick={() => handleOpenModal(order)}
                        className="btn btn-secondary"
                        style={{ padding: '6px 12px', fontSize: '13px' }}
                      >
                        리뷰 쓰기
                      </button>
                    ) : null}
                    <span
                      className="order-status-badge"
                      style={{ backgroundColor: status.color + '15', color: status.color, border: `1px solid ${status.color}30` }}
                    >
                      {status.label}
                    </span>
                  </div>
                </div>

                <div className="order-body">
                  <h4 className="body-label">주문 품목</h4>
                  <ul className="order-items-list">
                    {order.orderItems.map((item) => (
                      <li key={item.id} className="order-item-row">
                        <span className="item-name">
                          {item.menu ? item.menu.name : '삭제된 메뉴'} <strong className="item-qty">x{item.quantity}</strong>
                        </span>
                        <span className="item-price">
                          {(item.price * item.quantity).toLocaleString()}원
                        </span>
                      </li>
                    ))}
                  </ul>

                  {/* Display review details if written */}
                  {order.review && (
                    <div className="order-review-detail">
                      <span className="review-label">내가 남긴 리뷰</span>
                      <div className="review-stars">
                        {'★'.repeat(order.review.rating) + '☆'.repeat(5 - order.review.rating)}
                      </div>
                      <p className="review-text">"{order.review.content}"</p>
                    </div>
                  )}
                </div>

                <div className="order-footer">
                  <span>총 결제금액</span>
                  <span className="order-total-price">
                    {order.totalPrice.toLocaleString()}원
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Review Modal */}
      {selectedOrder && (
        <div className="modal-overlay">
          <div className="modal-backdrop" onClick={() => setSelectedOrder(null)} />
          <div className="modal-content glass-panel">
            <div className="modal-header">
              <h3>리뷰 작성하기</h3>
              <button className="modal-close" onClick={() => setSelectedOrder(null)}>
                <X size={20} />
              </button>
            </div>
            
            <form action={formAction} className="modal-body">
              <input type="hidden" name="orderId" value={selectedOrder.id} />
              <input type="hidden" name="rating" value={rating} />
              
              <div className="form-group" style={{ textAlign: 'center' }}>
                <label className="form-label" style={{ textAlign: 'center', marginBottom: '12px' }}>식당은 어떠셨나요? 별점을 선택해 주세요</label>
                <div className="star-selector">
                  {[1, 2, 3, 4, 5].map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => setRating(num)}
                      className={`star-btn ${num <= rating ? 'active' : ''}`}
                    >
                      <Star size={32} fill={num <= rating ? '#ffb800' : 'transparent'} />
                    </button>
                  ))}
                </div>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="content">솔직한 맛 평가를 들려주세요 (최소 5자)</label>
                <textarea
                  id="content"
                  name="content"
                  className="form-input"
                  placeholder="음식의 맛, 양, 배달 상태 등에 대해 상세한 솔직 리뷰를 남겨주세요."
                  rows={4}
                  style={{ resize: 'none' }}
                  required
                />
              </div>

              {state?.error && (
                <div className="error-message" style={{ margin: '0 0 16px 0' }}>
                  <span>⚠️</span>
                  <span>{state.error}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={isPending}
                className="btn btn-primary"
                style={{ width: '100%', padding: '12px' }}
              >
                {isPending ? '리뷰 등록 중...' : '리뷰 등록 완료'}
              </button>
            </form>
          </div>
        </div>
      )}

      <style>{`
        .orders-container {
          max-width: 800px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          gap: 32px;
        }
        .no-orders {
          padding: 80px 40px;
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
          color: var(--text-muted);
        }
        .no-orders-icon {
          font-size: 60px;
          margin-bottom: 12px;
        }
        .no-orders-sub {
          font-size: 13px;
        }
        .orders-list {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }
        .order-card {
          padding: 24px;
          display: flex;
          flex-direction: column;
          gap: 20px;
          transition: border-color 0.2s ease;
        }
        .order-card:hover {
          border-color: var(--primary);
        }
        .order-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          border-bottom: 1px solid var(--border-glass);
          padding-bottom: 16px;
        }
        .order-header-left {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .order-restaurant {
          font-size: 20px;
          font-weight: 700;
          color: var(--text-main);
          font-family: var(--font-title);
        }
        .order-date {
          font-size: 13px;
          color: var(--text-muted);
        }
        .review-done-badge {
          font-size: 13px;
          color: var(--success);
          background: rgba(16, 185, 129, 0.1);
          padding: 6px 12px;
          border-radius: var(--radius-sm);
          font-weight: 600;
        }
        .order-status-badge {
          padding: 6px 12px;
          border-radius: 50px;
          font-size: 13px;
          font-weight: 700;
          white-space: nowrap;
        }
        .order-body {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        .body-label {
          font-size: 14px;
          font-weight: 600;
          color: var(--text-muted);
        }
        .order-items-list {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .order-item-row {
          display: flex;
          justify-content: space-between;
          font-size: 15px;
          color: var(--text-main);
        }
        .item-qty {
          color: var(--primary);
          margin-left: 6px;
        }
        .order-review-detail {
          padding: 16px;
          background: var(--primary-light);
          border-radius: var(--radius-md);
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .review-label {
          font-size: 12px;
          font-weight: 700;
          color: var(--primary);
        }
        .order-review-detail .review-stars {
          color: #ffb800;
          font-size: 13px;
          letter-spacing: 1px;
        }
        .review-text {
          font-size: 14px;
          font-style: italic;
          color: var(--text-main);
        }
        .order-footer {
          border-top: 1px dashed var(--border-glass);
          padding-top: 16px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 15px;
          font-weight: 600;
        }
        .order-total-price {
          font-size: 20px;
          color: var(--primary);
          font-weight: 700;
        }
        /* Modal Styles */
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          z-index: 1000;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
        }
        .modal-backdrop {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.4);
          backdrop-filter: blur(4px);
        }
        .modal-content {
          position: relative;
          width: 100%;
          max-width: 480px;
          padding: 32px;
          display: flex;
          flex-direction: column;
          gap: 24px;
          animation: scaleUp 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        @keyframes scaleUp {
          from { transform: scale(0.95); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .modal-header h3 {
          font-size: 20px;
          color: var(--text-main);
        }
        .modal-close {
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
        .modal-close:hover {
          background: var(--primary-light);
          color: var(--primary);
        }
        .modal-body {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }
        .star-selector {
          display: flex;
          justify-content: center;
          gap: 8px;
        }
        .star-btn {
          background: transparent;
          border: none;
          cursor: pointer;
          color: var(--text-muted);
          transition: transform 0.2s ease;
        }
        .star-btn:hover {
          transform: scale(1.15);
        }
        .star-btn.active {
          color: #ffb800;
        }
      `}</style>
    </div>
  );
}
