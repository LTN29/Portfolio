"use client";

import { useEffect, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import type { WebGLRenderer } from "three";
import type { GpuTier } from "@/components/motion/gpu-tier";

function setTransmissionScale(gl: WebGLRenderer, value: number) {
  gl.transmissionResolutionScale = value;
}

/**
 * Watches the real frame rate for a couple of seconds and steps resolution down
 * when the device cannot keep up — so slow laptops and phones stay smooth.
 */
export function AdaptiveQuality({ tier }: { tier: GpuTier }) {
  const gl = useThree((s) => s.gl);
  const setDpr = useThree((s) => s.setDpr);
  const sample = useRef({ frames: 0, time: 0, steps: 0 });

  useEffect(() => {
    setTransmissionScale(gl, tier === "low" ? 0.5 : 0.75);
  }, [gl, tier]);

  useFrame((_, delta) => {
    const s = sample.current;
    if (s.steps >= 2) return;
    // ignore hitches from tab switches / first shader compile
    if (delta > 0.25) return;
    s.frames += 1;
    s.time += delta;
    if (s.time < 1.5) return;
    const fps = s.frames / s.time;
    s.frames = 0;
    s.time = 0;
    if (fps < 45) {
      s.steps += 1;
      const current = gl.getPixelRatio();
      setDpr(Math.max(0.85, current * 0.75));
      setTransmissionScale(gl, 0.4);
    } else {
      s.steps = 2; // fast enough, stop measuring
    }
  });
  return null;
}
