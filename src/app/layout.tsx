import type { Metadata } from "next";
import { getCurrentUser } from "@/lib/auth";
import { CartProvider } from "@/context/CartContext";
import HeaderNavigation from "@/components/HeaderNavigation";
import CartDrawer from "@/components/CartDrawer";
import "./globals.css";

export const metadata: Metadata = {
  title: "Vibe Delivery - 맛있는 즐거움",
  description: "AI로 만든 프리미엄 배달앱 서비스",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getCurrentUser();

  return (
    <html lang="ko">
      <body>
        <CartProvider>
          <HeaderNavigation user={user} />
          <main className="main-content">{children}</main>
          <CartDrawer isLoggedIn={!!user} />
          <footer className="main-footer">
            <p>© 2026 Vibe Delivery. All Rights Reserved. 컴퓨터과학개론 기말 프로젝트</p>
          </footer>
        </CartProvider>
      </body>
    </html>
  );
}
