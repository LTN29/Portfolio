/* Nội dung hồ sơ năng lực — sửa ở đây, giao diện tự cập nhật.
 * Không ghi tên công ty / thương hiệu nơi làm việc: mô tả theo loại hệ thống và vai trò của mình. */

export type VisualKind = "live" | "office" | "gateway" | "orchestrator" | "inventory" | "warranty" | "mobile";
export type DemoKind = "office" | "gateway" | "chatbot" | "warranty" | "store" | "purchase" | "inventory" | "live" | "queue";

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
  ["04", "Kênh dùng chung một dữ liệu: Web · Zalo · iOS · Android"],
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
  /** câu mở màn sân khấu: điều tôi đã gặp phải trước khi làm dự án này */
  pitch: string;
  role: string[];
  /** những gì đã trải qua khi làm dự án này */
  highlights: string[];
  /** bài học rút ra, một câu */
  lesson: string;
  stack: string[];
  demo: DemoKind;
  visual: VisualKind;
  tone: "ink" | "stone" | "mist" | "sand";
};

export const chapters = [
  { id: "ai", title: "AI & tự động hoá", note: "Đưa AI vào công việc hằng ngày" },
  { id: "channels", title: "Sản phẩm đa kênh", note: "Bảo hành · bán hàng · Web · Zalo · Mobile" },
  { id: "ops", title: "Hệ thống vận hành", note: "Mua hàng · kho · kết nối sàn" },
] as const;

