import fs from "node:fs";
import path from "node:path";

/* Bài viết lưu dạng Markdown trong content/bai-viet/<slug>.md, đầu file là phần khai báo:
 * ---
 * title: Tiêu đề
 * summary: Một câu tóm tắt
 * date: 2026-11-13
 * category: ve-toi | thi-truong | tin-tuan
 * tags: [AI, Hạ tầng]
 * draft: false            (tuỳ chọn — true thì không đăng)
 * ---
 * Chỉ đọc lúc build (xuất tĩnh), không chạy trên trình duyệt. */

export type Category = "ve-toi" | "thi-truong" | "tin-tuan";
export const CATEGORY_LABEL: Record<Category, string> = {
  "ve-toi": "Về tôi",
  "thi-truong": "Thị trường AI",
  "tin-tuan": "Tin công nghệ & AI",
};

export type PostMeta = {
  slug: string;
  title: string;
  summary: string;
  date: string;
  category: Category;
  tags: string[];
  minutes: number;
};
export type Post = PostMeta & { body: string };

const DIR = path.join(process.cwd(), "content", "bai-viet");

function parse(file: string): Post | null {
  const raw = fs.readFileSync(path.join(DIR, file), "utf8").replace(/^﻿/, "");
  const m = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/.exec(raw);
  if (!m) return null;
  const meta: Record<string, string> = {};
  for (const line of m[1].split(/\r?\n/)) {
    const kv = /^([a-zA-Z]+):\s*(.*)$/.exec(line);
    if (kv) meta[kv[1]] = kv[2].trim().replace(/^["']|["']$/g, "");
  }
  if (meta.draft === "true") return null;
  const tags = (meta.tags ?? "").replace(/^\[|\]$/g, "").split(",").map((t) => t.trim().replace(/^["']|["']$/g, "")).filter(Boolean);
  const category = (["ve-toi", "thi-truong", "tin-tuan"].includes(meta.category) ? meta.category : "ve-toi") as Category;
  const body = m[2].trim();
  const words = body.split(/\s+/).length;
  return {
    slug: file.replace(/\.md$/, ""),
    title: meta.title ?? file,
    summary: meta.summary ?? "",
    date: meta.date ?? "1970-01-01",
    category,
    tags,
    minutes: Math.max(1, Math.round(words / 220)),
    body,
  };
}

let cache: Post[] | null = null;
export function getAllPosts(): Post[] {
  if (cache) return cache;
  const files = fs.existsSync(DIR) ? fs.readdirSync(DIR).filter((f) => f.endsWith(".md")) : [];
  // mới nhất lên đầu; cùng ngày thì tin tuần → thị trường → về tôi
  const rank: Record<Category, number> = { "tin-tuan": 0, "thi-truong": 1, "ve-toi": 2 };
  cache = files
    .map(parse)
    .filter((p): p is Post => !!p)
    .sort((a, b) => (a.date !== b.date ? (a.date < b.date ? 1 : -1) : rank[a.category] - rank[b.category] || a.title.localeCompare(b.title)));
  return cache;
}

export function getPost(slug: string) {
  return getAllPosts().find((p) => p.slug === slug) ?? null;
}

export function formatDate(iso: string) {
  const [y, mo, d] = iso.split("-");
  return d && mo && y ? `${d}/${mo}/${y}` : iso;
}
