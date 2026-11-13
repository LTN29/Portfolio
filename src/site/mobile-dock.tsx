"use client";

import { useEffect, useState } from "react";

/* Thanh hành động dưới đáy màn hình điện thoại (vùng ngón cái): Tự xem · Dự án · Bài viết.
 * Hiện sau màn đầu khi khách cuộn lên (cuộn xuống để đọc thì lùi xuống cho gọn); ẩn ở phần Bài viết và khi đang tự xem.
 * Chỉ hiển thị ở màn hẹp (CSS). */
export function MobileDock() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const notes = document.getElementById("notes");
    let atEnd = false, raf = 0, last = window.scrollY, down = false;
    const update = () => {
      raf = 0;
      const y = window.scrollY;
      if (Math.abs(y - last) > 6) { down = y > last; last = y; }
      setShow(y > window.innerHeight * 0.85 && !atEnd && !down);
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update); };
    const io = new IntersectionObserver(([e]) => { atEnd = e.isIntersecting; onScroll(); }, { rootMargin: "0px 0px -20% 0px" });
    if (notes) io.observe(notes);
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => { io.disconnect(); cancelAnimationFrame(raf); window.removeEventListener("scroll", onScroll); };
  }, []);

  return (
    <nav className={`dock${show ? " is-on" : ""}`} aria-label="Lối tắt" aria-hidden={!show}>
      <button type="button" className="dock__play" tabIndex={show ? 0 : -1} onClick={() => window.dispatchEvent(new Event("tour:start"))} aria-label="Tự xem — trang tự cuộn">
        <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M5 3.5v9l7.5-4.5z" fill="currentColor" /></svg>
        Tự xem
      </button>
      <a href="#projects" className="dock__main" tabIndex={show ? 0 : -1}>Dự án</a>
      <a href="#notes" tabIndex={show ? 0 : -1}>Bài viết</a>
    </nav>
  );
}
