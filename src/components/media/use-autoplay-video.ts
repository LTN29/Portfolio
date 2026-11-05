"use client";

import { useEffect, useState, type RefObject } from "react";

/*
 * Video tự phát khi lướt tới, ưu tiên CÓ TIẾNG.
 * Trình duyệt chỉ cho phát có tiếng sau khi người xem đã tương tác với trang (bấm, chạm, gõ phím) —
 * nên: thử phát có tiếng → nếu bị chặn thì phát không tiếng, và bật tiếng ngay ở lần tương tác đầu tiên.
 * Mỗi lúc chỉ một video phát; video khác tự dừng.
 */
let unlocked = false;
let current: HTMLVideoElement | null = null;

function unlock() {
  if (unlocked) return;
  unlocked = true;
  if (current && !current.paused) current.muted = false;
}

if (typeof window !== "undefined") {
  ["pointerdown", "keydown", "touchstart"].forEach((type) => window.addEventListener(type, unlock, { passive: true }));
}

async function play(video: HTMLVideoElement) {
  if (current && current !== video) current.pause();
  current = video;
  video.muted = false;
  try {
    await video.play();
  } catch {
    video.muted = true;               // bị chặn tiếng → phát không tiếng, chờ tương tác đầu tiên
    try { await video.play(); } catch { /* trình duyệt chặn hẳn tự phát */ }
    if (unlocked && current === video) video.muted = false;
  }
}

function toggleMute(el: HTMLVideoElement) {
  unlocked = true;
  el.muted = !el.muted;
  if (el.paused) void el.play().catch(() => undefined);
}

/* Màn hình nhỏ dùng bản nhẹ "<tên>-m.mp4"; file chỉ được tải khi video sắp lướt tới. */
function pickSource(src: string) {
  return window.matchMedia("(max-width: 800px)").matches ? src.replace(/\.mp4$/, "-m.mp4") : src;
}

function attachSource(el: HTMLVideoElement, src: string) {
  if (!el.getAttribute("src")) el.setAttribute("src", pickSource(src));
}

export function useAutoplayVideo(video: RefObject<HTMLVideoElement | null>, root: RefObject<HTMLElement | null>, src: string) {
  const [muted, setMuted] = useState(true);

  useEffect(() => {
    const el = video.current;
    const box = root.current;
    if (!el || !box) return;
    const sync = () => setMuted(el.muted);
    el.addEventListener("volumechange", sync);
    // bắt đầu tải sớm hơn một chút (khi còn cách ~1 màn hình) để lướt tới là phát ngay
    const preload = new IntersectionObserver(([entry]) => {
      if (entry?.isIntersecting) { attachSource(el, src); preload.disconnect(); }
    }, { rootMargin: "100% 0px" });
    preload.observe(box);
    const observer = new IntersectionObserver(([entry]) => {
      if (entry?.isIntersecting) { attachSource(el, src); void play(el).then(sync); }
      else {
        el.pause();
        if (current === el) current = null;
      }
    }, { threshold: 0.45 });
    observer.observe(box);
    return () => {
      preload.disconnect();
      observer.disconnect();
      el.removeEventListener("volumechange", sync);
      if (current === el) current = null;
    };
  }, [video, root, src]);

  const toggle = () => {
    if (video.current) toggleMute(video.current);
  };

  return { muted, toggle };
}
