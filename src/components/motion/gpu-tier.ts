/* Pure helpers — kept free of three.js imports so they stay out of the first bundle. */
export type GpuTier = "low" | "high";

/** Cheap, synchronous guess at how much GPU budget the device has. */
export function detectGpuTier(): GpuTier {
  if (typeof window === "undefined") return "high";
  const nav = navigator as Navigator & { deviceMemory?: number; connection?: { saveData?: boolean } };
  const coarse = window.matchMedia("(pointer: coarse)").matches;
  const small = window.innerWidth < 900;
  const lowMemory = (nav.deviceMemory ?? 8) <= 4;
  const fewCores = (nav.hardwareConcurrency ?? 8) <= 4;
  const saveData = Boolean(nav.connection?.saveData);
  return coarse || small || lowMemory || fewCores || saveData ? "low" : "high";
}

/** Device-pixel-ratio ceiling for a tier (phones often report 3, which is ~2× the pixels of 2). */
export function tierDpr(tier: GpuTier): [number, number] {
  return tier === "low" ? [1, 1.25] : [1, 1.5];
}

