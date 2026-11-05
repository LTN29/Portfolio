"use client";

import { useEffect, useMemo, useRef } from "react";
import { tierDpr, type GpuTier } from "@/components/motion/gpu-tier";
import { AdaptiveQuality } from "@/components/motion/adaptive-quality";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";

type IntroProgress = { current: number };

/* ── Text baked into a canvas texture so the glass can refract it ── */
type TextLine = { text: string; weight: number; size: number; y: number; letter?: number; family?: string; style?: string };
/* next/font hashes the family name — read it from the CSS variable it sets on <html> */
function brandFamily() {
  if (typeof document === "undefined") return '"Be Vietnam Pro"';
  return getComputedStyle(document.documentElement).getPropertyValue("--font-bvp").trim() || '"Be Vietnam Pro"';
}
const sans = () => `${brandFamily()}, "Segoe UI", sans-serif`;
const TEXT_A: TextLine[] = [
  { text: "Thanh Nhân.", weight: 600, size: 300, y: 420, letter: -18 },
];
const TEXT_B: TextLine[] = [
  { text: "Đưa AI vào", weight: 300, size: 230, y: 380, letter: -12 },
  { text: "vận hành thật.", weight: 300, size: 230, y: 640, letter: -12 },
];

function makeTextTexture(lines: TextLine[]) {
  const canvas = document.createElement("canvas");
  canvas.width = 2048;
  canvas.height = 1024;
  const ctx = canvas.getContext("2d")!;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#ffffff";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  for (const line of lines) {
    ctx.font = `${line.style ?? ""} ${line.weight} ${line.size}px ${line.family ?? sans()}`;
    if ("letterSpacing" in ctx && line.letter !== undefined) {
      (ctx as CanvasRenderingContext2D & { letterSpacing: string }).letterSpacing = `${line.letter}px`;
    }
    ctx.fillText(line.text, canvas.width / 2, line.y);
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.NoColorSpace;
  texture.anisotropy = 4;
  return texture;
}

const vertexShader = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

