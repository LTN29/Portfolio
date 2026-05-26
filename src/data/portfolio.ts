export const portfolioData = {
  personal: {
    name: "Lê Thanh Nhân",
    logoText: "LTN.",
    roleHeadline: ["Full-stack System Builder"],
    heroCopy: "Tập trung vào các hệ thống có logic vận hành thật: marketplace workflow, Shopee/TikTok API, inventory/order logic, booking platform, education management system, admin dashboard, Linux/VPS deployment, Docker, CI/CD, unit test và performance optimization.",
    shortDescription: "Tôi xây dựng hệ thống web thực tế từ phân tích nghiệp vụ, thiết kế flow, frontend/backend, database, API integration đến triển khai Docker/VPS và tối ưu vận hành.",
    about: "Tôi không chỉ tập trung vào việc viết code cho chạy, mà tập trung vào việc xây dựng hệ thống có thể vận hành trơn tru trong thực tế. Điểm mạnh cốt lõi của tôi là khả năng thiết kế và tối ưu luồng hệ thống (System Flow) — từ việc vạch ra data flow, business logic, đến kiến trúc đồng bộ dữ liệu và xử lý giao dịch phức tạp. Việc định hình đúng luồng hệ thống ngay từ đầu giúp giải quyết triệt để các bài toán hóc búa, giảm thiểu rủi ro và đảm bảo tính nhất quán (data consistency) cho toàn bộ kiến trúc. Tôi kết hợp tư duy hệ thống này với engineering workflow để tăng tốc quá trình xây dựng, nhưng vẫn luôn nắm quyền kiểm soát tuyệt đối về logic và chất lượng sản phẩm."
  },
  systemStatus: [
    { name: "Product & Flow Planning", chips: ["Business Flow", "User Flow", "Operation Flow"], active: true },
    { name: "Full-stack Engineering", chips: ["Frontend", "Backend", "Database", "REST API"], active: true },
    { name: "Marketplace APIs", chips: ["Shopee", "TikTok Shop", "Order Sync", "Stock Sync"], active: true },
    { name: "DevOps & Deployment", chips: ["Linux", "Ubuntu", "VPS", "Docker", "Nginx"], active: true },
    { name: "CI/CD & Testing", chips: ["Jenkins", "Unit Test", "Regression Test", "Pipeline"], active: true },
    { name: "Engineering Workflow", chips: ["Planning", "Code Review", "Debugging", "Docs"], active: true }
  ],
  coreCapabilities: [
    {
      title: "System & Product Thinking",
      description: "Phân tích nghiệp vụ, dựng flow vận hành, xác định trạng thái dữ liệu, root cause và phạm vi xử lý.",
      chips: ["Business Flow", "User Flow", "Operation Flow", "Root Cause", "Scope Control"]
    },
    {
      title: "Frontend Engineering",
      description: "Xây dựng giao diện React/Next.js rõ ràng, responsive, tối ưu render và trải nghiệm thao tác.",
      chips: ["React", "Next.js", "TypeScript", "Tailwind CSS", "UI Performance"]
    },
    {
      title: "Backend Engineering",
      description: "Thiết kế API, service layer, business logic, transaction flow và database mapping.",
      chips: ["Spring Boot", "REST API", "PostgreSQL", "Service Layer", "Business Logic"]
    },
    {
      title: "Marketplace Integration",
      description: "Tích hợp Shopee/TikTok API, đồng bộ đơn hàng, mapping dữ liệu, trạng thái đơn và tồn kho marketplace.",
      chips: ["Shopee API", "TikTok Shop API", "Order Sync", "Stock Sync", "API Mapping"]
    },
    {
      title: "Inventory & Operation Logic",
      description: "Thiết kế logic tồn kho, đơn giữ, committed stock, hủy/hoàn đơn và các luồng cập nhật theo trạng thái.",
      chips: ["Reserved Stock", "Committed Stock", "Available Stock", "Mirror Stock", "Order State"]
    },
    {
      title: "Education Management Logic",
      description: "Thiết kế luồng quản lý học viên, lớp học, khóa học, lịch học, học phí, enrollment và dữ liệu vận hành cho trung tâm ngoại ngữ.",
      chips: ["Student Management", "Course Flow", "Class Schedule", "Tuition Flow", "Admin Operation"]
    },
    {
      title: "DevOps & Server Deployment",
      description: "Triển khai hệ thống trên VPS, cấu hình Linux/Ubuntu, Docker/Docker Compose, environment và reverse proxy.",
      chips: ["Linux", "Ubuntu", "VPS", "Docker", "Docker Compose", "Nginx"]
    },
    {
      title: "CI/CD & Testing",
      description: "Thiết lập pipeline build/deploy, kiểm thử logic, unit test, regression test và kiểm soát lỗi trước khi release.",
      chips: ["Jenkins", "CI/CD", "Unit Test", "Regression Test", "Build Pipeline"]
    }
  ],
  featuredWorks: [
    {
      title: "Booking & Property Management Platform",
      type: "Booking System",
      description: "Hệ thống quản lý đặt phòng, phòng/home, trạng thái phòng, hình ảnh, dashboard quản trị, phân quyền và tích hợp API bên thứ ba.",
      keyPoints: [
        "Booking & property workflow",
        "Admin dashboard & RBAC",
        "Image/storage management",
        "Third-party API integration",
        "Performance optimization"
      ],
      stack: ["React", "TypeScript", "Spring Boot", "PostgreSQL", "Supabase Storage", "Docker", "SMTP", "API Integration"]
    },
    {
      title: "Marketplace Operations & Mirror Stock System",
      type: "Marketplace / Inventory",
      description: "Hệ thống đồng bộ đơn hàng và tồn kho đa kênh, tích hợp Shopee/TikTok, xử lý mirror stock, trạng thái đơn và dữ liệu vận hành.",
      keyPoints: [
        "Shopee/TikTok API integration",
        "Order sync & stock sync",
        "Reserved/committed/available stock",
        "Inventory calculation logic",
        "Regression test for stock transition"
      ],
      stack: ["React", "TypeScript", "Java/Spring Boot", "REST API", "SQL", "Docker", "Marketplace APIs"]
    },
    {
      title: "Education Center Management System",
      type: "Education / Admin System",
      description: "Hệ thống quản lý trung tâm ngoại ngữ với frontend, backend service và database workflow cho học viên, lớp học, khóa học, lịch học, học phí và vận hành admin.",
      keyPoints: [
        "Student profile & enrollment management",
        "Course / class / schedule workflow",
        "Tuition and payment tracking flow",
        "Admin CRUD interface and filters",
        "Frontend + Java backend service structure",
        "Database-driven operation logic"
      ],
      stack: ["JavaScript", "Java", "CSS", "T-SQL", "REST API", "Backend Service", "Admin Dashboard", "Database"]
    },
    {
      title: "Admin Operation Interfaces",
      type: "Internal Tool / Admin UX",
      description: "Các giao diện quản trị nội bộ tập trung vào xử lý dữ liệu lớn, bảng dữ liệu, bộ lọc, CRUD, phân quyền và tối ưu trải nghiệm vận hành.",
      keyPoints: [
        "Data-heavy UI optimization",
        "Reusable admin components",
        "Role-based menu",
        "Table/filter/form UX",
        "Dark mode and responsive UI"
      ],
      stack: ["React", "TypeScript", "Tailwind CSS", "Admin UI", "Dashboard UX"]
    }
  ],
  caseStudies: [
    {
      title: "Marketplace API Integration",
      problem: "Dữ liệu đơn hàng và tồn kho từ Shopee/TikTok cần được đồng bộ đúng theo trạng thái vận hành.",
      rootCause: "Mapping dữ liệu sàn, trạng thái đơn và tồn kho nội bộ dễ lệch nếu không tách rõ từng transition.",
      solution: "Thiết kế flow đồng bộ đơn hàng, mapping trạng thái, xử lý holding/committed/cancel/return và kiểm tra regression.",
      result: "Tăng độ nhất quán dữ liệu marketplace và giảm phụ thuộc thao tác đồng bộ thủ công."
    },
    {
      title: "VPS Deployment & CI/CD",
      problem: "Deploy thủ công dễ sai env, build lỗi, khó rollback và khó kiểm soát phiên bản khi release.",
      rootCause: "Thiếu pipeline chuẩn, thiếu kiểm tra build/test trước deploy và cấu hình server chưa được chuẩn hóa.",
      solution: "Chuẩn hóa Docker/Docker Compose, Linux/Ubuntu VPS setup, environment config, Jenkins pipeline, build check và test trước release.",
      result: "Giảm lỗi deploy, tăng tính ổn định môi trường và dễ kiểm soát quá trình release."
    },
    {
      title: "Performance Optimization",
      problem: "Giao diện chậm khi render nhiều dữ liệu, hình ảnh và thao tác tương tác.",
      rootCause: "Re-render không cần thiết, thiếu memoization, request lặp và xử lý sự kiện chưa tối ưu.",
      solution: "Tối ưu component rendering, caching/dedupe request, lazy loading và debounce/throttle interaction.",
      result: "Cải thiện độ mượt UI, giảm tải frontend/backend và tăng trải nghiệm thao tác."
    },
    {
      title: "Admin Operation System",
      problem: "Giao diện quản trị khó dùng, nhiều màn hình CRUD thiếu đồng nhất.",
      rootCause: "Thiếu design system, component dùng lại và luồng thao tác chưa rõ.",
      solution: "Chuẩn hóa layout, table, filter, form, role-based menu và trạng thái dữ liệu.",
      result: "Tăng tốc độ thao tác vận hành và giúp hệ thống dễ mở rộng."
    },
    {
      title: "Education Center Management",
      problem: "Quản lý học viên, lớp học, khóa học, lịch học và học phí dễ rời rạc khi dùng công cụ thủ công.",
      rootCause: "Dữ liệu vận hành nằm ở nhiều nơi, thiếu workflow tập trung cho admin.",
      solution: "Xây dựng module quản lý học viên, lớp, khóa học, lịch học, học phí và dashboard quản trị.",
      result: "Tập trung dữ liệu vận hành, giảm thao tác thủ công và dễ theo dõi tình trạng trung tâm."
    }
  ],
  stackCategories: [
    { name: "Languages", items: ["TypeScript", "Java", "SQL"] },
    { name: "Frontend", items: ["React", "Next.js", "Tailwind CSS", "Framer Motion", "Responsive UI"] },
    { name: "Backend", items: ["Spring Boot", "REST API", "PostgreSQL", "Node.js"] },
    { name: "DevOps & Server", items: ["Linux", "Ubuntu", "VPS", "Docker", "Docker Compose", "Nginx", "Environment Config"] },
    { name: "CI/CD & Testing", items: ["Jenkins", "CI/CD Pipeline", "Unit Test", "Regression Test", "Build Validation"] },
    { name: "External APIs", items: ["Shopee API", "TikTok Shop API", "Booking APIs", "Payment Gateways", "Storage APIs", "SMTP"] },
    { name: "Engineering Workflow", items: ["System Planning", "Code Review", "Debugging", "Technical Documentation", "Prompt Engineering", "AI Code Review"] }
  ],
  learningGrowth: [
    "Linux / Ubuntu Server",
    "VPS Deployment",
    "Docker / Docker Compose",
    "CI/CD Pipeline",
    "Jenkins",
    "Unit Test / Regression Test",
    "Nginx / Reverse Proxy",
    "Monitoring / Logs",
    "System Design",
    "Security Basics"
  ]
};
