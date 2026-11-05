/** Thêm tiền tố basePath cho file trong /public (video, ảnh) khi deploy dưới thư mục con như GitHub Pages. */
export const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";
export const withBase = (path: string) => `${basePath}${path}`;