/* Animated mesh gradient (simplex noise) in portfolio colours (ink, ocean, aqua, violet) + film grain + baked text */
const fragmentShader = /* glsl */ `
  precision highp float;
  varying vec2 vUv;
  uniform float uTime;
  uniform vec2 uMouse;
  uniform float uAspect;
  uniform float uProgress;
  uniform sampler2D uTextA;
  uniform sampler2D uTextB;
  uniform float uTextAspect;
  uniform float uPlaneAspect;
  uniform float uReveal;
  uniform float uVel;
  uniform vec2 uLens;

  vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec3 permute(vec3 x) { return mod289(((x * 34.0) + 1.0) * x); }
  float snoise(vec2 v) {
    const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
    vec2 i = floor(v + dot(v, C.yy));
    vec2 x0 = v - i + dot(i, C.xx);
    vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
    vec4 x12 = x0.xyxy + C.xxzz;
    x12.xy -= i1;
    i = mod289(i);
    vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
    vec3 m = max(0.5 - vec3(dot(x0, x0), dot(x12.xy, x12.xy), dot(x12.zw, x12.zw)), 0.0);
    m = m * m; m = m * m;
    vec3 x = 2.0 * fract(p * C.www) - 1.0;
    vec3 h = abs(x) - 0.5;
    vec3 ox = floor(x + 0.5);
    vec3 a0 = x - ox;
    m *= 1.79284291400159 - 0.85373472095314 * (a0 * a0 + h * h);
    vec3 g;
    g.x = a0.x * x0.x + h.x * x0.y;
    g.yz = a0.yz * x12.xz + h.yz * x12.yw;
    return 130.0 * dot(m, g);
  }
  float hash(vec2 p) { return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453); }

  void main() {
    vec2 uv = vUv;
    vec2 p = vec2(uv.x * uAspect, uv.y);
    float t = uTime * 0.07;

    // Domain-warped noise for soft, flowing colour fields
    vec2 warp = vec2(snoise(p * 0.9 + t), snoise(p * 0.9 - t + 4.7));
    vec2 q = p + warp * 0.35 + (uMouse - 0.5) * 0.18;
    float n1 = snoise(q * 0.85 + vec2(t * 1.3, -t));
    float n2 = snoise(q * 1.4 - vec2(t, t * 0.6) + 9.1);

    vec3 navy   = vec3(0.016, 0.055, 0.125);
    vec3 deep   = vec3(0.000, 0.384, 0.640);
    vec3 blue   = vec3(0.055, 0.647, 0.914);
    vec3 aqua   = vec3(0.000, 0.898, 0.898);
    vec3 indigo = vec3(0.420, 0.300, 0.950);

    vec3 col = mix(deep, blue, smoothstep(-0.6, 0.7, n1));
    col = mix(col, aqua, smoothstep(0.25, 0.95, n2) * 0.85);
    col = mix(col, indigo, smoothstep(0.35, 1.0, -n1 * 0.8 + n2 * 0.4) * 0.55);
    // darken toward the bottom so copy stays legible, and as the intro scrolls away
    col = mix(col, navy, smoothstep(0.55, -0.15, uv.y) * 0.55 + uProgress * 0.35);

    // ── Text: lens under the cursor, chromatic split, noise-dissolve transitions, sheen, glow ──
    vec2 tuv = (uv - 0.5);
    float r = uPlaneAspect / uTextAspect;
    if (r >= 1.0) { tuv.x *= r; } else { tuv.y /= r; tuv *= 1.08; }
    float textScale = mix(1.0, 1.12, uProgress);
    tuv = tuv / textScale + 0.5;

    // liquid lens following the pointer (magnifies + ripples the letters)
    vec2 ld = (uv - uLens) * vec2(uAspect, 1.0);
    float lens = exp(-dot(ld, ld) * 26.0);
    float ripple = sin(length(ld) * 46.0 - uTime * 4.0) * 0.0035 * lens;
    tuv -= (uv - uLens) * lens * 0.09 + ripple;

    float ca = 0.0006 + uVel * 0.03 + lens * 0.0035;
    vec2 off = vec2(ca, 0.0);
    float inside = step(0.0, tuv.x) * step(tuv.x, 1.0) * step(0.0, tuv.y) * step(tuv.y, 1.0);
    vec3 aRGB = vec3(texture2D(uTextA, tuv + off).a, texture2D(uTextA, tuv).a, texture2D(uTextA, tuv - off).a) * inside;
    vec3 bRGB = vec3(texture2D(uTextB, tuv + off).a, texture2D(uTextB, tuv).a, texture2D(uTextB, tuv - off).a) * inside;
    float aGlow = texture2D(uTextA, tuv, 4.0).a * inside;
    float bGlow = texture2D(uTextB, tuv, 4.0).a * inside;

    // dissolve masks: entrance sweeps left→right, scroll swaps A for B through noise
    float dn = snoise(uv * vec2(uAspect, 1.0) * 3.2 + 2.0) * 0.5 + 0.5;
    float sweep = uv.x * 0.72 + dn * 0.28;
    float inA = smoothstep(sweep - 0.04, sweep, uReveal * 1.12 - 0.04);
    float outA = 1.0 - smoothstep(dn * 0.22 + 0.14, dn * 0.22 + 0.2, uProgress);
    float inB = smoothstep(dn * 0.22 + 0.36, dn * 0.22 + 0.42, uProgress);
    float maskA = inA * outA;
    // glowing seam where the dissolve front passes
    float seamA = inA * (1.0 - inA) * 4.0 + outA * (1.0 - outA) * 4.0 * step(0.01, uProgress);
    float seamB = inB * (1.0 - inB) * 4.0;

    vec3 text = aRGB * maskA + bRGB * inB;
    float glow = aGlow * maskA + bGlow * inB;

    // diagonal sheen sweeping across the letters every few seconds
    float band = fract((uv.x * 0.9 + uv.y * 0.45) * 0.6 - uTime * 0.09);
    float sheen = smoothstep(0.0, 0.05, band) * (1.0 - smoothstep(0.05, 0.12, band));

    vec3 white = vec3(0.97, 0.995, 1.0);
    col += aqua * glow * 0.28;                                  // soft halo behind letters
    col = mix(col, white, clamp(text, 0.0, 1.0) * 0.95);         // letters with RGB fringes
    col += (vec3(0.75, 1.0, 1.0) * sheen * 0.55 + lens * 0.08) * max(text.g, 0.0);
    col += aqua * (seamA * max(aGlow, 0.0) + seamB * bGlow) * 1.4; // dissolve seam light

    // Film grain
    float grain = hash(uv * vec2(1920.0, 1080.0) + fract(uTime) * 100.0) - 0.5;
    col += grain * 0.055;

    gl_FragColor = vec4(col, 1.0);
  }
`;

