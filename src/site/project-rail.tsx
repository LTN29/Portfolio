"use client";

import { useEffect, useState } from "react";
import { chapters, projects } from "@/data/portfolio";

/* Thanh chương bên trái phần dự án: số dự án đang xem thật to, danh sách các dự án,
 * vạch dọc lấp đầy theo tiến độ cuộn qua toàn bộ dự án. Dính theo khi cuộn (sticky). */

const chapterOf = Object.fromEntries(chapters.map((c) => [c.id, c.title]));
const pad = (n: number) => String(n).padStart(2, "0");

export function ProjectRail() {
  const [active, setActive] = useState(0);
  const [prog, setProg] = useState(0);

  useEffect(() => {
    const secs = projects.map((p) => document.getElementById(p.id)).filter(Boolean) as HTMLElement[];
    if (!secs.length) return;
    let raf = 0;
    const update = () => {
      raf = 0;
      const mid = window.innerHeight * 0.45;
      let idx = 0;
      secs.forEach((s, i) => { if (s.getBoundingClientRect().top <= mid) idx = i; });
      const first = secs[0].getBoundingClientRect();
      const last = secs[secs.length - 1].getBoundingClientRect();
      const total = last.bottom - first.top;
      const p = Math.min(1, Math.max(0, (mid - first.top) / total));
      setActive(idx);
      setProg(p);
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update); };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => { window.removeEventListener("scroll", onScroll); window.removeEventListener("resize", onScroll); cancelAnimationFrame(raf); };
  }, []);

  const cur = projects[active];
  return (
    <nav className="rail" aria-label="Các dự án">
      <p className="rail__count" aria-hidden="true">
        <b key={active}>{pad(active + 1)}</b>
        <span>/ {pad(projects.length)}</span>
      </p>
      <p className="rail__chap" key={`c${active}`}>{chapterOf[cur.chapter]}</p>
      <ol className="rail__list" style={{ ["--p" as string]: prog.toFixed(4) }}>
        {projects.map((p, i) => (
          <li key={p.id}>
            <a href={`#${p.id}`} className={i === active ? "is-on" : i < active ? "is-past" : ""} aria-current={i === active ? "true" : undefined}>
              <em>{pad(i + 1)}</em>
              <span>{p.name}</span>
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
