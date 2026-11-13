import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { Be_Vietnam_Pro, Bricolage_Grotesque, JetBrains_Mono } from "next/font/google";
import "./site.css";
import { SITE_DESC, SITE_NAME, SITE_TITLE, SITE_URL } from "@/lib/site";

const sans = Be_Vietnam_Pro({
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "600"], // ít file font hơn → chữ hiện nhanh hơn (700 tự lấy 600)
  display: "swap",
  variable: "--font-sans",
});

const display = Bricolage_Grotesque({
  subsets: ["latin", "vietnamese"],
  // font biến thiên: 1 file cho mọi độ đậm
  display: "swap",
  variable: "--font-display",
});

const mono = JetBrains_Mono({
  subsets: ["latin", "vietnamese"],
  display: "swap",
  preload: false, // chỉ dùng trong khung nhật ký mô phỏng
  variable: "--font-mono",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: SITE_TITLE, template: "%s — Lê Thanh Nhân" },
  description: SITE_DESC,
  applicationName: SITE_NAME,
  authors: [{ name: SITE_NAME, url: SITE_URL }],
  creator: SITE_NAME,
  alternates: {
    canonical: "/",
    types: { "application/rss+xml": [{ url: "/bai-viet/rss.xml", title: "Bài viết — Lê Thanh Nhân" }] },
  },
  openGraph: {
    type: "website",
    locale: "vi_VN",
    siteName: SITE_NAME,
    url: "/",
    title: "Lê Thanh Nhân — Từ ý tưởng đến sản phẩm được dùng mỗi ngày",
    description: "Product Engineer · Full-stack & AI: ứng dụng AI đa agent, cổng AI, hệ thống vận hành, web, Zalo Mini App và app mobile.",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "Lê Thanh Nhân — Product Engineer · Full-stack & AI" }],
  },
  twitter: { card: "summary_large_image", title: SITE_TITLE, description: "Từ ý tưởng đến sản phẩm được dùng mỗi ngày.", images: ["/og.png"] },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 } },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || undefined,
    other: process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION ? { "msvalidate.01": process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION } : undefined,
  },
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="vi" className={`${sans.variable} ${display.variable} ${mono.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