function GradientBackdrop({ progressRef, mouse, velocity }: { progressRef: IntroProgress; mouse: React.RefObject<THREE.Vector2>; velocity: React.RefObject<number> }) {
  const { viewport, camera, size } = useThree();
  const material = useRef<THREE.ShaderMaterial>(null);
  const distance = 6;
  const planeSize = useMemo(() => {
    const cam = camera as THREE.PerspectiveCamera;
    const height = 2 * Math.tan(THREE.MathUtils.degToRad(cam.fov / 2)) * (cam.position.z + distance);
    return [height * (size.width / size.height) * 1.06, height * 1.06] as const;
  }, [camera, size.width, size.height]);

  const uniforms = useMemo(() => {
    const textA = makeTextTexture(TEXT_A);
    const textB = makeTextTexture(TEXT_B);
    return {
      uTime: { value: 0 },
      uMouse: { value: new THREE.Vector2(0.5, 0.5) },
      uAspect: { value: 1 },
      uProgress: { value: 0 },
      uTextA: { value: textA },
      uTextB: { value: textB },
      uTextAspect: { value: 2 },
      uPlaneAspect: { value: 1 },
      uReveal: { value: 0 },
      uVel: { value: 0 },
      uLens: { value: new THREE.Vector2(0.5, 0.5) },
    };
  }, []);

  // Re-render the text once the web font is ready (canvas falls back to system font before that)
  useEffect(() => {
    let alive = true;
    if (typeof document === "undefined" || !document.fonts) return;
    Promise.all([
      document.fonts.load(`600 120px ${brandFamily()}`, "Thanh Nhân."),
      document.fonts.load(`300 120px ${brandFamily()}`, "Đưa AI vào vận hành thật."),
    ]).then(() => {
      if (!alive) return;
      const prevA = uniforms.uTextA.value;
      const prevB = uniforms.uTextB.value;
      uniforms.uTextA.value = makeTextTexture(TEXT_A);
      uniforms.uTextB.value = makeTextTexture(TEXT_B);
      prevA.dispose();
      prevB.dispose();
    }).catch(() => undefined);
    return () => {
      alive = false;
    };
  }, [uniforms]);

  useEffect(() => () => {
    uniforms.uTextA.value.dispose();
    uniforms.uTextB.value.dispose();
  }, [uniforms]);

  useFrame((state, delta) => {
    const m = material.current;
    if (!m) return;
    m.uniforms.uTime.value += Math.min(delta, 0.05);
    const target = mouse.current ?? new THREE.Vector2(0.5, 0.5);
    m.uniforms.uMouse.value.lerp(target, 0.04);
    m.uniforms.uProgress.value = THREE.MathUtils.damp(m.uniforms.uProgress.value, progressRef.current, 6, delta);
    m.uniforms.uReveal.value = reveal(state.clock.elapsedTime);
    m.uniforms.uLens.value.lerp(target, 0.12);
    m.uniforms.uVel.value = THREE.MathUtils.damp(m.uniforms.uVel.value, Math.min(velocity.current ?? 0, 1), 4, delta);
    m.uniforms.uAspect.value = viewport.aspect;
    m.uniforms.uPlaneAspect.value = planeSize[0] / planeSize[1];
  });

  return (
    <mesh position={[0, 0, -distance]}>
      <planeGeometry args={[planeSize[0], planeSize[1]]} />
      <shaderMaterial ref={material} vertexShader={vertexShader} fragmentShader={fragmentShader} uniforms={uniforms} />
    </mesh>
  );
}

