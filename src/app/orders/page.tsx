import React from 'react';
import { redirect } from 'next/navigation';
import prisma from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

const STATUS_TEXT: Record<string, { label: string; color: string }> = {
  PENDING: { label: '주문 접수', color: '#ff9f43' },
  DELIVERING: { label: '배달 중', color: '#2e86de' },
  COMPLETED: { label: '배달 완료', color: '#10ac84' },
};

export default async function OrdersPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect('/login?redirect=/orders');
  }

  const orders = await prisma.order.findMany({
    where: { userId: user.id },
    include: {
      restaurant: true,
      orderItems: {
        include: {
          menu: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

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
                  <span
                    className="order-status-badge"
                    style={{ backgroundColor: status.color + '15', color: status.color, border: `1px solid ${status.color}30` }}
                  >
                    {status.label}
                  </span>
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
          gap: 12px;
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
      `}</style>
    </div>
  );
}
