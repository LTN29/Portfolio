/* Nội dung hồ sơ năng lực — sửa ở đây, giao diện tự cập nhật.
 * Không ghi tên công ty / thương hiệu nơi làm việc: mô tả theo loại hệ thống và vai trò của mình. */

export type VisualKind = "live" | "office" | "gateway" | "orchestrator" | "inventory" | "warranty" | "mobile";
export type DemoKind = "office" | "gateway" | "warranty" | "store" | "purchase" | "inventory" | "live" | "queue";

export const profile = {
  name: "Lê Thanh Nhân",
  role: "Product Engineer · Full-stack & AI",
  status: "Hồ sơ năng lực 2026",
  location: "TP.HCM (GMT+7)",
  // không còn hiện trên trang (đã bỏ phần liên hệ); giữ lại cho code giao diện cũ trong src/components còn biên dịch được
  email: "",
  phone: "",
  zalo: "",
};

export const sectionLinks = [
  { href: "#stack", label: "Công nghệ" },
  { href: "#projects", label: "Dự án" },
  { href: "#about", label: "Về tôi" },
  { href: "#services", label: "Năng lực" },
  { href: "#process", label: "Cách làm" },
  { href: "#notes", label: "Bài viết" },
];

export const heroFacts = [
  ["10", "Sản phẩm tự lên ý tưởng & xây dựng"],
  ["04", "Kênh khách hàng: Web · Zalo · iOS · Android"],
  ["03", "Nền tảng: Web · Mobile · Desktop"],
  ["01", "Người làm từ ý tưởng đến vận hành"],
] as const;

export const statement = "Tôi không chỉ viết code. Tôi nghĩ ra sản phẩm, thiết kế nó và đưa vào dùng thật mỗi ngày.";

export const stats = [
  { value: "10", title: "sản phẩm đã xây dựng", note: "AI · Web · Mobile · Hệ thống vận hành nội bộ" },
  { value: "04", title: "kênh dùng chung 1 dữ liệu", note: "Website · Zalo Mini App · iOS · Android" },
  { value: "03", title: "hệ điều hành mỗi bản phát hành", note: "Windows · macOS · Linux, tự build qua CI" },
  { value: "01", title: "người trọn vòng đời", note: "Ý tưởng · thiết kế · code · triển khai · vận hành" },
];

export type Project = {
  id: string;
  chapter: string;
  name: string;
  kind: string;
  tagline: string;
  /** câu mở màn sân khấu: bài toán dự án này giải, dạng câu hỏi */
  pitch: string;
  role: string[];
  highlights: string[];
  stack: string[];
  demo: DemoKind;
  visual: VisualKind;
  tone: "ink" | "stone" | "mist" | "sand";
};

export const chapters = [
  { id: "ai", title: "AI & tự động hoá", note: "Đưa AI vào công việc hằng ngày" },
  { id: "customer", title: "Sản phẩm cho khách hàng", note: "Bảo hành · bán hàng · đa kênh" },
  { id: "ops", title: "Hệ thống vận hành", note: "Mua hàng · kho · kết nối sàn" },
] as const;

