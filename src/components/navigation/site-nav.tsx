"use client";

import { useEffect, useRef, useState } from "react";
import { sectionLinks } from "@/data/portfolio";
import { SoundToggle } from "@/components/motion/sound";

/**
 * Navigation that changes shape with the page:
 * · over the 3D intro — transparent, white type, full width
 * · after scrolling — condenses into a floating glass capsule with a reading-progress hairline
 * · scrolling down — slides away; scrolling up — returns
 * · small screens — a full-screen menu with large type
 */
export function SiteNav() {
  const bar = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [compact, setCompact] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [dark, setDark] = useState(true);
  const [active, setActive] = useState<string | null>(null);

  // Scroll state — booleans only change occasionally, progress is written straight to CSS
  useEffect(() => {
    let lastY = window.scrollY;
    let frame = 0;
    const update = () => {
      frame = 0;
      const y = window.scrollY;
      const intro = document.querySelector<HTMLElement>(".intro-section");
      const introEnd = (intro?.offsetHeight ?? 0) - 90;
      const goingDown = y > lastY + 4;
      const goingUp = y < lastY - 4;
      setCompact(y > 60);
      setDark(Boolean(intro) && y < introEnd);
      if (goingDown && y > 480) setHidden(true);
      else if (goingUp || y < 480) setHidden(false);
      if (goingDown || goingUp) lastY = y;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      bar.current?.style.setProperty("--p", max > 0 ? (y / max).toFixed(4) : "0");
    };
    const onScroll = () => { if (!frame) frame = requestAnimationFrame(update); };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  // Highlight the section currently in view
  useEffect(() => {
    const targets = sectionLinks
      .map((l) => document.querySelector<HTMLElement>(l.href))
      .filter((el): el is HTMLElement => Boolean(el));
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => { if (entry.isIntersecting) setActive(`#${entry.target.id}`); });
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    targets.forEach((t) => observer.observe(t));
    return () => observer.disconnect();
  }, []);

  // Full-screen menu: lock scroll and close on Escape
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    document.documentElement.classList.add("sg-menu-open");
    window.addEventListener("keydown", onKey);
    return () => {
      document.documentElement.classList.remove("sg-menu-open");
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const current = dark ? null : active;
  const cls = [
    "sg-nav",
    compact && "is-compact",
    hidden && !open && "is-hidden",
    dark && "is-dark",
    open && "is-open",
  ].filter(Boolean).join(" ");

  return (
    <header className={cls}>
      <div className="sg-nav__bar" ref={bar}>
        <a className="sg-nav__logo pf-logo" href="#top" aria-label="Lê Thanh Nhân — đầu trang">
          <span className="pf-logo__mark">LTN<b>.</b></span>
          <span className="pf-logo__name">Lê Thanh Nhân</span>
        </a>

        <nav className="sg-nav__links" aria-label="Điều hướng chính">
          {sectionLinks.map((link) => (
            <a key={link.href} href={link.href} className={current === link.href ? "is-current" : undefined} aria-current={current === link.href ? "true" : undefined}>
              {link.label}
            </a>
          ))}
        </nav>

        <div className="sg-nav__right">
          <SoundToggle />
          <a className="sg-nav__cta" href="#contact">Gửi yêu cầu</a>
          <button
            className="sg-nav__menu"
            type="button"
            aria-expanded={open}
            aria-controls="sg-menu"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? "Đóng" : "Menu"}
          </button>
        </div>
        <span className="sg-nav__progress" aria-hidden="true" />
      </div>

      <div id="sg-menu" className="sg-menu" aria-hidden={!open}>
        <div className="sg-menu__inner">
          <p className="sg-label">Mục lục</p>
          <ol>
            {sectionLinks.map((link, i) => (
              <li key={link.href}>
                <a href={link.href} tabIndex={open ? 0 : -1} onClick={() => setOpen(false)}>
                  <span>{String(i + 1).padStart(2, "0")}</span>{link.label}
                </a>
              </li>
            ))}
          </ol>
          <a className="sg-btn" href="#contact" tabIndex={open ? 0 : -1} onClick={() => setOpen(false)}>Gửi yêu cầu</a>
        </div>
      </div>
    </header>
  );
}