/* Uniform writes live outside components so per-frame updates stay out of render scope */
function setU(material: THREE.ShaderMaterial, key: string, value: number) {
  material.uniforms[key].value = value;
}
function addU(material: THREE.ShaderMaterial, key: string, value: number) {
  material.uniforms[key].value += value;
}
/* Deterministic pseudo-random so the dust field is identical on every render */
function mulberry32(a: number) {
  return () => {
    a |= 0; a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/* Entrance timeline shared by the shader and the prompt (seconds since the canvas started) */
function reveal(t: number) {
  const x = THREE.MathUtils.clamp((t - 0.5) / 2.4, 0, 1);
  return 1 - Math.pow(1 - x, 3);
}

/* ── Drifting light dust for depth ── */
function Dust({ progressRef, mouse, count }: { progressRef: IntroProgress; mouse: React.RefObject<THREE.Vector2>; count: number }) {
  const points = useRef<THREE.Points>(null);
  const { geometry, material } = useMemo(() => {
    const rand = mulberry32(20261022);
    const g = new THREE.BufferGeometry();
    const pos = new Float32Array(count * 3);
    const seed = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (rand() - 0.5) * 16;
      pos[i * 3 + 1] = (rand() - 0.5) * 9;
      pos[i * 3 + 2] = -4 + rand() * 6;
      seed[i] = rand();
    }
    g.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    g.setAttribute("aSeed", new THREE.BufferAttribute(seed, 1));
    const m = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      uniforms: { uTime: { value: 0 }, uFade: { value: 0 } },
      vertexShader: /* glsl */ `
        attribute float aSeed;
        uniform float uTime;
        varying float vA;
        void main() {
          vec3 p = position;
          p.y = mod(p.y + uTime * (0.08 + aSeed * 0.18) + 4.5, 9.0) - 4.5;
          p.x += sin(uTime * 0.3 + aSeed * 20.0) * 0.15;
          vec4 mv = modelViewMatrix * vec4(p, 1.0);
          gl_Position = projectionMatrix * mv;
          gl_PointSize = (1.4 + aSeed * 3.2) * (9.0 / -mv.z);
          vA = 0.25 + aSeed * 0.6;
        }
      `,
      fragmentShader: /* glsl */ `
        uniform float uFade;
        varying float vA;
        void main() {
          float d = length(gl_PointCoord - 0.5);
          float a = smoothstep(0.5, 0.0, d) * vA * uFade;
          gl_FragColor = vec4(vec3(0.75, 1.0, 1.0), a);
        }
      `,
    });
    return { geometry: g, material: m };
  }, [count]);
  useEffect(() => () => { geometry.dispose(); material.dispose(); }, [geometry, material]);
  useFrame((state, delta) => {
    addU(material, "uTime", Math.min(delta, 0.05));
    setU(material, "uFade", reveal(state.clock.elapsedTime) * (1 - progressRef.current * 0.6));
    const p = points.current;
    if (!p) return;
    const m = mouse.current ?? new THREE.Vector2(0.5, 0.5);
    p.position.x = THREE.MathUtils.damp(p.position.x, (m.x - 0.5) * -0.6, 2, delta);
    p.position.y = THREE.MathUtils.damp(p.position.y, (m.y - 0.5) * -0.4 + progressRef.current * 1.5, 2, delta);
  });
  return <points ref={points} geometry={geometry} material={material} />;
}

/* ── A terminal prompt ">_" extruded and made of glass ── */
const EXTRUDE = {
  depth: 0.5,
  bevelEnabled: true,
  bevelThickness: 0.14,
  bevelSize: 0.08,
  bevelSegments: 6,
  curveSegments: 12,
};

function buildChevronGeometry() {
  const shape = new THREE.Shape();
  const pts: [number, number][] = [
    [-1.05, 0.82], [-0.68, 1.18], [0.5, 0.0], [-0.68, -1.18], [-1.05, -0.82], [-0.22, 0.0],
  ];
  shape.moveTo(pts[0][0], pts[0][1]);
  pts.slice(1).forEach(([x, y]) => shape.lineTo(x, y));
  shape.closePath();
  const geometry = new THREE.ExtrudeGeometry(shape, EXTRUDE);
  geometry.translate(0, 0, -0.25);
  geometry.computeVertexNormals();
  return geometry;
}

function buildCursorGeometry() {
  const shape = new THREE.Shape();
  const x0 = 0.82, x1 = 2.15, y0 = -1.18, y1 = -0.8, r = 0.06;
  shape.moveTo(x0 + r, y0);
  shape.lineTo(x1 - r, y0);
  shape.quadraticCurveTo(x1, y0, x1, y0 + r);
  shape.lineTo(x1, y1 - r);
  shape.quadraticCurveTo(x1, y1, x1 - r, y1);
  shape.lineTo(x0 + r, y1);
  shape.quadraticCurveTo(x0, y1, x0, y1 - r);
  shape.lineTo(x0, y0 + r);
  shape.quadraticCurveTo(x0, y0, x0 + r, y0);
  const geometry = new THREE.ExtrudeGeometry(shape, EXTRUDE);
  geometry.translate(0, 0, -0.25);
  geometry.computeVertexNormals();
  return geometry;
}

