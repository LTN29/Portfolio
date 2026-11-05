import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { Be_Vietnam_Pro, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import "./sg.css";
import "./pf.css";

const beVietnam = Be_Vietnam_Pro({
  subsets: ["latin", "vietnamese"],
  weight: ["200", "300", "400", "500", "600", "700"],
  display: "swap",
  variable: "--font-bvp",
});

const mono = JetBrains_Mono({
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500"],
  display: "swap",
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: "Lê Thanh Nhân — Full-stack & AI Developer · Nhận dự án outsource",
  description:
    "Lê Thanh Nhân nhận dự án outsource: AI chatbot & livestream, agent & automation, website, mobile app và hệ thống quản lý — từ ý tưởng đến khi chạy thật.",
  openGraph: {
    title: "Lê Thanh Nhân — Ý tưởng thành sản phẩm chạy thật",
    description: "Full-stack & AI Developer nhận dự án outsource: AI, automation, web, mobile.",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#07101c",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="vi" className={`${beVietnam.variable} ${mono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
