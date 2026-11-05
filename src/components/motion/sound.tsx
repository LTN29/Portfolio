"use client";

import { useEffect, useState } from "react";

/**
 * Tiny synthesized UI sound kit (Web Audio, no audio files).
 * Off by default; the visitor's choice is remembered per browser.
 */
const STORAGE_KEY = "ltn-portfolio-sound";

class SoundEngine {
  ctx: AudioContext | null = null;
  master: GainNode | null = null;
  enabled = false;
  private lastHover = 0;
  private lastWhoosh = 0;
  private noise: AudioBuffer | null = null;

  private ensure() {
    if (this.ctx) return this.ctx;
    const Ctor = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!Ctor) return null;
    this.ctx = new Ctor();
    this.master = this.ctx.createGain();
    this.master.gain.value = 0.5;
    this.master.connect(this.ctx.destination);
    const length = this.ctx.sampleRate * 0.6;
    this.noise = this.ctx.createBuffer(1, length, this.ctx.sampleRate);
    const data = this.noise.getChannelData(0);
    for (let i = 0; i < length; i++) data[i] = Math.random() * 2 - 1;
    return this.ctx;
  }

  setEnabled(on: boolean) {
    this.enabled = on;
    if (on) {
      const ctx = this.ensure();
      void ctx?.resume();
      this.chime();
    }
  }

  /** soft glassy tick for hovers */
  hover(pitch = 1) {
    if (!this.enabled || !this.ctx || !this.master) return;
    const now = this.ctx.currentTime;
    if (now - this.lastHover < 0.06) return;
    this.lastHover = now;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(1320 * pitch, now);
    osc.frequency.exponentialRampToValueAtTime(880 * pitch, now + 0.08);
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(0.07, now + 0.008);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.16);
    osc.connect(gain).connect(this.master);
    osc.start(now);
    osc.stop(now + 0.18);
  }

  /** airy whoosh scaled by scroll velocity */
  whoosh(intensity: number) {
    if (!this.enabled || !this.ctx || !this.master || !this.noise) return;
    const now = this.ctx.currentTime;
    if (now - this.lastWhoosh < 0.22) return;
    this.lastWhoosh = now;
    const level = Math.min(1, intensity);
    const src = this.ctx.createBufferSource();
    src.buffer = this.noise;
    const filter = this.ctx.createBiquadFilter();
    filter.type = "bandpass";
    filter.Q.value = 0.9;
    filter.frequency.setValueAtTime(400, now);
    filter.frequency.exponentialRampToValueAtTime(1800 + level * 1600, now + 0.25);
    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(0.05 * level + 0.01, now + 0.08);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.45);
    src.connect(filter).connect(gain).connect(this.master);
    src.start(now);
    src.stop(now + 0.5);
  }

  /** two-note chime for toggling on / section arrivals */
  chime() {
    if (!this.ctx || !this.master) return;
    const now = this.ctx.currentTime;
    [659.25, 987.77].forEach((freq, i) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();
      osc.type = "triangle";
      osc.frequency.value = freq;
      const t = now + i * 0.09;
      gain.gain.setValueAtTime(0.0001, t);
      gain.gain.exponentialRampToValueAtTime(0.06, t + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.5);
      osc.connect(gain).connect(this.master!);
      osc.start(t);
      osc.stop(t + 0.55);
    });
  }
}

const sound = typeof window !== "undefined" ? new SoundEngine() : null;

export function SoundToggle() {
  const [on, setOn] = useState(false);

  // Restore the visitor's previous choice. Audio still needs a user gesture to start,
  // so a remembered "on" only takes effect after the first click/keypress.
  useEffect(() => {
    let saved = false;
    try { saved = window.localStorage.getItem(STORAGE_KEY) === "on"; } catch { /* storage blocked */ }
    if (!saved) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setOn(true);
    const unlock = () => sound?.setEnabled(true);
    window.addEventListener("pointerdown", unlock, { once: true });
    window.addEventListener("keydown", unlock, { once: true });
    return () => {
      window.removeEventListener("pointerdown", unlock);
      window.removeEventListener("keydown", unlock);
    };
  }, []);

  // Hover ticks on interactive elements (event delegation, one listener)
  useEffect(() => {
    let lastTarget: Element | null = null;
    const onOver = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      const target = (event.target as Element | null)?.closest("a, button, .product-card, .stack-card");
      if (!target || target === lastTarget) return;
      lastTarget = target;
      sound?.hover(target.matches("button") ? 1.12 : 1);
    };
    const onOut = (event: PointerEvent) => {
      const related = (event.relatedTarget as Element | null)?.closest("a, button, .product-card, .stack-card");
      if (related !== lastTarget) lastTarget = null;
    };
    document.addEventListener("pointerover", onOver, { passive: true });
    document.addEventListener("pointerout", onOut, { passive: true });
    return () => {
      document.removeEventListener("pointerover", onOver);
      document.removeEventListener("pointerout", onOut);
    };
  }, []);

  // Scroll whoosh driven by scroll speed (works with Lenis since it moves native scroll)
  useEffect(() => {
    let lastY = window.scrollY;
    let lastT = performance.now();
    const onScroll = () => {
      const now = performance.now();
      const dy = Math.abs(window.scrollY - lastY);
      const dt = Math.max(16, now - lastT);
      lastY = window.scrollY;
      lastT = now;
      const velocity = dy / dt; // px per ms
      if (velocity > 1.2) sound?.whoosh((velocity - 1.2) / 4);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const toggle = () => {
    const next = !on;
    setOn(next);
    sound?.setEnabled(next);
    try { window.localStorage.setItem(STORAGE_KEY, next ? "on" : "off"); } catch { /* storage blocked */ }
  };

  return (
    <button
      type="button"
      className={`sound-toggle${on ? " is-on" : ""}`}
      onClick={toggle}
      aria-pressed={on}
      aria-label={on ? "Tắt âm thanh" : "Bật âm thanh"}
      title={on ? "Tắt âm thanh" : "Bật âm thanh"}
    >
      <span className="sound-label">Âm thanh</span>
      <span className="sound-state">{on ? "Bật" : "Tắt"}</span>
    </button>
  );
}
