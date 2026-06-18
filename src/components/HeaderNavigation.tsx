'use client';

import React from 'react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { logout } from '@/app/actions/auth';
import { ShoppingBag } from 'lucide-react';

interface HeaderNavigationProps {
  user: {
    name: string;
    email: string;
  } | null;
}

export default function HeaderNavigation({ user }: HeaderNavigationProps) {
  const { cartCount, setIsCartOpen } = useCart();

  return (
    <header className="main-header">
      <div className="header-container">
        <Link href="/" className="logo">
          🍕 Vibe Delivery
        </Link>

        <nav>
          <ul className="nav-links">
            <li>
              <Link href="/" className="nav-link">
                식당 목록
              </Link>
            </li>
            {user ? (
              <>
                <li>
                  <Link href="/orders" className="nav-link">
                    내 주문 내역
                  </Link>
                </li>
                <li style={{ fontSize: '14px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center' }}>
                  <strong>{user.name}</strong>님
                </li>
                <li>
                  <button
                    onClick={() => setIsCartOpen(true)}
                    className="btn btn-secondary"
                    style={{ padding: '6px 12px', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px' }}
                  >
                    <ShoppingBag size={16} />
                    <span>장바구니</span>
                    {cartCount > 0 && (
                      <span className="cart-badge">{cartCount}</span>
                    )}
                  </button>
                </li>
                <li>
                  <form action={logout}>
                    <button type="submit" className="btn btn-outline" style={{ padding: '6px 12px', fontSize: '13px' }}>
                      로그아웃
                    </button>
                  </form>
                </li>
              </>
            ) : (
              <>
                <li>
                  <button
                    onClick={() => setIsCartOpen(true)}
                    className="btn btn-secondary"
                    style={{ padding: '6px 12px', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px' }}
                  >
                    <ShoppingBag size={16} />
                    <span>장바구니</span>
                    {cartCount > 0 && (
                      <span className="cart-badge">{cartCount}</span>
                    )}
                  </button>
                </li>
                <li>
                  <Link href="/login" className="btn btn-outline" style={{ padding: '6px 16px', fontSize: '13px' }}>
                    로그인
                  </Link>
                </li>
                <li>
                  <Link href="/signup" className="btn btn-primary" style={{ padding: '6px 16px', fontSize: '13px' }}>
                    회원가입
                  </Link>
                </li>
              </>
            )}
          </ul>
        </nav>
      </div>

      <style>{`
        .cart-badge {
          background: var(--error);
          color: white;
          border-radius: 50%;
          padding: 2px 6px;
          font-size: 11px;
          font-weight: 700;
          min-width: 18px;
          height: 18px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
        }
      `}</style>
    </header>
  );
}
