import type { NextConfig } from "next";

/*
 * GitHub Pages phục vụ trang dưới https://<user>.github.io/<repo>/, nên mọi đường dẫn cần tiền tố /<repo>.
 * Workflow deploy truyền NEXT_PUBLIC_BASE_PATH (lấy từ cấu hình Pages); chạy local thì để trống.
 */
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

const nextConfig: NextConfig = {
  output: "export",
  basePath,
  trailingSlash: true,
  images: { unoptimized: true },
};

export default nextConfig;
