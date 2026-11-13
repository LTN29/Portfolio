import type { MetadataRoute } from "next";
import { abs } from "@/lib/site";

export const dynamic = "force-static";

/* Cho phép mọi công cụ tìm kiếm và trợ lý AI đọc trang (GEO: muốn được AI trích dẫn). */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/" }],
    sitemap: abs("/sitemap.xml"),
    host: abs("/"),
  };
}
