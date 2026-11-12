"use client";

/* Bộ khung dùng chung cho các demo nhỏ: khung cửa sổ, hook "đang nằm trên màn hình" và hẹn giờ chỉ chạy khi đang xem. */
import { useEffect, useRef, useState, type ReactNode, type RefObject } from "react";

export function useInView<T extends Element>(ref: RefObject<T | null>, margin = "120px") {
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { rootMargin: margin });
    io.observe(el);
    return () => io.disconnect();
  }, [ref, margin]);
  return inView;
}

/** Gọi `cb` mỗi `ms` khi `active`; luôn dùng bản `cb` mới nhất. */
export function useTicker(cb: () => void, ms: number, active: boolean) {
  const saved = useRef(cb);
  useEffect(() => {
    saved.current = cb;
  });
  useEffect(() => {
    if (!active) return;
    const id = window.setInterval(() => saved.current(), ms);
    return () => window.clearInterval(id);
  }, [ms, active]);
}

export function useReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  return reduced;
}

export function DemoFrame({
  title,
  chrome = "window",
  children,
  className = "",
  frameRef,
  aside,
}: {
  title: string;
  chrome?: "window" | "browser" | "phone";
  children: ReactNode;
  className?: string;
  frameRef?: RefObject<HTMLDivElement | null>;
  aside?: ReactNode;
}) {
  return (
    <div ref={frameRef} className={`dm dm--${chrome} ${className}`}>
      <div className="dm__bar">
        <span className="dm__dots" aria-hidden="true"><i /><i /><i /></span>
        {chrome === "browser" ? <span className="dm__url">{title}</span> : <span className="dm__title">{title}</span>}
        <span className="dm__tag">{aside ?? "Demo · dữ liệu mẫu"}</span>
      </div>
      <div className="dm__body">{children}</div>
    </div>
  );
}

export const fmtVnd = (n: number) => `${n.toLocaleString("vi-VN")}đ`;

export function clock(offsetMin = 0) {
  const d = new Date(Date.now() + offsetMin * 60000);
  return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
}
