"use client";

import { useEffect, useState } from "react";
import { profile, sectionLinks } from "@/data/portfolio";

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("");

  useEffect(() => {
    let last = window.scrollY;
    let raf = 0;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        const y = window.scrollY;
        setScrolled(y > 24);
        if (y > last + 8 && y > 400) setHidden(true);
        else if (y < last - 8 || y < 400) setHidden(false);
        last = y;
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const els = sectionLinks.map((l) => document.querySelector<HTMLElement>(l.href)).filter(Boolean) as HTMLElement[];
    const io = new IntersectionObserver(
      (es) => es.forEach((e) => e.isIntersecting && setActive(`#${e.target.id}`)),
      { rootMargin: "-45% 0px -50% 0px" },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    document.documentElement.style.overflow = open ? "hidden" : "";
  }, [open]);

  return (
    <>
      <header className={`nav${scrolled ? " is-scrolled" : ""}${hidden && !open ? " is-hidden" : ""}`}>
        <div className="wrap nav__in">
          <a href="#top" className="nav__logo" aria-label={`${profile.name} — đầu trang`}>
            <b>LTN<span className="dot">.</span></b>
            <span>{profile.name}</span>
          </a>
          <nav className="nav__links" aria-label="Mục chính">
            {sectionLinks.map((l) => (
              <a key={l.href} href={l.href} className={active === l.href ? "is-on" : undefined}>{l.label}</a>
            ))}
          </nav>
          <a href="#contact" className="nav__cta">Liên hệ</a>
          <button type="button" className="nav__menu" aria-expanded={open} aria-controls="nav-sheet" onClick={() => setOpen((o) => !o)}>
            {open ? "Đóng" : "Menu"}
          </button>
        </div>
      </header>
      <div id="nav-sheet" className={`nav__sheet${open ? " is-open" : ""}`} aria-hidden={!open}>
        {sectionLinks.map((l, i) => (
          <a key={l.href} href={l.href} tabIndex={open ? 0 : -1} onClick={() => setOpen(false)}>
            <em>{String(i + 1).padStart(2, "0")}</em>{l.label}
          </a>
        ))}
      </div>
    </>
  );
}
