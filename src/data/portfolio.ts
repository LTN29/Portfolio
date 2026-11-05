/* Nội dung portfolio — sửa ở đây, giao diện tự cập nhật. Giữ ngắn: mỗi dự án một câu. */

export type VisualKind = "live" | "office" | "gateway" | "orchestrator" | "inventory" | "warranty" | "mobile";

export const profile = {
  name: "Lê Thanh Nhân",
  role: "Full-stack & AI Developer",
  status: "Đang nhận dự án outsource",
  github: "https://github.com/LTN29",
  // Điền thông tin liên hệ muốn công khai, để trống thì footer tự ẩn.
  email: "",          // email nhận yêu cầu từ form (và hiện ở footer)
  phone: "",
  zalo: "",
};

export const sectionLinks = [
  { href: "#services", label: "Dịch vụ" },
  { href: "#ai", label: "Dự án" },
  { href: "#showcase", label: "App mobile" },
  { href: "#process", label: "Quy trình" },
  { href: "#contact", label: "Liên hệ" },
];

export const heroFacts = [
  ["15+", "Dự án đã làm"],
  ["04", "Mảng: AI · Web · Mobile · Automation"],
  ["03", "Nền tảng: Web · Mobile · Desktop"],
  ["01", "Đầu mối từ ý tưởng đến vận hành"],
] as const;

export const statement = "Bạn cần một sản phẩm chạy thật, không phải một bản demo. Tôi làm điều đó.";

export const stats = [
  { value: "15+", title: "dự án đã làm", note: "AI · web · mobile · automation" },
  { value: "04", title: "mảng dịch vụ", note: "Một người, trọn vòng" },
  { value: "03", title: "nền tảng", note: "Web · Mobile · Desktop" },
  { value: "01", title: "đầu mối duy nhất", note: "Trao đổi trực tiếp, không qua trung gian" },
];

export type AiProject = {
  id: string;
  name: string;
  kind: string;
  tagline: string;
  stack: string[];
  visual: VisualKind;
  tone: "ink" | "stone" | "mist" | "sand";
  video?: string;
  poster?: string;
};

export const aiProjects: AiProject[] = [
  {
    id: "ai-livestream",
    name: "AI Livestream",
    kind: "Người dẫn livestream ảo",
    tagline: "Người dẫn ảo đọc bình luận và trả lời bằng giọng nói — phát thẳng lên OBS.",
    stack: ["Next.js", "Spring Boot", "TTS", "OBS"],
    visual: "live",
    tone: "ink",
  },
  {
    id: "van-phong-ai",
    name: "Văn Phòng AI",
    kind: "Ứng dụng desktop đa agent",
    tagline: "Mỗi bàn là một agent. Kéo việc thả vào bàn, các agent tự chia việc và nộp kết quả.",
    stack: ["Electron", "three.js", "Multi-model"],
    visual: "office",
    tone: "stone",
    video: "/videos/van-phong-ai.mp4",
    poster: "/videos/van-phong-ai-poster.jpg",
  },
  {
    id: "ai-gateway",
    name: "AI Gateway",
    kind: "Cổng AI cho doanh nghiệp",
    tagline: "Một cổng AI chung cho doanh nghiệp — phân quyền, nhớ ngữ cảnh theo nhóm, tự đổi model khi lỗi.",
    stack: ["Node.js", "9Router", "MCP", "Cloudflare"],
    visual: "gateway",
    tone: "mist",
  },
  {
    id: "facebook-automation",
    name: "Facebook Automation",
    kind: "Tự động hoá bình luận",
    tagline: "Chiến dịch bình luận có hàng đợi, giám sát và không bao giờ trùng việc.",
    stack: ["n8n", "Playwright", "Docker"],
    visual: "orchestrator",
    tone: "sand",
  },
];

export const showcase = {
  name: "App Bảo Hành",
  kind: "Ứng dụng di động",
  title: ["Bảo hành", "trong một chạm."],
  tagline: "Kích hoạt, tra cứu và gửi yêu cầu bảo hành ngay trên điện thoại.",
  stack: ["React Native", "iOS", "Android"],
  video: "/videos/app-bao-hanh.mp4",
  poster: "/videos/app-bao-hanh-poster.jpg",
};

export const services = [
  ["AI Chatbot & Livestream", "Trợ lý trả lời khách, người dẫn livestream ảo, giọng nói tiếng Việt."],
  ["AI Agent & Automation", "Quy trình tự chạy với n8n và agent, nối vào công cụ bạn đang dùng."],
  ["Website & Landing", "Next.js, 3D và chuyển động — nhanh, đẹp, chuẩn SEO."],
  ["Mobile App", "React Native cho iOS và Android, từ thiết kế đến lên store."],
  ["Hệ thống quản lý", "Kho, đơn sàn, bảo hành, đặt chỗ — đúng nghiệp vụ của bạn."],
  ["Triển khai & vận hành", "Docker, VPS, CI/CD — bàn giao chạy ổn định, có tài liệu."],
];

/* Form "Gửi yêu cầu".
 * Cách gửi: nếu có web3formsKey → gửi thẳng về email đã đăng ký key (khách không cần mở ứng dụng mail).
 * Lấy key miễn phí: vào https://web3forms.com, nhập email của bạn, key được gửi về hộp thư.
 * Nếu để trống → nút gửi mở ứng dụng email của khách với nội dung soạn sẵn gửi tới profile.email. */
export const contactForm = {
  web3formsKey: "1fe70fa4-b531-44b8-a480-eae4fecdbc43", // key công khai của Web3Forms — thư gửi về email đã đăng ký
  projectTypes: ["AI Chatbot / Livestream", "AI Agent & Automation", "Website", "Mobile App", "Phần mềm quản lý", "Khác"],
  budgets: ["Dưới 20 triệu", "20–50 triệu", "50–100 triệu", "Trên 100 triệu", "Chưa rõ"],
};

export const processSteps = ["Trao đổi nhu cầu", "Đề xuất & báo giá", "Demo mỗi tuần", "Bàn giao & hỗ trợ"];

export type SystemRow = { role: string; name: string; title: string };

export const systems: SystemRow[] = [
  { role: "Vận hành", name: "Phần mềm quản lý tồn kho", title: "Kho đa chi nhánh, mọi thay đổi đều có dấu vết" },
  { role: "Hậu mãi", name: "Phần mềm bảo hành cho doanh nghiệp", title: "Tiếp nhận, xử lý và tra cứu bảo hành — khách không cần đăng nhập" },
  { role: "Thương mại điện tử", name: "Kết nối đa sàn", title: "Kết nối API Shopee · TikTok Shop — phân tích, đánh giá dữ liệu để lên chiến lược bán hàng" },
  { role: "Lưu trú", name: "Nền tảng đặt phòng", title: "Booking tích hợp phần mềm quản lý khách sạn (PMS)" },
  { role: "Thương hiệu", name: "Landing page 3D", title: "Trang kể chuyện thương hiệu với WebGL" },
  { role: "Thương mại", name: "Website sản phẩm", title: "Website giới thiệu sản phẩm đa ngôn ngữ" },
];

