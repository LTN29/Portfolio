# Portfolio — Lê Thanh Nhân

Trang giới thiệu cá nhân: Next.js 16 (App Router, xuất tĩnh), React 19, TypeScript, CSS thuần.
Chuyển động bằng GSAP ScrollTrigger + Lenis; intro 3D bằng three.js qua React Three Fiber.
Ngôn ngữ thiết kế kế thừa landing SIMIGO (giấy & mực, một họ chữ Be Vietnam Pro, đường kẻ mảnh),
thêm JetBrains Mono cho nhãn kỹ thuật và minh hoạ động cho từng dự án.

## Chạy

```bash
npm install
npm run dev         # http://localhost:3000
npm run lint && npm run typecheck
npm run build       # xuất tĩnh ra out/
```

## Sửa nội dung

Toàn bộ chữ nằm trong `src/data/portfolio.ts`: thông tin cá nhân (điền `email`, `phone` để hiện ở footer),
số liệu, dự án AI, danh sách hệ thống, luồng kiến trúc, bộ công cụ và nguyên tắc.

## Cấu trúc

```
src/app/            layout (font), page (ghép section), globals.css + sg.css (hệ thiết kế), pf.css (lớp riêng)
src/components/
  motion/           intro 3D kính ">_", chữ chạy sóng, số liệu ghim, dải gradient, chữ xoắn 3D, Lenis/reveal
  navigation/       thanh menu (trong suốt trên intro → viên kính khi cuộn)
  sections/         hero, câu chuyện, dự án AI, hệ thống, kiến trúc, nguyên tắc, footer
  visuals/          minh hoạ HTML/CSS cho từng dự án (không cần ảnh chụp)
src/data/           nội dung
```
