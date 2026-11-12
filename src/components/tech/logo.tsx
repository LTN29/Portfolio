import { LOGOS } from "./logos";

/** Logo công nghệ dạng <svg> (dùng trong HTML). `mono` = vẽ bằng currentColor. */
export function Logo({ name, size = 28, mono = false, className }: { name: string; size?: number; mono?: boolean; className?: string }) {
  const l = LOGOS[name];
  if (!l) return null;
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} className={className} role="img" aria-label={l.title}>
      <path d={l.path} fill={mono ? "currentColor" : l.hex} />
    </svg>
  );
}

/** Logo dạng <path> 24×24 để đặt bên trong một SVG khác. */
export function LogoPath({ name, mono = false }: { name: string; mono?: boolean }) {
  const l = LOGOS[name];
  if (!l) return null;
  return <path d={l.path} fill={mono ? "currentColor" : l.hex} />;
}

/** Tên công nghệ trong nội dung → logo */
export const STACK_LOGO: Record<string, string> = {
  Electron: "electron", "three.js": "threejs", "Node.js": "nodejs", Docker: "docker", Cloudflare: "cloudflare",
  "Next.js": "nextjs", "Spring Boot": "springboot", React: "react", "React Native": "react", "Zalo Mini App": "zalo",
  TypeScript: "typescript", Tailwind: "tailwind", Vite: "vite", "Shopee API": "shopee", "TikTok Shop API": "tiktok",
  "GitHub Actions": "githubactions", n8n: "n8n", JavaScript: "javascript", GSAP: "gsap", Nginx: "nginx", OBS: "obs",
};