function GlassPrompt({ progressRef, mouse, tier }: { progressRef: IntroProgress; mouse: React.RefObject<THREE.Vector2>; tier: GpuTier }) {
  const group = useRef<THREE.Group>(null);
  const chevron = useMemo(() => buildChevronGeometry(), []);
  const cursorGeo = useMemo(() => buildCursorGeometry(), []);
  const cursor = useRef<THREE.Mesh>(null);
  const { viewport } = useThree();
  useEffect(() => () => { chevron.dispose(); cursorGeo.dispose(); }, [chevron, cursorGeo]);

  const glow = useRef<THREE.Mesh>(null);
  const glowMat = useMemo(() => new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    uniforms: { uA: { value: 0 } },
    vertexShader: /* glsl */ `varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }`,
    fragmentShader: /* glsl */ `
      varying vec2 vUv; uniform float uA;
      void main(){
        vec2 d = (vUv - 0.5) * vec2(1.0, 2.2);
        float a = smoothstep(0.5, 0.0, length(d));
        gl_FragColor = vec4(vec3(0.35, 0.95, 1.0), a * a * uA);
      }`,
  }), []);
  useEffect(() => () => glowMat.dispose(), [glowMat]);

  useFrame((state, delta) => {
    const g = group.current;
    if (!g) return;
    const t = state.clock.elapsedTime;
    const p = progressRef.current;
    const r = reveal(t - 0.35);
    const back = 1 + 2.2 * Math.pow(r - 1, 3) + 1.2 * Math.pow(r - 1, 2); // ease-out-back
    const m = mouse.current ?? new THREE.Vector2(0.5, 0.5);
    const fit = Math.min(1, viewport.width / 7.5);
    // idle float + mouse tilt; on scroll the prompt launches along its own direction
    const targetRotY = Math.sin(t * 0.45) * 0.2 + (m.x - 0.5) * 0.5 + p * 0.9;
    const targetRotX = -0.18 + Math.cos(t * 0.38) * 0.1 - (m.y - 0.5) * 0.32;
    g.rotation.y = THREE.MathUtils.damp(g.rotation.y, targetRotY, 4, delta);
    g.rotation.x = THREE.MathUtils.damp(g.rotation.x, targetRotX, 4, delta);
    g.rotation.z = Math.sin(t * 0.3) * 0.05 + (1 - r) * -1.1 + p * 0.25;
    const launch = Math.pow(p, 1.6) * 6.5;
    g.position.x = (-0.45 + (1 - r) * -2.2) * fit + launch * 0.7;
    g.position.y = (-1.12 + (1 - r) * -1.2) * fit + Math.sin(t * 0.8) * 0.05 + launch * 0.7;
    g.position.z = (1 - r) * 2.0;
    const s = fit * 0.42 * Math.max(0.001, back) * (1 + p * 0.35);
    g.scale.setScalar(s);
    // the cursor blinks like a real terminal once the entrance has settled
    if (cursor.current) cursor.current.visible = r < 0.98 || (t % 1.1) < 0.68;
    if (glow.current) {
      glow.current.position.set(g.position.x, g.position.y - 0.1 * fit, -0.6);
      glow.current.scale.set(fit * 5.2, fit * 2.6, 1);
      setU(glowMat, "uA", r * (0.42 + Math.sin(t * 1.4) * 0.08) * (1 - p));
    }
  });

  return (
    <>
    <mesh ref={glow} material={glowMat} renderOrder={-1}>
      <planeGeometry args={[1, 1]} />
    </mesh>
    <group ref={group}>
      {[chevron, cursorGeo].map((geo, i) => (
      <mesh key={i} ref={i === 1 ? cursor : undefined} geometry={geo}>
        <meshPhysicalMaterial
          color="#e9fdff"
          transmission={1}
          thickness={1.4}
          roughness={0.04}
          ior={1.5}
          dispersion={tier === "low" ? 0 : 4}
          iridescence={tier === "low" ? 0 : 0.35}
          iridescenceIOR={1.3}
          clearcoat={1}
          clearcoatRoughness={0.05}
          attenuationColor="#8ff6ff"
          attenuationDistance={2.4}
          envMapIntensity={1.2}
          specularIntensity={1}
        />
      </mesh>
      ))}
    </group>
    </>
  );
}

