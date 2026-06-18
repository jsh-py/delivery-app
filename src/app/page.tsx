import prisma from "@/lib/db";
import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";

const CATEGORIES = ["전체", "한식/족발", "양식/버거", "중식/아시안", "일식/돈까스", "양식/이탈리안"];

// Map categories to modern gradient pairs and emojis
const CATEGORY_STYLES: Record<string, { gradient: string; emoji: string }> = {
  "양식/버거": { gradient: "linear-gradient(135deg, #ff9f43, #ff5e3a)", emoji: "🍔" },
  "한식/족발": { gradient: "linear-gradient(135deg, #10ac84, #01a3a4)", emoji: "🍖" },
  "중식/아시안": { gradient: "linear-gradient(135deg, #ee5253, #ff9f43)", emoji: "🍜" },
  "일식/돈까스": { gradient: "linear-gradient(135deg, #2e86de, #54a0ff)", emoji: "🍣" },
  "양식/이탈리안": { gradient: "linear-gradient(135deg, #00d2d3, #01a3a4)", emoji: "🍝" },
  "default": { gradient: "linear-gradient(135deg, #ff9f43, #ff5e3a)", emoji: "🍱" }
};

interface PageProps {
  searchParams: Promise<{ category?: string }>;
}

export default async function HomePage({ searchParams }: PageProps) {
  const { category } = await searchParams;
  const user = await getCurrentUser();

  const filteredCategory = category && category !== "전체" ? category : undefined;

  const restaurants = await prisma.restaurant.findMany({
    where: filteredCategory ? { category: filteredCategory } : {},
    orderBy: { name: "asc" },
  });

  return (
    <div className="home-container">
      {/* Hero Section */}
      <section className="hero glass-panel">
        <div className="hero-text">
          <h1 className="hero-title">당신의 취향을 배달합니다</h1>
          <p className="hero-subtitle">Vibe Delivery에서 엄선한 맛집들을 지금 바로 만나보세요.</p>
        </div>
        <div className="hero-badge">⚡ 초고속 배달 24시간 대기 중</div>
      </section>

      {/* Category Filter */}
      <div className="category-section">
        <h2 className="section-title">카테고리 선택</h2>
        <div className="category-list">
          {CATEGORIES.map((cat) => {
            const isActive = (!filteredCategory && cat === "전체") || filteredCategory === cat;
            return (
              <Link
                key={cat}
                href={cat === "전체" ? "/" : `/?category=${encodeURIComponent(cat)}`}
                className={`category-btn ${isActive ? "active" : ""}`}
              >
                {cat}
              </Link>
            );
          })}
        </div>
      </div>

      {/* Restaurant Grid */}
      <div className="restaurant-section">
        <h2 className="section-title">추천 맛집</h2>
        {restaurants.length === 0 ? (
          <p className="no-results">이 카테고리에는 등록된 식당이 없습니다.</p>
        ) : (
          <div className="restaurant-grid">
            {restaurants.map((res) => {
              const style = CATEGORY_STYLES[res.category] || CATEGORY_STYLES.default;
              return (
                <Link key={res.id} href={`/restaurants/${res.id}`} className="restaurant-card glass-panel">
                  <div className="card-image" style={{ background: style.gradient }}>
                    <span className="card-emoji">{style.emoji}</span>
                  </div>
                  <div className="card-content">
                    <span className="card-tag">{res.category}</span>
                    <h3 className="card-title">{res.name}</h3>
                    <p className="card-description">{res.description}</p>
                    <p className="card-address">📍 {res.address}</p>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>

      {/* Style for HomePage elements */}
      <style>{`
        .home-container {
          display: flex;
          flex-direction: column;
          gap: 48px;
        }
        .hero {
          padding: 60px 40px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: linear-gradient(135deg, rgba(255, 94, 58, 0.08), rgba(255, 140, 58, 0.03));
          position: relative;
          overflow: hidden;
        }
        .hero::before {
          content: "";
          position: absolute;
          width: 300px;
          height: 300px;
          background: var(--primary);
          filter: blur(150px);
          opacity: 0.15;
          top: -100px;
          right: -100px;
          border-radius: 50%;
        }
        .hero-title {
          font-size: 38px;
          font-weight: 800;
          margin-bottom: 12px;
          background: linear-gradient(135deg, var(--text-main), var(--primary));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .hero-subtitle {
          font-size: 16px;
          color: var(--text-muted);
        }
        .hero-badge {
          background: var(--primary);
          color: var(--text-white);
          padding: 8px 16px;
          border-radius: 50px;
          font-weight: 700;
          font-size: 14px;
          box-shadow: 0 4px 10px rgba(255, 94, 58, 0.25);
        }
        .section-title {
          font-size: 22px;
          margin-bottom: 20px;
          color: var(--text-main);
          position: relative;
          display: inline-block;
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
        .category-list {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
        }
        .category-btn {
          padding: 10px 20px;
          border-radius: 50px;
          background: var(--bg-card);
          border: 1px solid var(--border-glass);
          color: var(--text-muted);
          font-size: 14px;
          font-weight: 600;
          transition: all 0.2s ease;
        }
        .category-btn:hover {
          color: var(--text-main);
          border-color: var(--primary);
          background: var(--primary-light);
        }
        .category-btn.active {
          background: var(--primary);
          color: var(--text-white);
          border-color: var(--primary);
          box-shadow: 0 4px 10px rgba(255, 94, 58, 0.2);
        }
        .restaurant-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
          gap: 24px;
        }
        .restaurant-card {
          display: flex;
          flex-direction: column;
          overflow: hidden;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          cursor: pointer;
        }
        .restaurant-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.12);
          border-color: var(--primary);
        }
        .card-image {
          height: 180px;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
        }
        .card-emoji {
          font-size: 72px;
          filter: drop-shadow(0 8px 12px rgba(0,0,0,0.15));
          transition: transform 0.3s ease;
        }
        .restaurant-card:hover .card-emoji {
          transform: scale(1.1) rotate(5deg);
        }
        .card-content {
          padding: 24px;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .card-tag {
          font-size: 12px;
          font-weight: 700;
          color: var(--primary);
          text-transform: uppercase;
        }
        .card-title {
          font-size: 20px;
          color: var(--text-main);
        }
        .card-description {
          font-size: 14px;
          color: var(--text-muted);
          line-height: 1.5;
          min-height: 42px;
        }
        .card-address {
          font-size: 13px;
          color: var(--text-muted);
        }
        .no-results {
          color: var(--text-muted);
          text-align: center;
          padding: 40px;
          font-size: 16px;
        }
      `}</style>
    </div>
  );
}
