// Kiểm tra nhanh các bài trong content/bai-viet: đủ phần khai báo, đúng định dạng ngày / chuyên mục, tên file hợp lệ.
// Chạy: npm run check:posts
import fs from "node:fs";
import path from "node:path";

const dir = path.join(process.cwd(), "content", "bai-viet");
const cats = new Set(["ve-toi", "thi-truong", "tin-tuan"]);
let bad = 0;
for (const f of fs.readdirSync(dir).filter((x) => x.endsWith(".md"))) {
  const raw = fs.readFileSync(path.join(dir, f), "utf8");
  const m = /^---\r?\n([\s\S]*?)\r?\n---/.exec(raw);
  const errs = [];
  if (!/^[a-z0-9-]+\.md$/.test(f)) errs.push("tên file chỉ dùng a-z, 0-9 và dấu -");
  if (!m) errs.push("thiếu phần khai báo --- ... ---");
  else {
    const meta = Object.fromEntries(m[1].split(/\r?\n/).map((l) => /^([a-zA-Z]+):\s*(.*)$/.exec(l)).filter(Boolean).map((x) => [x[1], x[2].trim()]));
    for (const k of ["title", "summary", "date", "category"]) if (!meta[k]) errs.push(`thiếu ${k}`);
    if (meta.date && !/^\d{4}-\d{2}-\d{2}$/.test(meta.date)) errs.push("date phải dạng YYYY-MM-DD");
    if (meta.category && !cats.has(meta.category)) errs.push(`category phải là: ${[...cats].join(", ")}`);
  }
  if (errs.length) { bad++; console.error(`✗ ${f}: ${errs.join("; ")}`); } else console.log(`✓ ${f}`);
}
process.exit(bad ? 1 : 0);