function Orbs({ progressRef, tier }: { progressRef: IntroProgress; tier: GpuTier }) {
  const refs = useRef<THREE.Mesh[]>([]);
  const orbs = useMemo(() => [
    { pos: [-3.6, 1.7, -1.2], r: 0.32, speed: 0.6 },
    { pos: [3.4, -1.6, -0.6], r: 0.22, speed: 0.8 },
    { pos: [2.6, 2.1, -2.2], r: 0.16, speed: 1.1 },
  ] as const, []);
  useFrame((state) => {
    const t = state.clock.elapsedTime;
    refs.current.forEach((mesh, i) => {
      if (!mesh) return;
      const o = orbs[i];
      const r = reveal(t - 0.8 - i * 0.15);
      mesh.position.set(o.pos[0] + Math.sin(t * o.speed + i) * 0.2, o.pos[1] + Math.cos(t * o.speed) * 0.25 + progressRef.current * (i - 1) * 1.2 - (1 - r) * 3, o.pos[2]);
      mesh.scale.setScalar(Math.max(0.001, r));
    });
  });
  return (
    <>
      {orbs.map((o, i) => (
        <mesh key={i} ref={(el) => { if (el) refs.current[i] = el; }}>
          <sphereGeometry args={[o.r, tier === "low" ? 24 : 40, tier === "low" ? 24 : 40]} />
          <meshPhysicalMaterial color="#ffffff" transmission={1} thickness={0.6} roughness={0.02} ior={1.4} iridescence={0.6} envMapIntensity={1.1} />
        </mesh>
      ))}
    </>
  );
}

function EnvironmentLight() {
  const gl = useThree((state) => state.gl);
  const env = useMemo(() => {
    const pmrem = new THREE.PMREMGenerator(gl);
    const room = new RoomEnvironment();
    const texture = pmrem.fromScene(room, 0.04).texture;
    room.dispose?.();
    pmrem.dispose();
    return texture;
  }, [gl]);
  useEffect(() => () => env.dispose(), [env]);
  return <primitive object={env} attach="environment" />;
}

export function BrandIntroScene({ progressRef, active, still, tier }: { progressRef: IntroProgress; active: boolean; still: boolean; tier: GpuTier }) {
  const mouse = useRef(new THREE.Vector2(0.5, 0.5));
  const velocity = useRef(0);

  useEffect(() => {
    let lastX = 0.5, lastY = 0.5, lastT = performance.now();
    let decay = 0;
    const onMove = (event: PointerEvent) => {
      const x = event.clientX / window.innerWidth;
      const y = 1 - event.clientY / window.innerHeight;
      const now = performance.now();
      const dt = Math.max(16, now - lastT);
      velocity.current = Math.min(1, Math.hypot(x - lastX, y - lastY) / dt * 40);
      lastX = x; lastY = y; lastT = now;
      mouse.current.set(x, y);
    };
    // let the chromatic split relax when the pointer stops
    const tick = () => { velocity.current *= 0.92; decay = requestAnimationFrame(tick); };
    decay = requestAnimationFrame(tick);
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      cancelAnimationFrame(decay);
      window.removeEventListener("pointermove", onMove);
    };
  }, []);

  return (
    <Canvas
      className="intro-canvas"
      camera={{ position: [0, 0, 9], fov: 35, near: 0.1, far: 60 }}
      dpr={tierDpr(tier)}
      frameloop={active && !still ? "always" : "demand"}
      gl={{ antialias: tier === "high", alpha: false, powerPreference: "high-performance" }}
      fallback={<div className="intro-webgl-fallback" />}
    >
      <AdaptiveQuality tier={tier} />
      <EnvironmentLight />
      <ambientLight intensity={0.4} />
      <directionalLight position={[4, 6, 6]} intensity={1.6} />
      <directionalLight position={[-6, -2, 3]} intensity={0.6} color="#7cf3ff" />
      <GradientBackdrop progressRef={progressRef} mouse={mouse} velocity={velocity} />
      <Dust progressRef={progressRef} mouse={mouse} count={tier === "low" ? 200 : 420} />
      <GlassPrompt progressRef={progressRef} mouse={mouse} tier={tier} />
      <Orbs progressRef={progressRef} tier={tier} />
    </Canvas>
  );
}
