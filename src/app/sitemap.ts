import type { MetadataRoute } from "next";
import { getAllPosts } from "@/lib/posts";
import { abs } from "@/lib/site";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const posts = getAllPosts();
  const latest = posts[0]?.date ?? "2026-11-13";
  return [
    { url: abs("/"), lastModified: latest, changeFrequency: "weekly", priority: 1 },
    { url: abs("/bai-viet/"), lastModified: latest, changeFrequency: "weekly", priority: 0.8 },
    ...posts.map((p) => ({ url: abs(`/bai-viet/${p.slug}/`), lastModified: p.date, changeFrequency: "monthly" as const, priority: p.category === "tin-tuan" ? 0.5 : 0.7 })),
  ];
}