export const projects: Project[] = [
  {
    id: "van-phong-ai",
    chapter: "ai",
    name: "Văn Phòng AI",
    kind: "Ứng dụng desktop đa agent",
    tagline: "Một văn phòng 3D nơi mỗi nhân viên AI ngồi một bàn: giao việc như giao cho người thật, cả nhóm tự chia việc, kiểm tra chéo và nộp file kết quả.",
    pitch: "Làm sao để AI nhận việc, chia việc và nộp kết quả như một đội người thật?",
    role: ["Ý tưởng", "Thiết kế UI/UX & 3D", "Full-stack", "Phát hành"],
    highlights: [
      "Ba không gian trong một app: Văn phòng (đội AI 3D), Chat nhiều model, Sảnh 3D online cho cả công ty",
      "Mỗi agent dùng model khác nhau (GPT, Claude, Gemini, model nội bộ) cùng chung bộ công cụ & kỹ năng",
      "Trình duyệt cạnh khung chat: AI tự mở web, đọc tài liệu Excel / Word trên đám mây",
      "Tự build & cập nhật cho Windows, macOS, Linux; Sảnh có bản cho điện thoại",
    ],
    stack: ["Electron", "three.js", "Node.js", "MCP", "GitHub Actions"],
    demo: "office",
    visual: "office",
    tone: "stone",
  },
  {
    id: "ai-gateway",
    chapter: "ai",
    name: "AI Gateway",
    kind: "Cổng AI dùng chung cho tổ chức",
    tagline: "Một cổng duy nhất cho mọi ứng dụng gọi AI: xác thực, hạn mức theo người, chọn model phù hợp và tự chuyển model khác khi nhà cung cấp gặp sự cố.",
    pitch: "Cả công ty cùng dùng AI — làm sao kiểm soát được quyền, hạn mức và chi phí?",
    role: ["Kiến trúc", "Backend", "Vận hành máy chủ"],
    highlights: [
      "Chuẩn API chung cho app desktop, trợ lý chat và công cụ nội bộ",
      "Tuỳ biến bộ định tuyến model mã nguồn mở: tạo & sửa ảnh theo đúng model đang dùng",
      "Phát công cụ, kỹ năng và bản cập nhật app xuống máy nhân viên tự động",
      "Máy chủ thời gian thực cho Sảnh 3D nhiều người cùng lúc",
    ],
    stack: ["Node.js", "Docker", "SSE", "Cloudflare"],
    demo: "gateway",
    visual: "gateway",
    tone: "mist",
  },
  {
    id: "facebook-automation",
    chapter: "ai",
    name: "Tự động hoá chiến dịch",
    kind: "Hàng đợi & máy chạy song song",
    tagline: "Chiến dịch bình luận chạy trên nhiều máy cùng lúc nhưng không bao giờ làm trùng việc; máy nào treo thì hệ thống tự phát hiện và chạy lại.",
    pitch: "Chiến dịch chạy trên nhiều máy cùng lúc — làm sao để không bao giờ trùng việc?",
    role: ["Thiết kế hệ thống", "Automation"],
    highlights: [
      "Bộ phân việc tách khỏi máy chạy: mỗi bài chỉ được xử lý đúng một lần",
      "Trình duyệt tự động giữ phiên đăng nhập, thao tác với nhịp tự nhiên",
      "Giám sát tiến trình, tự thử lại và báo ngay khi có sự cố",
    ],
    stack: ["n8n", "Playwright", "Docker"],
    demo: "queue",
    visual: "orchestrator",
    tone: "sand",
  },
  {
    id: "bao-hanh",
    chapter: "customer",
    name: "Hệ sinh thái bảo hành",
    kind: "Website · Zalo Mini App · App iOS & Android",
    tagline: "Khách kích hoạt, tra cứu và gửi yêu cầu bảo hành ở kênh nào cũng được; kỹ thuật viên cập nhật một lần, khách thấy ngay trên mọi kênh.",
    pitch: "Làm sao để khách tự kích hoạt và tra cứu bảo hành ngay trên điện thoại?",
    role: ["Ý tưởng", "Thiết kế UI/UX", "Web & Mini App", "App mobile"],
    highlights: [
      "Trang quản trị: phiếu bảo hành qua 13 trạng thái, kỹ thuật viên, kho linh kiện, báo cáo xuất Excel",
      "Zalo Mini App: đăng nhập một chạm bằng số Zalo, mua hàng, kích hoạt bảo hành cho đơn từ sàn",
      "App iOS & Android: đăng nhập OTP, thiết bị của tôi, yêu cầu sửa chữa, song ngữ Việt – Anh",
      "Quản trị nội dung app, mini app và kho câu hỏi cho chatbot ngay trên web",
    ],
    stack: ["React", "Spring Boot", "Database", "React Native", "Zalo Mini App", "Docker"],
    demo: "warranty",
    visual: "warranty",
    tone: "sand",
  },
  {
    id: "website-sapo",
    chapter: "customer",
    name: "Website bán hàng",
    kind: "Theme tuỳ biến trên nền tảng thương mại điện tử",
    tagline: "Giao diện cửa hàng tự thiết kế trên nền tảng thương mại điện tử (Sapo, Haravan, Shopify…): trang chủ, danh mục, trang sản phẩm và khuyến mãi, dùng chung dữ liệu sản phẩm với Mini App.",
    pitch: "Một website bán hàng mang dấu ấn riêng mà vẫn tải nhanh, chuẩn SEO?",
    role: ["Thiết kế giao diện", "Lập trình theme"],
    highlights: [
      "Theme tuỳ biến theo nhận diện riêng, đổi màu và khối nội dung ngay trong trang quản trị",
      "Tối ưu tốc độ và SEO trang sản phẩm, hiển thị tốt trên điện thoại",
      "Dữ liệu sản phẩm được Mini App đọc lại để bán trên Zalo",
    ],
    stack: ["Nền tảng TMĐT", "Liquid", "JavaScript", "SEO"],
    demo: "store",
    visual: "mobile",
    tone: "mist",
  },
  {
    id: "mua-hang",
    chapter: "ops",
    name: "Quản lý mua hàng & nhập khẩu",
    kind: "Ứng dụng web nội bộ",
    tagline: "Theo dõi mỗi đơn mua từ lúc dự tính đến khi hàng về kho qua 10 mốc, kèm lịch thanh toán, cảnh báo đến hạn và chứng từ của từng đơn.",
    pitch: "Đơn mua, lịch thanh toán, hàng nhập khẩu — làm sao gom về một nơi?",
    role: ["Ý tưởng", "Thiết kế UI/UX", "Full-stack"],
    highlights: [
      "AI đọc báo giá / hợp đồng và điền sẵn đơn mua",
      "Lịch thanh toán, dòng tiền dự kiến, lịch công việc cho từng bộ phận",
      "Đăng nhập tài khoản công ty (Microsoft), phân quyền theo vai trò",
      "Thống kê bán hàng & tồn kho để quyết định nhập thêm",
    ],
    stack: ["React", "TypeScript", "Tailwind", "Spring Boot", "Database", "Entra ID"],
    demo: "purchase",
    visual: "orchestrator",
    tone: "ink",
  },
  {
    id: "ton-kho",
    chapter: "ops",
    name: "Tồn kho & kết nối đa sàn",
    kind: "Ứng dụng web nội bộ",
    tagline: "Một nơi xem tồn kho nhiều kho, đơn hàng, đổi trả và quảng cáo từ Shopee, TikTok Shop; bán ở đâu thì số tồn mọi kênh cập nhật theo.",
    pitch: "Hàng ở nhiều kho, đơn đổ về từ Shopee, TikTok — làm sao xem ở cùng một chỗ?",
    role: ["Thiết kế UI/UX", "Full-stack", "Tích hợp API sàn"],
    highlights: [
      "Đồng bộ đơn hàng, đổi trả, đánh giá và quảng cáo qua API của sàn",
      "Tồn kho nhiều kho, combo sản phẩm, kho ảo cho từng kênh",
      "Báo cáo hằng ngày và theo dõi hàng nhập khẩu về kho",
    ],
    stack: ["React", "Vite", "Spring Boot", "Database", "Shopee API", "TikTok Shop API"],
    demo: "inventory",
    visual: "inventory",
    tone: "stone",
  },
];

