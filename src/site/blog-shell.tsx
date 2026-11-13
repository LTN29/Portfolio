import Link from "next/link";
import { profile } from "@/data/portfolio";
import { Footer } from "./notes";

/* Khung cho trang bài viết: thanh trên gọn (về trang chủ · tất cả bài) + chân trang. */
export function BlogShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <header className="bnav">
        <div className="wrap bnav__in">
          <Link href="/" className="nav__logo">
            <b>LTN<span className="dot">.</span></b>
            <span>{profile.name}</span>
          </Link>
          <nav className="bnav__links" aria-label="Điều hướng">
            <Link href="/#projects">Dự án</Link>
            <Link href="/bai-viet/" className="nav__cta">Bài viết</Link>
          </nav>
        </div>
      </header>
      <main id="top">{children}</main>
      <Footer home="/" />
    </>
  );
}
