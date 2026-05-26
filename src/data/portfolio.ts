export const portfolioData = {
  personal: {
    name: "Lê Thanh Nhân",
    logoText: "LTN.",
    roleHeadline: ["Product-minded Full-stack Developer", "AI-assisted Product Builder", "Marketplace & Booking System Developer"],
    heroCopy: "Tôi xây dựng các hệ thống web thực tế với AI-assisted workflows, tích hợp API marketplace, và tư duy phát triển tập trung vào sản phẩm.",
    shortDescription: "Tôi xây dựng các hệ thống web thực tế, kết hợp giao diện sạch, backend ổn định, tích hợp API bên thứ ba và luồng nghiệp vụ vận hành. Điểm mạnh của tôi không chỉ là code, mà là khả năng hiểu sản phẩm, trải nghiệm người dùng, logic kinh doanh và nguyên nhân gốc của vấn đề kỹ thuật.",
    about: "Tôi không chỉ tập trung vào việc viết code cho chạy, mà tập trung vào việc xây dựng hệ thống có thể dùng được trong thực tế. Tôi quan tâm đến giao diện, trải nghiệm người dùng, hiệu năng, logic nghiệp vụ và cách hệ thống phục vụ vận hành kinh doanh. Tôi thường làm việc theo hướng phân tích root cause, giữ scope rõ ràng, tối ưu mà không phá UI, và dùng AI như một công cụ tăng tốc phát triển nhưng vẫn kiểm soát chất lượng sản phẩm."
  },
  systemStatus: [
    { name: "Simi Homes", label: "Booking Platform", active: true },
    { name: "Shopee/TikTok", label: "Marketplace API", active: true },
    { name: "Mirror Stock", label: "Inventory Logic", active: true },
    { name: "Admin Dashboard", label: "Operation UX", active: true },
    { name: "Performance", label: "Frontend/Backend Optimization", active: true }
  ],
  featuredWorks: [
    {
      title: "Simi Homes — Booking & Property Platform",
      type: "Nền tảng đặt phòng thực tế",
      description: "Xây dựng và tối ưu nền tảng đặt phòng bao gồm trang web công khai, danh sách chỗ ở, chi tiết property, gallery phòng, admin dashboard, luồng booking, lịch trống, email mời, phân quyền và chuẩn bị tích hợp thanh toán/API bên thứ ba.",
      keyPoints: [
        "Trang tìm kiếm chỗ ở công khai",
        "Chi tiết property và thư viện ảnh",
        "Admin dashboard và phân quyền truy cập",
        "Luồng booking, lịch, logic tính giá",
        "Lên kế hoạch tích hợp GoHost API",
        "Thiết lập email mời qua SMTP",
        "Tối ưu hiệu năng cho ảnh, bản đồ, thẻ và API calls"
      ],
      stack: ["React", "TypeScript", "Spring Boot", "PostgreSQL", "Supabase Storage", "Docker", "SMTP", "API Integration"]
    },
    {
      title: "Marketplace Operations & Mirror Stock System",
      type: "Hệ thống vận hành thương mại điện tử",
      description: "Xây dựng luồng vận hành thương mại điện tử với AI-assisted workflow tích hợp API Shopee và TikTok Shop, tập trung vào đồng bộ đơn hàng, theo dõi tồn kho, logic mirror stock và dashboard vận hành.",
      keyPoints: [
        "Tích hợp Shopee API",
        "Tích hợp TikTok Shop API",
        "Đồng bộ đơn hàng tự động",
        "Logic cân bằng mirror stock",
        "Tính toán số lượng đặt trước (reserved quantity)",
        "Tính toán số lượng tồn kho khả dụng",
        "Luồng đối soát kho hàng",
        "Dashboard theo dõi đơn hàng và tồn kho"
      ],
      stack: ["React", "TypeScript", "Java/Spring Boot", "Marketplace APIs", "REST API", "SQL", "Docker"]
    },
    {
      title: "Admin & Business Operation Interfaces",
      type: "Công cụ nội bộ / UX Quản trị",
      description: "Thiết kế và cải thiện giao diện quản trị cho các hoạt động kinh doanh, tập trung vào sự rõ ràng, tốc độ, phân quyền, khả năng hiển thị dữ liệu và UI cao cấp nhưng thiết thực.",
      keyPoints: [
        "Tái thiết kế Admin Dashboard",
        "Thẻ chỉ số hoạt động kinh doanh",
        "Bảng dữ liệu, bộ lọc, huy hiệu trạng thái",
        "Trải nghiệm phân quyền người dùng",
        "Tinh chỉnh giao diện di động và chế độ ban đêm",
        "Tối ưu hóa quy trình làm việc kinh doanh"
      ],
      stack: ["React", "TypeScript", "Tailwind", "API-driven UI", "Dashboard UX"]
    }
  ],
  expertise: [
    {
      title: "Frontend Engineering",
      skills: ["React / Next.js", "TypeScript", "Tailwind CSS", "Responsive UI", "Component architecture", "Performance optimization"]
    },
    {
      title: "Backend & Business Logic",
      skills: ["Java Spring Boot", "REST API", "PostgreSQL / SQL", "Booking logic", "Inventory logic", "Role & permission"]
    },
    {
      title: "Integration",
      skills: ["Shopee API", "TikTok Shop API", "Supabase Storage", "SMTP / Brevo", "Payment gateway", "GoHost API planning", "Docker deployment"]
    },
    {
      title: "Product & AI Workflow",
      skills: ["AI-assisted development", "Prompt-driven implementation", "Code audit", "Root-cause debugging", "Safe refactor", "UX/product thinking"]
    }
  ],
  caseStudies: [
    {
      title: "Performance Optimization Without Breaking UI",
      problem: "Các trang hiện tại bị lag, re-render không cần thiết, render ảnh/bản đồ nặng và lặp lại các API calls.",
      rootCause: "Nhiều component build lại dữ liệu quá thường xuyên, việc tải ảnh không được kiểm soát kỹ và một số tương tác gây ra update không cần thiết.",
      solution: "Giảm thiểu re-render, cải thiện cache/dedupe API, tối ưu hóa các hàm xử lý tương tác và bảo toàn nghiêm ngặt bố cục/tỷ lệ ảnh.",
      result: "Cải thiện rõ rệt độ phản hồi của trang trong khi vẫn giữ nguyên thiết kế giao diện."
    },
    {
      title: "Mirror Stock Logic for Marketplace Orders",
      problem: "Số lượng tồn kho trên marketplace dễ bị sai lệch nếu không đồng bộ thủ công liên tục.",
      rootCause: "Việc phản ánh tồn kho bị lẫn lộn giữa trạng thái vật lý tại kho và trạng thái giữ hàng tạm thời của đơn marketplace.",
      solution: "Tách biệt luồng đọc dữ liệu marketplace khỏi luồng sổ cái kho vật lý, tính toán số lượng giữ/khả dụng dựa trên vòng đời đơn hàng.",
      result: "Mang lại cái nhìn chính xác hơn về tồn kho vận hành cho cả marketplace và quá trình đối soát kho."
    },
    {
      title: "Premium UI Refinement for Real Product",
      problem: "Nhiều trang nhìn thiếu nhất quán, quá nhiều màu sắc hoặc không đủ độ 'premium'.",
      solution: "Tinh chỉnh lại bố cục, typography, khoảng cách, thiết kế thẻ, dark mode, hành vi trên mobile và nội dung tập trung vào kinh doanh.",
      result: "Tạo ra một giao diện điềm tĩnh, đáng tin cậy hơn, phù hợp cho hệ thống booking và vận hành kinh doanh thực tế."
    }
  ],
  stackCategories: [
    { name: "Languages", items: ["TypeScript", "Java", "SQL"] },
    { name: "Frontend", items: ["React", "Next.js", "Tailwind CSS", "Framer Motion"] },
    { name: "Backend", items: ["Spring Boot", "REST API", "PostgreSQL", "Node.js"] },
    { name: "Tools & DevOps", items: ["Docker", "Git", "Supabase", "SMTP"] },
    { name: "Integrations", items: ["Shopee API", "TikTok Shop API", "GoHost API", "Payment Gateways"] },
    { name: "Workflow", items: ["AI-assisted Dev", "Code Review", "Debugging", "Product Thinking"] }
  ]
};
