'use client';

import React from 'react';
import { useCart } from '@/context/CartContext';
import { ShoppingBag } from 'lucide-react';

interface Menu {
  id: string;
  name: string;
  price: number;
  description: string;
  image: string;
}

interface Restaurant {
  id: string;
  name: string;
  category: string;
  image: string;
  description: string;
  address: string;
}

interface RestaurantDetailClientProps {
  restaurant: Restaurant;
  menus: Menu[];
}

const CATEGORY_STYLES: Record<string, { gradient: string; emoji: string }> = {
  "양식/버거": { gradient: "linear-gradient(135deg, #ff9f43, #ff5e3a)", emoji: "🍔" },
  "한식/족발": { gradient: "linear-gradient(135deg, #10ac84, #01a3a4)", emoji: "🍖" },
  "중식/아시안": { gradient: "linear-gradient(135deg, #ee5253, #ff9f43)", emoji: "🍜" },
  "일식/돈까스": { gradient: "linear-gradient(135deg, #2e86de, #54a0ff)", emoji: "🍣" },
  "양식/이탈리안": { gradient: "linear-gradient(135deg, #00d2d3, #01a3a4)", emoji: "🍝" },
  "default": { gradient: "linear-gradient(135deg, #ff9f43, #ff5e3a)", emoji: "🍱" }
};

export default function RestaurantDetailClient({ restaurant, menus }: RestaurantDetailClientProps) {
  const { addToCart } = useCart();
  const style = CATEGORY_STYLES[restaurant.category] || CATEGORY_STYLES.default;

  const handleAdd = (menu: Menu) => {
    addToCart({
      id: menu.id,
      name: menu.name,
      price: menu.price,
      restaurantId: restaurant.id,
      restaurantName: restaurant.name,
    });
  };

  return (
    <div className="detail-container">
      {/* Restaurant Header Banner */}
      <div className="restaurant-banner glass-panel">
        <div className="banner-visual" style={{ background: style.gradient }}>
          <span className="banner-emoji">{style.emoji}</span>
        </div>
        <div className="banner-info">
          <span className="banner-tag">{restaurant.category}</span>
          <h1 className="banner-title">{restaurant.name}</h1>
          <p className="banner-desc">{restaurant.description}</p>
          <p className="banner-address">📍 {restaurant.address}</p>
        </div>
      </div>

      {/* Menu List Section */}
      <div className="menu-section">
        <h2 className="section-title">대표 메뉴</h2>
        {menus.length === 0 ? (
          <p className="no-menus">등록된 메뉴가 없습니다.</p>
        ) : (
          <div className="menu-grid">
            {menus.map((menu) => (
              <div key={menu.id} className="menu-card glass-panel">
                <div className="menu-details">
                  <h3 className="menu-name">{menu.name}</h3>
                  <p className="menu-desc">{menu.description}</p>
                  <span className="menu-price">{menu.price.toLocaleString()}원</span>
                </div>
                <button
                  onClick={() => handleAdd(menu)}
                  className="btn btn-primary menu-add-btn"
                >
                  <ShoppingBag size={14} />
                  담기
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <style>{`
        .detail-container {
          display: flex;
          flex-direction: column;
          gap: 40px;
        }
        .restaurant-banner {
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }
        @media (min-width: 768px) {
          .restaurant-banner {
            flex-direction: row;
          }
        }
        .banner-visual {
          height: 200px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        @media (min-width: 768px) {
          .banner-visual {
            width: 240px;
            height: auto;
            min-height: 200px;
          }
        }
        .banner-emoji {
          font-size: 80px;
          filter: drop-shadow(0 10px 15px rgba(0, 0, 0, 0.2));
        }
        .banner-info {
          padding: 32px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          gap: 12px;
          flex: 1;
        }
        .banner-tag {
          font-size: 13px;
          font-weight: 700;
          color: var(--primary);
          text-transform: uppercase;
        }
        .banner-title {
          font-size: 28px;
          color: var(--text-main);
        }
        .banner-desc {
          font-size: 15px;
          color: var(--text-muted);
          line-height: 1.6;
        }
        .banner-address {
          font-size: 13px;
          color: var(--text-muted);
        }
        .menu-section {
          display: flex;
          flex-direction: column;
        }
        .section-title {
          font-size: 22px;
          margin-bottom: 24px;
          color: var(--text-main);
          position: relative;
          display: inline-block;
          align-self: flex-start;
        }
        .section-title::after {
          content: "";
          position: absolute;
          bottom: -4px;
          left: 0;
          width: 30px;
          height: 3px;
          background: var(--primary);
          border-radius: 2px;
        }
        .menu-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
          gap: 20px;
        }
        @media (max-width: 480px) {
          .menu-grid {
            grid-template-columns: 1fr;
          }
        }
        .menu-card {
          display: flex;
          padding: 24px;
          justify-content: space-between;
          align-items: center;
          gap: 16px;
          transition: all 0.2s ease;
        }
        .menu-card:hover {
          transform: translateY(-4px);
          border-color: var(--primary);
          box-shadow: 0 12px 24px rgba(0, 0, 0, 0.05);
        }
        .menu-details {
          display: flex;
          flex-direction: column;
          gap: 8px;
          flex: 1;
        }
        .menu-name {
          font-size: 18px;
          color: var(--text-main);
        }
        .menu-desc {
          font-size: 13px;
          color: var(--text-muted);
          line-height: 1.4;
          min-height: 36px;
        }
        .menu-price {
          font-size: 16px;
          font-weight: 700;
          color: var(--primary);
        }
        .menu-add-btn {
          align-self: center;
          flex-shrink: 0;
          white-space: nowrap;
        }
        .no-menus {
          color: var(--text-muted);
          text-align: center;
          padding: 40px;
        }
      `}</style>
    </div>
  );
}