export const otherProjects = [
  { name: "Đặt phòng & quản lý khách sạn", note: "Đặt phòng trực tuyến nối với phần mềm quản lý khách sạn, lịch phòng và thanh toán.", stack: "Next.js · Webhook · Payment" },
  { name: "Landing page 3D", note: "Trang giới thiệu thương hiệu và ra mắt sản phẩm với WebGL, chuyển động theo nhịp cuộn.", stack: "Three.js · React Three Fiber · GSAP" },
  { name: "Website sản phẩm đa ngôn ngữ", note: "Danh mục sản phẩm nhiều ngôn ngữ, tải nhanh, cấu trúc SEO quốc tế.", stack: "Next.js · i18n · CDN" },
];

export const services = [
  ["AI & Agent", "Đưa model ngôn ngữ vào công việc thật: agent dùng công cụ, nhiều model phối hợp, bộ nhớ theo nhóm.", "LLM · MCP · Multi-agent"],
  ["Tự động hoá", "Quy trình tự chạy, có hàng đợi, giám sát và tự khôi phục khi lỗi.", "n8n · Playwright · Queue"],
  ["Web app & quản trị", "Hệ thống nội bộ đúng nghiệp vụ: kho, mua hàng, bảo hành, báo cáo.", "React · Spring Boot · Node.js"],
  ["Mobile & Zalo Mini App", "App iOS / Android và Mini App dùng chung một backend với web.", "React Native · ZaUI · OTP"],
  ["Thiết kế UI/UX & 3D", "Tự thiết kế giao diện, chuyển động và không gian 3D cho sản phẩm của mình.", "Prototype · three.js · GSAP"],
  ["Hạ tầng & phát hành", "Docker, máy chủ, CI build nhiều hệ điều hành, cập nhật tự động.", "Docker · CI/CD · Cloudflare"],
] as const;

/* Không còn dùng trên trang (đã bỏ form liên hệ); giữ để code cũ trong src/components biên dịch được. */
export const contactForm = { web3formsKey: "" };

export const processProtocol = [
  {
    step: "01",
    phase: "QUAN SÁT",
    title: "Bắt đầu từ việc thật",
    desc: "Ngồi cùng người dùng, xem họ đang làm thủ công ở đâu, mất thời gian ở đâu. Ý tưởng sản phẩm đến từ đó.",
    deliverable: "Luồng nghiệp vụ & vấn đề cần giải",
  },
  {
    step: "02",
    phase: "THIẾT KẾ",
    title: "Vẽ trước, code sau",
    desc: "Tự thiết kế giao diện và luồng thao tác, thử với người dùng bằng bản mẫu trước khi viết dòng code đầu tiên.",
    deliverable: "Giao diện & bản mẫu bấm thử",
  },
  {
    step: "03",
    phase: "XÂY DỰNG",
    title: "Ra bản dùng được sớm",
    desc: "Làm theo vòng ngắn, mỗi tuần có bản chạy thật cho người dùng thử và góp ý.",
    deliverable: "Bản chạy thật mỗi tuần",
  },
  {
    step: "04",
    phase: "VẬN HÀNH",
    title: "Theo đến khi dùng ổn",
    desc: "Đóng gói, triển khai máy chủ, cập nhật tự động và tiếp tục cải tiến theo số liệu sử dụng.",
    deliverable: "Hệ thống chạy ổn định, có tài liệu",
  },
] as const;

/* Bài viết: xem content/bai-viet/*.md (đọc bởi src/lib/posts.ts). */
