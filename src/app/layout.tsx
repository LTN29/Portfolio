import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "vietnamese"],
});

export const metadata: Metadata = {
  title: "Lê Thanh Nhân | Product-minded Full-stack Developer",
  description: "Portfolio của Lê Thanh Nhân - Product-minded Full-stack Developer, AI-assisted Product Builder.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="vi"
      className={`${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans bg-background text-foreground selection:bg-gold-primary selection:text-black">{children}</body>
    </html>
  );
}