export const projects: Project[] = [
  {
    id: "van-phong-ai",
    chapter: "ai",
    name: "Văn Phòng AI",
    kind: "Ứng dụng desktop đa agent",
    tagline: "Tôi thử giao việc cho AI như giao cho một đội người thật: mỗi agent ngồi một bàn trong văn phòng 3D, trưởng nhóm chia việc, một người kiểm tra chéo rồi cả nhóm nộp file. Tôi chọn 3D vì người không rành công nghệ nhìn vào là hiểu AI đang làm gì.",
    pitch: "Công việc thật hiếm khi gọn trong một câu hỏi — vậy mà công cụ AI nào cũng chỉ là một khung chat.",
    role: ["Ý tưởng", "Thiết kế UI/UX & 3D", "Full-stack", "Phát hành"],
    highlights: [
      "Một danh sách log dài là vô nghĩa với hầu hết mọi người; nhìn thấy trưởng nhóm đang “suy nghĩ”, hai người gõ phím, một người mở trình duyệt thì ai cũng hiểu",
      "Mỗi agent dùng một model khác nhau (GPT, Claude, Gemini, model nội bộ) nhưng chung bộ công cụ — đổi model không phải viết lại công cụ",
      "Từng gặp lỗi mất đoạn chat: bản đồng bộ cũ thay cả lịch sử khi số lượt lệch. Tôi đổi sang chỉ nối phần mới, sao lưu trước mỗi lần ghi và thêm nút khôi phục",
      "Phần tốn công nhất là phát hành: build tự động cho Windows, macOS, Linux và tự cập nhật — thứ giữ app được dùng mỗi ngày thay vì bị quên sau tuần đầu",
    ],
    lesson: "Người dùng tin AI khi thấy được nó đang làm gì và kiểm tra được kết quả. Thiết kế cho sự minh bạch quan trọng không kém việc chọn model.",
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
    tagline: "Tôi gom mọi ứng dụng gọi AI về một cổng: chỉ cần một địa chỉ, một khoá, gọi theo chuẩn API quen thuộc. Từ đó thêm model hay đổi nhà cung cấp chỉ còn là sửa cấu hình ở cổng, không phải sửa từng ứng dụng.",
    pitch: "Mỗi người một tài khoản AI, mỗi ứng dụng một khoá — không ai biết tháng này đã tiêu bao nhiêu.",
    role: ["Kiến trúc", "Backend", "Vận hành máy chủ"],
    highlights: [
      "Mỗi yêu cầu đi qua bốn bước: nhận diện bằng mã băm của khoá, kiểm hạn mức, chọn model được phép, tự chuyển model khi nhà cung cấp quá tải",
      "Ảnh nặng thỉnh thoảng biến mất vì Cloudflare cắt kết nối im lặng quá 100 giây — tôi gửi tín hiệu giữ kết nối trong lúc chờ",
      "Bộ cài từng làm hỏng cấu hình máy nhân viên vì dòng log lẫn vào giá trị trả về. Giờ bộ cài dựng file tạm, kiểm tra hợp lệ rồi mới thay, luôn giữ bản cũ",
      "Tuỳ biến bộ định tuyến model mã nguồn mở; mọi chỗ sửa đều đánh dấu và ghi chú để áp lại sau mỗi lần nâng cấp",
    ],
    lesson: "Gom về một cổng trước khi số ứng dụng tăng lên: làm sớm thì rẻ, làm muộn là đi sửa từng ứng dụng một.",
    stack: ["Node.js", "Docker", "SSE", "Cloudflare"],
    demo: "gateway",
    visual: "gateway",
    tone: "mist",
  },
  {
    id: "chatbot-ai",
    chapter: "ai",
    name: "Chatbot AI",
    kind: "Trợ lý hỏi đáp trên web & app",
    tagline: "Tôi chỉ cho AI trả lời từ kho tri thức đã duyệt và kiểm tra nguồn nó dẫn. Khi AI lỗi hay hết hạn mức, hệ thống tạm ngắt và trả lời thẳng từ dữ liệu — người hỏi không bao giờ thấy màn hình lỗi.",
    pitch: "Chatbot trả lời sai một câu về chính sách là mất niềm tin — mà AI thì có lúc bịa, có lúc hết hạn mức.",
    role: ["Ý tưởng", "Thiết kế hội thoại", "Backend & AI", "Trang quản trị"],
    highlights: [
      "Mỗi câu hỏi lấy 5 nguồn sát nhất (FAQ, chính sách, cách xử lý lỗi, sản phẩm); câu trả lời nào dẫn sai nguồn bị loại",
      "Cầu dao: AI hết hạn mức hay lỗi liên tiếp thì ngắt một lúc (5 phút hoặc 30 giây tuỳ loại lỗi); câu hay hỏi được nhớ sẵn để gọi AI ít hơn",
      "Che số điện thoại, email, mã phiếu trước khi gửi AI; từ chối câu dò cấu hình, kéo câu lạc đề về đúng sản phẩm",
      "Câu chưa trả lời được gom lại để duyệt thành tri thức mới — kho tri thức lớn dần theo câu hỏi thật",
    ],
    lesson: "AI là một tầng có thể hỏng. Thiết kế đường lui trước, rồi mới cho AI nói.",
    stack: ["Spring Boot", "React", "Database", "RAG", "Node.js"],
    demo: "chatbot",
    visual: "gateway",
    tone: "mist",
  },
  {
    id: "facebook-automation",
    chapter: "ai",
    name: "Tự động hoá chiến dịch",
    kind: "Hàng đợi & máy chạy song song",
    tagline: "Tôi tách bộ phân việc khỏi máy chạy: mỗi bài chỉ có đúng một việc trong hàng đợi, máy nào treo thì giám sát tự phát hiện và chạy lại. Mặc định là chạy thử — chỉ nhập nội dung, không gửi.",
    pitch: "Chạy trên nhiều máy cùng lúc, rủi ro lớn nhất là một việc bị làm hai lần.",
    role: ["Thiết kế hệ thống", "Automation"],
    highlights: [
      "Mỗi chiến dịch – bài – tài khoản chỉ có một việc trong hàng đợi, nên không bao giờ trùng",
      "Mỗi tài khoản một hồ sơ trình duyệt riêng giữ phiên đăng nhập; không lưu mật khẩu",
      "Năm luồng tự động: phân việc, chạy tay, thử lại việc lỗi, giám sát máy, kiểm tra phiên đăng nhập",
    ],
    lesson: "Việc tự động có tác động ra bên ngoài thì mặc định phải là chạy thử — bật chạy thật là một quyết định có chủ ý.",
    stack: ["n8n", "Playwright", "Docker"],
    demo: "queue",
    visual: "orchestrator",
    tone: "sand",
  },
  {
    id: "bao-hanh",
    chapter: "channels",
    name: "Hệ sinh thái bảo hành",
    kind: "Website · Zalo Mini App · App iOS & Android",
    tagline: "Tôi làm một hệ thống bảo hành dùng chung một dữ liệu cho bốn kênh: website, Zalo Mini App, iOS và Android. Kỹ thuật viên cập nhật một lần, người mua thấy ngay ở kênh mình đang dùng.",
    pitch: "Muốn biết máy đang bảo hành tới đâu, người mua phải gọi điện rồi chờ.",
    role: ["Ý tưởng", "Thiết kế UI/UX", "Web & Mini App", "App mobile"],
    highlights: [
      "Phiếu đi qua 13 trạng thái theo một máy trạng thái: không có bước nhảy cóc, mỗi lần đổi đều để lại dấu vết",
      "Cơ sở dữ liệu là nguồn sự thật; bảng tính chỉ là bản sao đồng bộ sau, nên lỗi đồng bộ không làm hỏng phiếu đã lưu",
      "Zalo Mini App đăng nhập một chạm bằng số Zalo; app iOS & Android đăng nhập OTP, song ngữ Việt – Anh",
      "Trang tra cứu công khai chỉ hiện thông tin tối thiểu, không lộ ghi chú nội bộ hay địa chỉ riêng",
    ],
    lesson: "Nhiều kênh chỉ dễ khi chỉ có một nguồn dữ liệu — mọi kênh còn lại chỉ là cửa sổ nhìn vào.",
    stack: ["React", "Spring Boot", "Database", "React Native", "Zalo Mini App", "Docker"],
    demo: "warranty",
    visual: "warranty",
    tone: "sand",
  },
  {
    id: "website-sapo",
    chapter: "channels",
    name: "Website bán hàng",
    kind: "Theme tuỳ biến trên nền tảng thương mại điện tử",
    tagline: "Tôi tự thiết kế và lập trình theme trên nền tảng thương mại điện tử có sẵn: trang chủ, danh mục, sản phẩm, khuyến mãi. Dữ liệu sản phẩm dùng chung với Mini App nên chỉ phải nhập một lần.",
    pitch: "Theme có sẵn thì giống hàng trăm cửa hàng khác; tự làm từ đầu thì sợ chậm và rớt SEO.",
    role: ["Thiết kế giao diện", "Lập trình theme"],
    highlights: [
      "Theme theo nhận diện riêng, đổi màu và khối nội dung ngay trong trang quản trị",
      "Tối ưu tốc độ và SEO trang sản phẩm, hiển thị tốt trên điện thoại",
      "Mini App đọc lại dữ liệu sản phẩm từ website để bán trên Zalo",
    ],
    lesson: "Đứng trên nền tảng có sẵn và dồn công sức vào phần tạo khác biệt, thay vì làm lại những thứ ai cũng có.",
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
    tagline: "Tôi gom mỗi đơn mua vào một dòng thời gian 10 mốc, từ lúc dự tính đến khi hàng về kho, kèm lịch thanh toán, cảnh báo trễ hạn và chứng từ. AI đọc báo giá, hợp đồng rồi điền sẵn đơn để bớt gõ lại.",
    pitch: "Một đơn nhập khẩu đi qua quá nhiều nơi: email, bảng tính, chứng từ — và trí nhớ của từng người.",
    role: ["Ý tưởng", "Thiết kế UI/UX", "Full-stack"],
    highlights: [
      "AI đọc báo giá / hợp đồng và điền sẵn đơn mua",
      "Lịch thanh toán, dòng tiền dự kiến, cảnh báo đơn sắp trễ hạn",
      "Đăng nhập tài khoản công ty (Microsoft), phân quyền theo vai trò; gửi email và biên bản bàn giao PDF ngay từ hệ thống",
      "Thống kê bán hàng & tồn kho để quyết định nhập thêm",
    ],
    lesson: "Một cảnh báo đến đúng lúc có giá trị hơn một báo cáo đầy đủ mà không ai mở.",
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
    tagline: "Tôi đặt một nguyên tắc: chỉ có một nguồn sự thật là kho nội bộ, các sàn chỉ là nơi hiển thị. Đơn từ Shopee, TikTok Shop đổ về một chỗ, trừ tồn đúng kho và ghi nhật ký mọi thay đổi.",
    pitch: "Số tồn trên các sàn luôn lệch so với kho thật — mà lệch là bán âm.",
    role: ["Thiết kế UI/UX", "Full-stack", "Tích hợp API sàn"],
    highlights: [
      "Trả lời sàn trước, xử lý sau: đơn vào hàng đợi để giờ cao điểm không tự tạo ra bão yêu cầu trùng",
      "Mỗi đơn một khoá chống trùng — sàn gửi lại ba lần vẫn chỉ xử lý một lần",
      "Kho ảo cho từng kênh để giữ phần dự phòng cho kênh quan trọng hơn",
      "Lô hàng đã có lịch sử thì không đổi tên; mọi lần điều chỉnh tồn đều có nhật ký để truy vết",
    ],
    lesson: "Làm việc với hệ thống bên ngoài, hãy giả định mọi thứ sẽ đến trễ, đến hai lần hoặc không đến.",
    stack: ["React", "Vite", "Spring Boot", "Database", "Shopee API", "TikTok Shop API"],
    demo: "inventory",
    visual: "inventory",
    tone: "stone",
  },
];

export const otherProjects = [
  { name: "Đặt phòng lưu trú", note: "Đặt phòng trực tuyến nối với phần mềm quản lý lưu trú (PMS). Việc ghi đặt phòng thật được khoá mặc định cho tới khi kiểm thử xong — sai một đơn đặt phòng là sai với người thật.", stack: "Next.js · Webhook · Payment" },
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
