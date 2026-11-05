"use client";

import { useRef } from "react";
import { useAutoplayVideo } from "@/components/media/use-autoplay-video";
import { withBase } from "@/lib/base-path";

/** Clip demo trong khung cửa sổ ứng dụng — tự phát (có tiếng) khi lướt tới. */
export function FeatureVideo({ src, poster, label }: { src: string; poster?: string; label: string }) {
  const box = useRef<HTMLDivElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const { muted, toggle } = useAutoplayVideo(video, box, withBase(src));

  return (
    <div ref={box} className="pf-window">
      <div className="pf-window__bar" aria-hidden="true"><i /><i /><i /><span>{label}</span></div>
      <video ref={video} poster={poster ? withBase(poster) : undefined} loop playsInline preload="none" aria-label={`Video demo ${label}`} />
      <button type="button" className="pf-show__sound pf-window__sound" onClick={toggle} aria-pressed={!muted}>
        {muted ? "Bật tiếng" : "Tắt tiếng"}
      </button>
    </div>
  );
}
