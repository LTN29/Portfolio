"use client";

import { useEffect } from "react";

/** Gắn class `is-in` cho phần tử có data-reveal khi cuộn tới. */
export function Motion() {
  useEffect(() => {
    document.documentElement.classList.add("js");
    // màn hình đầu: hiện ngay, không chờ cuộn
    document.querySelectorAll<HTMLElement>(".hero [data-reveal]").forEach((el) => el.classList.add("is-in"));
    const els = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]:not(.is-in)"));
    if (typeof IntersectionObserver === "undefined") {
      els.forEach((el) => el.classList.add("is-in"));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.classList.add("is-in");
            io.unobserve(e.target);
          }
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
  return null;
}
