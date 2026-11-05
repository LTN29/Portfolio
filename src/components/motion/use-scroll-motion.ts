"use client";

import { useEffect, useLayoutEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger);

const useIsoLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

/**
 * After a context is reverted, GSAP keeps its cached transform (x/y in px) on each element.
 * When the same element is animated again — e.g. React Strict Mode mounting effects twice in
 * development — new xPercent/yPercent tweens would stack on that stale offset and leave text
 * half-hidden behind its mask. Clearing the cache makes every setup start from a clean element.
 */
export function clearGsapTransforms(root: Element) {
  const touched = [root, ...Array.from(root.querySelectorAll("*"))].filter((el) => (el as Element & { _gsap?: unknown })._gsap);
  if (touched.length) gsap.set(touched, { clearProps: "transform" });
}

export function prefersReducedMotion() {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/**
 * Runs a GSAP setup function scoped to `scope` and reverts everything on unmount.
 * Skipped entirely when the user prefers reduced motion, so the static layout stays readable.
 */
export function useScrollMotion(
  scope: React.RefObject<HTMLElement | null>,
  setup: (ctx: { gsap: typeof gsap; ScrollTrigger: typeof ScrollTrigger; root: HTMLElement }) => void | (() => void),
  deps: React.DependencyList = [],
) {
  useIsoLayoutEffect(() => {
    const root = scope.current;
    if (!root || prefersReducedMotion()) return;
    let cleanup: void | (() => void);
    root.classList.add("is-motion");
    const context = gsap.context(() => {
      cleanup = setup({ gsap, ScrollTrigger, root });
    }, root);
    return () => {
      cleanup?.();
      context.revert();
      clearGsapTransforms(root);
      root.classList.remove("is-motion");
    };
  }, deps);
}

export { gsap, ScrollTrigger };
