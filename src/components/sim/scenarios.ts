import type { SimSystem } from "./types";

/* Kịch bản mô phỏng cho từng dự án. Dữ liệu mẫu, tên sản phẩm / nhà cung cấp là giả định. */

export const SYSTEMS: Record<string, SimSystem> = {
  /* ───────────── TỒN KHO & ĐA SÀN ───────────── */
  inventory: {
    title: "Tồn kho & kết nối đa sàn",
    modules: [
      {
        id: "order-sync",
        label: "Đồng bộ đơn từ sàn",
        desc: "Webhook → hàng đợi → giữ hàng",
        nodes: ["Sàn TMĐT", "Webhook", "Hàng đợi", "Xử lý đơn", "Kho", "Nhật ký"],
        stats: [
          { key: "orders", label: "Đơn mới hôm nay" },
          { key: "reserved", label: "Đang giữ hàng" },
          { key: "available", label: "Tồn khả dụng V5" },
        ],
        initial: { orders: 128, reserved: 14, available: 42 },
        steps: [
          {
            node: 0, title: "TikTok Shop báo có đơn mới",
            detail: "Sàn gửi sự kiện đổi trạng thái đơn sang “chờ giao” về máy chủ.",
            logs: [{ kind: "in", text: "POST /webhooks/tiktok", meta: "ORDER_STATUS_CHANGE", body: '{ "order_id": "5781…204", "status": "AWAITING_SHIPMENT" }' }],
          },
          {
            node: 1, title: "Xác thực chữ ký",
            detail: "Kiểm tra chữ ký HMAC-SHA256 của sàn, chặn yêu cầu giả mạo, trả 200 ngay để sàn không gửi lại.",
            logs: [{ kind: "ok", text: "verify signature", meta: "hợp lệ · 2ms" }, { kind: "out", text: "200 OK → TikTok", meta: "38ms" }],
          },
          {
            node: 2, title: "Đưa vào hàng đợi, chống trùng",
            detail: "Mỗi đơn có khoá idempotency; sàn gửi lại 3 lần thì hệ thống vẫn chỉ xử lý một lần.",
            logs: [{ kind: "info", text: "enqueue orders.sync", meta: "key tt:5781…204" }, { kind: "warn", text: "bỏ qua bản gửi lặp", meta: "đã có key" }],
          },
          {
            node: 3, title: "Gọi API lấy chi tiết đơn",
            detail: "Lấy dòng hàng, giá, mã vận đơn từ Open API của sàn.",
            logs: [{ kind: "out", text: "GET /order/202309/orders?ids=5781…204", meta: "200 · 312ms", body: '{ "line_items": [ { "seller_sku": "COMBO-V5-PIN", "qty": 1 } ] }' }],
            set: { orders: 129 }, focus: "orders",
          },
          {
            node: 3, title: "Ánh xạ SKU sàn → SKU nội bộ",
            detail: "Combo “Máy hút V5 + pin dự phòng” được tách thành 2 sản phẩm trong kho.",
            logs: [{ kind: "info", text: "map COMBO-V5-PIN", meta: "→ V5 ×1, PIN-V5 ×1" }],
          },
          {
            node: 4, title: "Giữ hàng tại kho gần người mua",
            detail: "Đơn giao về TP.HCM nên giữ hàng ở kho HCM; tồn khả dụng giảm ngay để không bán vượt.",
            logs: [{ kind: "ok", text: "reserve HCM: V5 −1, PIN-V5 −1", meta: "tx #88412" }],
            set: { reserved: 15, available: 41 }, focus: "available",
          },
          {
            node: 5, title: "Ghi nhật ký thay đổi tồn",
            detail: "Mọi lần cộng / trừ kho đều có người (hoặc hệ thống), lý do, chứng từ — tra lại được.",
            logs: [{ kind: "info", text: "audit_log +1", meta: "ORDER_RESERVE · TikTok" }],
          },
        ],
      },
      {
        id: "stock-push",
        label: "Đẩy tồn lên các sàn",
        desc: "Tính tồn bán được → gọi API 3 kênh",
        nodes: ["Kho", "Tính tồn bán", "Shopee", "TikTok Shop", "Website", "Kiểm tra"],
        stats: [
          { key: "onhand", label: "Tồn thực tế V5" },
          { key: "sellable", label: "Số đẩy lên sàn" },
          { key: "synced", label: "Kênh đã đồng bộ" },
        ],
        initial: { onhand: 56, sellable: "—", synced: "0/3" },
        steps: [
          {
            node: 0, title: "Tồn kho vừa thay đổi",
            detail: "Phiếu nhập 20 máy V5 về kho HCM được duyệt.",
            logs: [{ kind: "info", text: "stock.changed V5", meta: "+20 · nhập kho" }],
            set: { onhand: 76 }, focus: "onhand",
          },
          {
            node: 1, title: "Tính số được phép bán",
            detail: "Tồn thực tế − đang giữ − mức an toàn 5 máy; chia theo tỉ lệ kho ảo của từng kênh.",
            logs: [{ kind: "info", text: "sellable = 76 − 15 − 5", meta: "= 56" }],
            set: { sellable: 56 }, focus: "sellable",
          },
          {
            node: 2, title: "Cập nhật tồn trên Shopee",
            detail: "Gọi API cập nhật tồn theo model của sản phẩm.",
            logs: [{ kind: "out", text: "POST /api/v2/product/update_stock", meta: "200 · 241ms", body: '{ "item_id": 2219…, "stock_list": [ { "seller_stock": [ { "stock": 56 } ] } ] }' }],
            set: { synced: "1/3" },
          },
          {
            node: 3, title: "TikTok Shop báo vượt giới hạn gọi",
            detail: "Sàn trả 429; hệ thống chờ theo cơ chế lùi dần (backoff) rồi thử lại, không mất lượt cập nhật.",
            logs: [{ kind: "err", text: "POST /product/202309/products/…/inventory/update", meta: "429 · rate limit" }, { kind: "warn", text: "retry sau 2s", meta: "lần 1/5" }],
          },
          {
            node: 3, title: "Thử lại thành công",
            detail: "Lần gọi lại được chấp nhận.",
            logs: [{ kind: "out", text: "POST …/inventory/update", meta: "200 · 287ms" }],
            set: { synced: "2/3" },
          },
          {
            node: 4, title: "Cập nhật website bán hàng",
            detail: "Đẩy số tồn sang website để không ai đặt được hàng đã hết.",
            logs: [{ kind: "out", text: "PUT /admin/variants/…json", meta: "200 · 164ms" }],
            set: { synced: "3/3" }, focus: "synced",
          },
          {
            node: 5, title: "Đối chiếu sau đồng bộ",
            detail: "Đọc lại số tồn từ 3 kênh, lệch là báo ngay trên màn hình kho.",
            logs: [{ kind: "ok", text: "reconcile 3 kênh", meta: "khớp 56 / 56 / 56" }],
          },
        ],
      },
      {
        id: "returns",
        label: "Đổi trả & đối soát",
        desc: "Hàng hoàn → kiểm → nhập lại → đối soát tiền",
        nodes: ["Yêu cầu hoàn", "Duyệt", "Nhận hàng", "Kiểm hàng", "Nhập kho", "Đối soát"],
        stats: [
          { key: "returns", label: "Đơn hoàn đang xử lý" },
          { key: "gradeB", label: "Hàng loại B" },
          { key: "diff", label: "Chênh lệch đối soát" },
        ],
        initial: { returns: 6, gradeB: 3, diff: "0đ" },
        steps: [
          { node: 0, title: "Người mua yêu cầu trả hàng trên Shopee", detail: "Lý do: “máy không sạc được”.", logs: [{ kind: "in", text: "GET /api/v2/returns/get_return_list", meta: "1 yêu cầu mới" }], set: { returns: 7 }, focus: "returns" },
          { node: 1, title: "Duyệt theo chính sách", detail: "Trong 15 ngày, có video mở hộp → tự động đồng ý.", logs: [{ kind: "out", text: "POST /api/v2/returns/confirm", meta: "200" }] },
          { node: 2, title: "Hàng về kho, quét mã vận đơn", detail: "Nhân viên kho quét mã, hệ thống tự tìm đơn hoàn tương ứng.", logs: [{ kind: "ok", text: "scan SPXVN0…", meta: "khớp đơn hoàn" }] },
          { node: 3, title: "Kiểm hàng", detail: "Máy hoạt động, hộp móp → xếp loại B, bán thanh lý.", logs: [{ kind: "info", text: "grade = B", meta: "ảnh kiểm hàng ×3" }], set: { gradeB: 4 }, focus: "gradeB" },
          { node: 4, title: "Nhập lại kho loại B", detail: "Không cộng vào tồn bán thường, tránh giao nhầm cho đơn mới.", logs: [{ kind: "ok", text: "stock_in V5-B +1", meta: "tx #88437" }], set: { returns: 6 } },
          { node: 5, title: "Đối soát tiền với sàn", detail: "So tiền sàn hoàn lại người mua với phí đã trừ; phát hiện thu phí vận chuyển 2 lần.", logs: [{ kind: "out", text: "GET /api/v2/payment/get_escrow_detail", meta: "200 · 198ms" }, { kind: "warn", text: "lệch phí vận chuyển", meta: "−18.500đ" }], set: { diff: "−18.500đ" }, focus: "diff" },
        ],
      },
      {
        id: "daily",
        label: "Báo cáo cuối ngày",
        desc: "Tự tổng hợp 3 kênh lúc 23:59",
        nodes: ["Lịch chạy", "Gom dữ liệu", "Tính chỉ số", "Cảnh báo", "Gửi báo cáo"],
        stats: [
          { key: "revenue", label: "Doanh thu ngày" },
          { key: "low", label: "SKU sắp hết" },
          { key: "sent", label: "Đã gửi" },
        ],
        initial: { revenue: "—", low: "—", sent: "chưa" },
        steps: [
          { node: 0, title: "23:59 — lịch chạy kích hoạt", detail: "Không cần ai bấm nút.", logs: [{ kind: "info", text: "cron daily-report", meta: "23:59:00" }] },
          { node: 1, title: "Gom đơn, hoàn, quảng cáo của 3 kênh", detail: "Đọc từ bảng đã đồng bộ, không gọi lại sàn.", logs: [{ kind: "ok", text: "orders 214 · returns 6 · ads 3 chiến dịch", meta: "0.8s" }] },
          { node: 2, title: "Tính doanh thu, lợi nhuận gộp", detail: "Trừ phí sàn, phí quảng cáo, giá vốn theo lô.", logs: [{ kind: "info", text: "gross margin", meta: "31,4%" }], set: { revenue: "186,2 tr" }, focus: "revenue" },
          { node: 3, title: "Tìm sản phẩm sắp hết", detail: "So tồn với tốc độ bán 14 ngày: còn dưới 10 ngày bán thì cảnh báo.", logs: [{ kind: "warn", text: "S2 còn 6 ngày bán", meta: "gợi ý nhập 120" }], set: { low: 2 }, focus: "low" },
          { node: 4, title: "Gửi báo cáo cho quản lý", detail: "File Excel + tóm tắt 5 dòng gửi lúc 00:01.", logs: [{ kind: "out", text: "send report", meta: "email · 2 người nhận" }], set: { sent: "00:01" }, focus: "sent" },
        ],
      },
    ],
  },

  /* ───────────── MUA HÀNG & NHẬP KHẨU ───────────── */
  purchase: {
    title: "Quản lý mua hàng & nhập khẩu",
    modules: [
      {
        id: "ai-draft",
        label: "AI tạo đơn từ báo giá",
        desc: "PDF báo giá → đơn mua nháp",
        nodes: ["Tải báo giá", "AI đọc file", "Đối chiếu mã hàng", "Kiểm tra giá", "Đơn nháp"],
        stats: [
          { key: "lines", label: "Dòng hàng đọc được" },
          { key: "matched", label: "Khớp danh mục" },
          { key: "total", label: "Giá trị đơn" },
        ],
        initial: { lines: 0, matched: "0/0", total: "—" },
        steps: [
          { node: 0, title: "Nhân viên kéo thả file báo giá", detail: "File PDF 3 trang từ nhà cung cấp, tiếng Anh.", logs: [{ kind: "in", text: "upload quotation.pdf", meta: "412 KB" }] },
          { node: 1, title: "AI trích bảng hàng hoá", detail: "Đọc tên hàng, quy cách, số lượng, đơn giá, điều kiện giao hàng FOB.", logs: [{ kind: "out", text: "LLM extract → JSON", meta: "6 dòng · 4,1s", body: '{ "incoterm": "FOB", "items": [ { "name": "Cordless vacuum V5", "qty": 600, "price": 18.4 } … ] }' }], set: { lines: 6 }, focus: "lines" },
          { node: 2, title: "Đối chiếu với danh mục sản phẩm", detail: "5 dòng khớp mã nội bộ, 1 dòng mới cần tạo mã.", logs: [{ kind: "ok", text: "match SKU", meta: "5/6" }, { kind: "warn", text: "“Spare filter set”", meta: "chưa có mã" }], set: { matched: "5/6" }, focus: "matched" },
          { node: 3, title: "So với giá lần mua trước", detail: "Đơn giá máy V5 cao hơn 8% so với đơn tháng 6 → gắn cờ để đàm phán.", logs: [{ kind: "warn", text: "price +8,0%", meta: "so với PO-2026-0261" }] },
          { node: 4, title: "Tạo đơn mua nháp", detail: "Điền sẵn nhà cung cấp, cảng đi, điều kiện thanh toán 30/70.", logs: [{ kind: "ok", text: "PO-2026-0418 (nháp)", meta: "chờ duyệt" }], set: { total: "18.400 USD" }, focus: "total" },
        ],
      },
      {
        id: "approve",
        label: "Duyệt & hợp đồng",
        desc: "Duyệt theo vai trò → hợp đồng Word",
        nodes: ["Gửi duyệt", "Trưởng mua hàng", "Kế toán", "Sinh hợp đồng", "Lịch thanh toán"],
        stats: [
          { key: "status", label: "Trạng thái" },
          { key: "doc", label: "Hợp đồng" },
          { key: "pay", label: "Đợt thanh toán" },
        ],
        initial: { status: "Nháp", doc: "—", pay: 0 },
        steps: [
          { node: 0, title: "Gửi duyệt", detail: "Hệ thống tìm người duyệt theo giá trị đơn và loại hàng.", logs: [{ kind: "info", text: "route approval", meta: "2 cấp" }], set: { status: "Chờ duyệt" } },
          { node: 1, title: "Trưởng mua hàng duyệt", detail: "Duyệt ngay trên điện thoại, kèm ghi chú giảm giá 3%.", logs: [{ kind: "ok", text: "approved by Trưởng mua hàng", meta: "09:12" }] },
          { node: 2, title: "Kế toán kiểm tra ngân sách", detail: "Còn đủ hạn mức quý 4.", logs: [{ kind: "ok", text: "budget check", meta: "còn 61%" }], set: { status: "Đã duyệt" }, focus: "status" },
          { node: 3, title: "Sinh hợp đồng từ mẫu Word", detail: "Điền tên bên, danh mục hàng, điều khoản phạt chậm giao vào mẫu có sẵn.", logs: [{ kind: "out", text: "render contract.docx", meta: "docxtemplater · 0,6s" }], set: { doc: "HĐ-0418.docx" }, focus: "doc" },
          { node: 4, title: "Tạo lịch thanh toán", detail: "Đặt cọc 30% trong 7 ngày, 70% trước ngày tàu chạy; nhắc kế toán trước 3 ngày.", logs: [{ kind: "ok", text: "schedule 2 đợt", meta: "5.520 + 12.880 USD" }], set: { pay: 2 }, focus: "pay" },
        ],
      },
      {
        id: "shipment",
        label: "Theo dõi lô hàng",
        desc: "Hạn xong hàng → tàu → cảng → kho",
        nodes: ["Sản xuất", "Book tàu", "Trên biển", "Thông quan", "Về kho", "Kiểm định"],
        stats: [
          { key: "eta", label: "Dự kiến về cảng" },
          { key: "alert", label: "Cảnh báo" },
          { key: "docs", label: "Chứng từ" },
        ],
        initial: { eta: "—", alert: 0, docs: "0/4" },
        steps: [
          { node: 0, title: "Còn 5 ngày đến hạn xong hàng", detail: "Nhà máy mới báo 70% → gửi cảnh báo cho người phụ trách.", logs: [{ kind: "warn", text: "CRD − 5 ngày", meta: "tiến độ 70%" }, { kind: "out", text: "send mail qua Microsoft Graph", meta: "202" }], set: { alert: 1 }, focus: "alert" },
          { node: 1, title: "Đặt chỗ tàu, thanh toán 70%", detail: "Forwarder xác nhận chuyến; kế toán chuyển khoản đợt 2.", logs: [{ kind: "ok", text: "booking xác nhận", meta: "ETD 14/11" }], set: { eta: "28/11", alert: 0 } },
          { node: 2, title: "Tàu đang trên biển", detail: "Cập nhật ngày đến dự kiến mỗi ngày từ forwarder.", logs: [{ kind: "info", text: "ETA cập nhật", meta: "28/11 → 27/11" }], set: { eta: "27/11" }, focus: "eta" },
          { node: 3, title: "Đủ chứng từ thông quan", detail: "Hoá đơn, phiếu đóng gói, vận đơn, C/O đều đã tải lên.", logs: [{ kind: "ok", text: "documents", meta: "4/4" }], set: { docs: "4/4" }, focus: "docs" },
          { node: 4, title: "Nhập kho theo lô", detail: "1.240 sản phẩm, mỗi lô gắn mã để truy ra đơn mua.", logs: [{ kind: "ok", text: "lot LOT-0418-A…C", meta: "+1.240" }] },
          { node: 5, title: "QC lấy mẫu 2%", detail: "Đạt → đóng đơn; tồn được đẩy lên các sàn.", logs: [{ kind: "ok", text: "QC pass", meta: "25/25 mẫu" }] },
        ],
      },
    ],
  },

  /* ───────────── BẢO HÀNH ───────────── */
  warranty: {
    title: "Hệ sinh thái bảo hành",
    modules: [
      {
        id: "activate",
        label: "Kích hoạt từ đơn sàn",
        desc: "Zalo Mini App → xác minh đơn → bảo hành điện tử",
        nodes: ["Zalo Mini App", "Đăng nhập Zalo", "Xác minh đơn", "Kiểm tra điều kiện", "Tạo bảo hành", "Thông báo"],
        stats: [
          { key: "customer", label: "Người dùng" },
          { key: "warranty", label: "Bảo hành" },
          { key: "channels", label: "Thấy trên kênh" },
        ],
        initial: { customer: "chưa đăng nhập", warranty: "—", channels: 0 },
        steps: [
          { node: 0, title: "Mở Mini App, chọn “Kích hoạt bảo hành”", detail: "Không cần tải app, không cần giữ phiếu giấy.", logs: [{ kind: "in", text: "open /warranty/activate", meta: "Zalo" }] },
          { node: 1, title: "Đăng nhập một chạm bằng số Zalo", detail: "Đổi token Zalo lấy số điện thoại, cấp JWT dùng chung với app mobile.", logs: [{ kind: "out", text: "POST /api/miniapp/v1/auth/zalo", meta: "200 · 420ms" }, { kind: "ok", text: "customer #31877", meta: "JWT 30 ngày" }], set: { customer: "0909 ••• 567" }, focus: "customer" },
          { node: 2, title: "Xác minh mã đơn Shopee", detail: "Gọi API sàn kiểm tra đơn có thật, đã giao, đúng số điện thoại.", logs: [{ kind: "out", text: "GET order detail (Shopee)", meta: "200 · 356ms", body: '{ "order_status": "COMPLETED", "items": [ { "sku": "V5" } ] }' }] },
          { node: 3, title: "Kiểm tra điều kiện bảo hành", detail: "Thân máy 12 tháng, pin 6 tháng; phụ kiện tặng kèm không bảo hành.", logs: [{ kind: "info", text: "eligibility", meta: "2/3 thành phần" }] },
          { node: 4, title: "Tạo bảo hành điện tử", detail: "Ngày bắt đầu tính từ ngày giao thành công, không phải ngày đặt.", logs: [{ kind: "ok", text: "warranty BH-V5-0001", meta: "đến 15/06/2027" }], set: { warranty: "12 tháng" }, focus: "warranty" },
          { node: 5, title: "Gửi xác nhận, đồng bộ mọi kênh", detail: "Tin nhắn Zalo xác nhận; app và website tra cứu thấy ngay.", logs: [{ kind: "out", text: "send ZNS", meta: "đã gửi" }], set: { channels: 3 }, focus: "channels" },
        ],
      },
      {
        id: "claim",
        label: "Gửi yêu cầu sửa chữa",
        desc: "Mô tả lỗi → phân loại → gán trung tâm",
        nodes: ["Gửi yêu cầu", "Xác thực OTP", "Phân loại lỗi", "Chọn trung tâm", "Tạo phiếu"],
        stats: [
          { key: "code", label: "Mã phiếu" },
          { key: "center", label: "Trung tâm" },
          { key: "eta", label: "Hẹn trả" },
        ],
        initial: { code: "—", center: "—", eta: "—" },
        steps: [
          { node: 0, title: "Mô tả lỗi, chụp 2 ảnh", detail: "Gửi từ app iOS; ảnh nén trước khi tải lên.", logs: [{ kind: "in", text: "POST /api/mobile/v1/claims", meta: "2 ảnh · 380 KB" }] },
          { node: 1, title: "Xác thực OTP", detail: "Mã 6 số gửi qua tin nhắn Zalo, sai 5 lần khoá 15 phút.", logs: [{ kind: "ok", text: "otp verified", meta: "lần 1" }] },
          { node: 2, title: "Gợi ý nhóm lỗi", detail: "“Không sạc được” → nhóm Pin & sạc; gợi ý kiểm tra adapter trước.", logs: [{ kind: "info", text: "issue category", meta: "Pin & sạc" }] },
          { node: 3, title: "Chọn trung tâm gần nhất", detail: "Người gửi ở Thủ Đức → trung tâm HCM; chọn gửi qua bưu điện.", logs: [{ kind: "info", text: "warehouse HCM", meta: "gửi hàng" }], set: { center: "HCM" }, focus: "center" },
          { node: 4, title: "Tạo phiếu, hướng dẫn cách gửi", detail: "Nhắc ghi mã phiếu ngoài gói hàng.", logs: [{ kind: "ok", text: "claim BH-HCM-26111304", meta: "CREATED" }], set: { code: "BH-1304", eta: "7 ngày" }, focus: "code" },
        ],
      },
      {
        id: "repair",
        label: "Xử lý tại trung tâm",
        desc: "13 trạng thái, đổi là người dùng biết",
        nodes: ["Nhận hàng", "Kiểm tra", "Chờ đồng ý", "Linh kiện", "Sửa", "Trả hàng"],
        stats: [
          { key: "state", label: "Trạng thái" },
          { key: "parts", label: "Pin V5 trong kho" },
          { key: "notify", label: "Thông báo đã gửi" },
        ],
        initial: { state: "Chờ nhận", parts: 9, notify: 0 },
        steps: [
          { node: 0, title: "Trung tâm nhận hàng", detail: "Quét mã phiếu trên gói hàng.", logs: [{ kind: "ok", text: "RECEIVED", meta: "push app + Zalo" }], set: { state: "Đã nhận", notify: 1 } },
          { node: 1, title: "Kỹ thuật viên kiểm tra", detail: "Xác nhận lỗi pin chai, ngoài máy còn trầy nhẹ.", logs: [{ kind: "info", text: "INSPECTING → lỗi pin", meta: "KTV Tuấn" }], set: { state: "Đang kiểm tra" } },
          { node: 2, title: "Chờ người dùng đồng ý", detail: "Pin thuộc bảo hành 6 tháng nhưng đã quá 2 tháng → báo phí, người dùng bấm đồng ý trên app.", logs: [{ kind: "out", text: "WAITING_CUSTOMER_CONFIRMATION", meta: "push" }, { kind: "in", text: "đã đồng ý", meta: "sau 14 phút" }], set: { notify: 2 } },
          { node: 3, title: "Xuất linh kiện từ kho", detail: "Trừ kho linh kiện, gắn vào phiếu để tính chi phí.", logs: [{ kind: "ok", text: "parts −1 PIN-V5", meta: "tx #5521" }], set: { parts: 8, state: "Đang sửa" }, focus: "parts" },
          { node: 4, title: "Sửa xong, chạy thử", detail: "Ảnh sau sửa đính kèm phiếu.", logs: [{ kind: "ok", text: "REPAIRED", meta: "push app + Zalo" }], set: { state: "Sửa xong", notify: 3 } },
          { node: 5, title: "Gửi trả máy", detail: "Tạo vận đơn, theo dõi ngay trong app.", logs: [{ kind: "out", text: "RETURN_SHIPPING", meta: "mã vận đơn" }], set: { state: "Đang gửi trả", notify: 4 }, focus: "state" },
        ],
      },
    ],
  },

  /* ───────────── VĂN PHÒNG AI ───────────── */
  office: {
    title: "Văn Phòng AI",
    modules: [
      {
        id: "team",
        label: "Giao việc cho đội AI",
        desc: "Trưởng nhóm chia việc → nộp file",
        nodes: ["Giao việc", "Lập kế hoạch", "Nghiên cứu", "Viết", "Kiểm tra", "Xuất file"],
        stats: [
          { key: "agents", label: "Agent đang làm" },
          { key: "tools", label: "Lần dùng công cụ" },
          { key: "file", label: "Kết quả" },
        ],
        initial: { agents: 0, tools: 0, file: "—" },
        steps: [
          { node: 0, title: "Kéo thẻ việc vào bàn trưởng nhóm", detail: "“Kế hoạch khuyến mãi cuối năm cho 3 kênh bán, kèm bài đăng.”", logs: [{ kind: "in", text: "task #212", meta: "giao cho cả nhóm" }], set: { agents: 1 } },
          { node: 1, title: "Trưởng nhóm (GPT) chia 3 phần", detail: "Phân tích kênh · lịch đăng bài · dự toán, giao cho từng người.", logs: [{ kind: "info", text: "plan → 3 subtasks", meta: "GPT" }], set: { agents: 3 }, focus: "agents" },
          { node: 2, title: "Lan (Gemini) đọc dữ liệu bán hàng", detail: "Mở file Excel trên OneDrive ngay trong trình duyệt cạnh chat.", logs: [{ kind: "out", text: "tool browser_doc", meta: "bao-cao-thang.xlsx" }, { kind: "out", text: "tool web_search", meta: "5 nguồn" }], set: { tools: 2 }, focus: "tools" },
          { node: 3, title: "Hùng (Claude) viết bài đăng", detail: "Viết 6 bài theo giọng thương hiệu đã lưu trong bộ nhớ nhóm.", logs: [{ kind: "info", text: "draft 6 posts", meta: "Claude" }], set: { tools: 3 } },
          { node: 4, title: "Thảo (model nội bộ) kiểm tra", detail: "Bắt 2 lỗi giá và 1 ngày trùng lịch; trả về cho Hùng sửa.", logs: [{ kind: "warn", text: "review: 3 góp ý", meta: "vòng 1" }, { kind: "ok", text: "review: đạt", meta: "vòng 2" }] },
          { node: 5, title: "Xuất file vào khay kết quả", detail: "Word cho kế hoạch, Excel cho dự toán.", logs: [{ kind: "ok", text: "export docx + xlsx", meta: "2 file" }], set: { file: "2 file", agents: 0 }, focus: "file" },
        ],
      },
      {
        id: "chat",
        label: "Chat nhiều model + công cụ",
        desc: "Mọi model dùng chung bộ công cụ",
        nodes: ["Tin nhắn", "Chọn model", "Gọi công cụ", "Trình duyệt", "Trả lời"],
        stats: [
          { key: "model", label: "Model" },
          { key: "calls", label: "Gọi công cụ" },
          { key: "latency", label: "Chữ đầu tiên sau" },
        ],
        initial: { model: "—", calls: 0, latency: "—" },
        steps: [
          { node: 0, title: "“Mở trang báo giá đối thủ, tóm tắt 3 điểm”", detail: "Người dùng dán link và hỏi.", logs: [{ kind: "in", text: "message", meta: "có link" }] },
          { node: 1, title: "Chạy bằng tài khoản Claude của người dùng", detail: "App tự cấp quyền công cụ theo ô Quyền người dùng chọn.", logs: [{ kind: "info", text: "claude --mcp-config vp_browser", meta: "quyền: hỏi trước" }], set: { model: "Claude" }, focus: "model" },
          { node: 2, title: "Model gọi công cụ mở trang", detail: "Cùng một bộ công cụ cho GPT, Claude, Gemini và model chạy máy.", logs: [{ kind: "out", text: "browser_open", meta: "url" }], set: { calls: 1 } },
          { node: 3, title: "Trang mở ngay cạnh khung chat", detail: "Người dùng thấy AI cuộn, đọc; trang cần đăng nhập vẫn dùng phiên của họ.", logs: [{ kind: "out", text: "browser_read", meta: "12 KB chữ" }], set: { calls: 2 }, focus: "calls" },
          { node: 4, title: "Trả lời từng chữ", detail: "Kèm nguồn trích.", logs: [{ kind: "ok", text: "stream", meta: "1,1s đến chữ đầu" }], set: { latency: "1,1s" }, focus: "latency" },
        ],
      },
      {
        id: "lobby",
        label: "Sảnh 3D nhiều người",
        desc: "Đồng bộ vị trí, giữ mượt khi đông",
        nodes: ["Máy người dùng", "Máy chủ Sảnh", "Gộp tin", "Phát lại", "Vẽ 3D"],
        stats: [
          { key: "online", label: "Đang online" },
          { key: "msgs", label: "Tin/giây gửi đi" },
          { key: "draw", label: "Lệnh vẽ đám đông" },
        ],
        initial: { online: 12, msgs: 960, draw: 192 },
        steps: [
          { node: 0, title: "120 người cùng vào Sảnh", detail: "Mỗi máy gửi vị trí khi di chuyển.", logs: [{ kind: "in", text: "SSE connect ×108", meta: "+108" }], set: { online: 120 }, focus: "online" },
          { node: 1, title: "Máy chủ nhận vị trí liên tục", detail: "Nếu phát ngay từng tin thì mỗi máy phải nhận hàng nghìn tin mỗi giây.", logs: [{ kind: "warn", text: "fan-out 120×120", meta: "≈14.400 tin/s" }], set: { msgs: "14.400" } },
          { node: 2, title: "Gộp tin 80 ms một lần", detail: "Vị trí gộp mỗi 80 ms, trạng thái 250 ms.", logs: [{ kind: "ok", text: "batch positions", meta: "80ms" }], set: { msgs: "1.500" }, focus: "msgs" },
          { node: 3, title: "Phát lại cho từng máy", detail: "Chỉ gửi người ở gần chi tiết đầy đủ.", logs: [{ kind: "out", text: "broadcast batch", meta: "12,5 lần/s" }] },
          { node: 4, title: "Vẽ đám đông bằng instancing", detail: "Người ở xa vẽ chung 6 lệnh thay vì ~16 lệnh mỗi người; máy yếu tự giảm chất lượng.", logs: [{ kind: "ok", text: "crowd instanced", meta: "6 lệnh" }], set: { draw: 6 }, focus: "draw" },
        ],
      },
      {
        id: "release",
        label: "Phát hành tự động",
        desc: "1 lệnh → 3 hệ điều hành → tự cập nhật",
        nodes: ["Gắn phiên bản", "Build CI", "Đăng bản", "Máy chủ nhận", "App tự cập nhật"],
        stats: [
          { key: "builds", label: "Bản build" },
          { key: "ver", label: "Phiên bản" },
          { key: "updated", label: "Máy đã cập nhật" },
        ],
        initial: { builds: "0/3", ver: "0.9.59", updated: 0 },
        steps: [
          { node: 0, title: "Chạy lệnh phát hành", detail: "Tự tăng số phiên bản, ghi chú thay đổi, gắn tag.", logs: [{ kind: "in", text: "npm run release 0.9.60", meta: "tag v0.9.60" }] },
          { node: 1, title: "Build song song Windows, macOS, Linux", detail: "Khoảng 10–15 phút.", logs: [{ kind: "ok", text: "windows .exe", meta: "✓" }, { kind: "ok", text: "macOS .dmg", meta: "✓" }, { kind: "ok", text: "linux .deb / AppImage", meta: "✓" }], set: { builds: "3/3" }, focus: "builds" },
          { node: 2, title: "Đăng bản phát hành", detail: "Kèm file kiểm tra toàn vẹn.", logs: [{ kind: "out", text: "release published", meta: "6 file" }], set: { ver: "0.9.60" }, focus: "ver" },
          { node: 3, title: "Máy chủ tự nhận bản mới", detail: "Trang tải và thông tin cập nhật đổi theo, không cần ai đăng tay.", logs: [{ kind: "ok", text: "sync release", meta: "sau 2 phút" }] },
          { node: 4, title: "App trên máy nhân viên tự cập nhật", detail: "Tải nền, cài khi người dùng đồng ý.", logs: [{ kind: "ok", text: "update applied", meta: "nền" }], set: { updated: 86 }, focus: "updated" },
        ],
      },
    ],
  },

  /* ───────────── AI GATEWAY ───────────── */
  gateway: {
    title: "AI Gateway",
    modules: [
      {
        id: "route",
        label: "Định tuyến & dự phòng",
        desc: "Xác thực → hạn mức → chọn model → dự phòng",
        nodes: ["Ứng dụng", "Xác thực", "Hạn mức", "Chọn model", "Nhà cung cấp", "Trả về"],
        stats: [
          { key: "user", label: "Người gọi" },
          { key: "quota", label: "Hạn mức còn" },
          { key: "model", label: "Model phục vụ" },
        ],
        initial: { user: "—", quota: "—", model: "—" },
        steps: [
          { node: 0, title: "App gửi yêu cầu theo chuẩn OpenAI", detail: "Mọi app chỉ cần 1 địa chỉ, 1 key.", logs: [{ kind: "in", text: "POST /v1/responses", meta: "stream" }] },
          { node: 1, title: "Nhận diện người dùng & nhóm", detail: "Key → nhân viên phòng Kỹ thuật.", logs: [{ kind: "ok", text: "auth", meta: "team KỸ THUẬT" }], set: { user: "Kỹ thuật" }, focus: "user" },
          { node: 2, title: "Kiểm tra hạn mức", detail: "Theo người và theo nhóm, đặt lại theo chu kỳ.", logs: [{ kind: "info", text: "quota", meta: "còn 71%" }], set: { quota: "71%" } },
          { node: 3, title: "Chọn model theo nhóm model được phép", detail: "Model người dùng chọn không có trong nhóm → tự chuyển sang model tương đương.", logs: [{ kind: "info", text: "combo code-strong", meta: "→ model A" }], set: { model: "model A" } },
          { node: 4, title: "Nhà cung cấp A quá tải", detail: "Trả 503 giữa chừng.", logs: [{ kind: "err", text: "provider A", meta: "503 · 1,2s" }, { kind: "warn", text: "failover", meta: "→ model B" }], set: { model: "model B" }, focus: "model" },
          { node: 5, title: "Trả lời liền mạch", detail: "Người dùng không thấy lỗi; nhật ký ghi lại để thống kê.", logs: [{ kind: "ok", text: "stream done", meta: "2.140 token" }] },
        ],
      },
      {
        id: "image",
        label: "Tạo & sửa ảnh",
        desc: "Ảnh đi qua Cloudflare không bị cắt",
        nodes: ["Yêu cầu sửa ảnh", "Chọn model ảnh", "Gọi images/edits", "Giữ kết nối", "Trả ảnh"],
        stats: [
          { key: "model", label: "Model ảnh" },
          { key: "wait", label: "Đã chờ" },
          { key: "result", label: "Kết quả" },
        ],
        initial: { model: "—", wait: "0s", result: "—" },
        steps: [
          { node: 0, title: "“Xoá chữ trên ảnh, giữ nguyên sản phẩm”", detail: "Kèm 1 ảnh 2 MB.", logs: [{ kind: "in", text: "image_edit", meta: "1 ảnh" }] },
          { node: 1, title: "Chọn model ảnh theo model đang chat", detail: "Đang chat bằng GPT → dùng model ảnh cùng hãng.", logs: [{ kind: "info", text: "host_model", meta: "theo phiên chat" }], set: { model: "cùng hãng" } },
          { node: 2, title: "Gọi thẳng API sửa ảnh", detail: "Đường cũ bị từ chối với ảnh phức tạp; đổi sang images/edits như bản gốc.", logs: [{ kind: "out", text: "POST /images/edits", meta: "quality high" }] },
          { node: 3, title: "Giữ kết nối khi ảnh lâu", detail: "Cloudflare cắt sau 100 giây im lặng → gửi tín hiệu giữ kết nối.", logs: [{ kind: "info", text: "keepalive", meta: "mỗi 15s" }], set: { wait: "42s" }, focus: "wait" },
          { node: 4, title: "Trả ảnh về máy người dùng", detail: "Lưu file, hiện ngay trong chat.", logs: [{ kind: "ok", text: "image saved", meta: "1536×1024" }], set: { result: "đã xong" }, focus: "result" },
        ],
      },
      {
        id: "tools",
        label: "Phát công cụ xuống máy",
        desc: "Cập nhật máy chủ → mọi máy tự đổi",
        nodes: ["Máy chủ cập nhật", "Danh sách phiên bản", "Máy nhân viên", "Tải & kiểm tra", "Sẵn sàng"],
        stats: [
          { key: "ver", label: "Bản công cụ" },
          { key: "machines", label: "Máy đã nhận" },
          { key: "skills", label: "Kỹ năng" },
        ],
        initial: { ver: "r41", machines: 0, skills: 14 },
        steps: [
          { node: 0, title: "Kéo mã mới về máy chủ", detail: "Thêm 1 kỹ năng đọc PDF và sửa công cụ chỉnh ảnh.", logs: [{ kind: "in", text: "git pull", meta: "3 file" }] },
          { node: 1, title: "Tạo danh sách phiên bản", detail: "Băm từng file để máy chỉ tải phần đổi.", logs: [{ kind: "info", text: "manifest", meta: "r42" }], set: { ver: "r42", skills: 15 }, focus: "ver" },
          { node: 2, title: "Máy nhân viên tự hỏi bản mới", detail: "Khi mở app và định kỳ.", logs: [{ kind: "out", text: "GET /tools/manifest", meta: "304 / 200" }] },
          { node: 3, title: "Tải phần thay đổi, kiểm tra mã băm", detail: "Sai mã băm thì giữ bản cũ.", logs: [{ kind: "ok", text: "verify sha256", meta: "3/3" }] },
          { node: 4, title: "Công cụ mới sẵn sàng", detail: "Không cần ai cài lại tay.", logs: [{ kind: "ok", text: "tools ready", meta: "r42" }], set: { machines: 74 }, focus: "machines" },
        ],
      },
    ],
  },

  /* ───────────── TỰ ĐỘNG HOÁ ───────────── */
  /* ───────────── CHATBOT AI ───────────── */
  chatbot: {
    title: "Chatbot AI",
    modules: [
      {
        id: "rag",
        label: "Trả lời có dẫn nguồn",
        desc: "Tìm tri thức → AI tổng hợp → kiểm nguồn",
        nodes: ["Câu hỏi", "Che dữ liệu", "Tìm tri thức", "AI tổng hợp", "Kiểm nguồn", "Trả lời"],
        stats: [
          { key: "asked", label: "Câu hỏi hôm nay" },
          { key: "cited", label: "Có dẫn nguồn" },
          { key: "latency", label: "Thời gian trả lời" },
        ],
        initial: { asked: 312, cited: "97%", latency: "—" },
        steps: [
          {
            node: 0, title: "Câu hỏi gửi từ website",
            detail: "“Máy hút V5 của tôi báo đèn đỏ, còn bảo hành không? SĐT 0909 123 456”.",
            logs: [{ kind: "in", text: "POST /api/public/chatbot/message", meta: "phiên #a91f", body: '{ "message": "Máy hút V5 báo đèn đỏ, còn bảo hành không? SĐT 0909…" }' }],
          },
          {
            node: 1, title: "Che dữ liệu cá nhân",
            detail: "Số điện thoại, email, mã phiếu được che trước khi rời máy chủ. AI không bao giờ thấy dữ liệu riêng của người dùng.",
            logs: [{ kind: "info", text: "mask phone → [SĐT]", meta: "1 mục" }, { kind: "ok", text: "không gửi phiếu / ghi chú kỹ thuật", meta: "chính sách" }],
          },
          {
            node: 2, title: "Lấy 5 tri thức sát nhất",
            detail: "Chỉ tìm trong kho đã duyệt: cách xử lý lỗi, chính sách bảo hành, thông tin sản phẩm. Mỗi mục giới hạn độ dài.",
            logs: [{ kind: "info", text: "search knowledge", meta: "5 / 1.240 mục · 18ms", body: '[ "ERR-V5-DEN-DO", "POL-BH-12T", "SP-V5", "FAQ-KICH-HOAT", "FAQ-TAO-PHIEU" ]' }],
          },
          {
            node: 3, title: "AI viết câu trả lời từ đúng 5 nguồn đó",
            detail: "Gọi qua cổng AI của công ty: hạn mức riêng cho chatbot, không đọc bộ nhớ nội bộ, tự chuyển model khi lỗi.",
            logs: [{ kind: "out", text: "POST /v1/responses", meta: "200 · 1,9s", body: '{ "answer": "Đèn đỏ là pin quá nhiệt…", "knowledgeCodes": ["ERR-V5-DEN-DO", "POL-BH-12T"] }' }],
          },
          {
            node: 4, title: "Kiểm tra nguồn AI dẫn",
            detail: "Mã tri thức AI trả về phải nằm trong 5 nguồn đã đưa. Dẫn sai hoặc không dẫn là câu trả lời bị loại.",
            logs: [{ kind: "ok", text: "knowledgeCodes ⊂ evidence", meta: "2/2 hợp lệ" }],
            set: { cited: "97%" },
          },
          {
            node: 5, title: "Trả lời kèm thẻ sản phẩm và nút tạo phiếu",
            detail: "Cách xử lý đèn đỏ, điều kiện bảo hành 12 tháng và nút “Tạo yêu cầu bảo hành” ngay trong khung chat.",
            logs: [{ kind: "out", text: "200 → người hỏi", meta: "source AI_RAG · 2,1s" }],
            set: { asked: 313, latency: "2,1s" }, focus: "latency",
          },
        ],
      },
      {
        id: "fallback",
        label: "Khi AI gặp sự cố",
        desc: "Tạm ngắt AI, trả lời từ dữ liệu",
        nodes: ["Câu hỏi", "Bộ nhớ đệm", "AI tổng hợp", "Cầu dao", "Tri thức đã duyệt", "Trả lời"],
        stats: [
          { key: "ai", label: "Lượt gọi AI" },
          { key: "db", label: "Trả lời từ dữ liệu" },
          { key: "err", label: "Lỗi người dùng thấy" },
        ],
        initial: { ai: 0, db: 0, err: 0 },
        steps: [
          { node: 0, title: "Có người hỏi chính sách đổi trả", detail: "“Mua online thì được đổi trong bao nhiêu ngày?”", logs: [{ kind: "in", text: "POST /api/public/chatbot/message", meta: "phiên #c204" }] },
          { node: 1, title: "Chưa có trong bộ nhớ câu trả lời", detail: "Câu đã được kiểm chứng trước đó thì trả ngay, không tốn lượt AI. Câu này mới.", logs: [{ kind: "info", text: "answer cache", meta: "miss" }] },
          { node: 2, title: "Cổng AI báo hết hạn mức", detail: "Nhà cung cấp trả 429 — hạn mức ngày của chatbot đã dùng hết.", logs: [{ kind: "err", text: "POST /v1/responses", meta: "429 insufficient_quota" }], set: { ai: 1 } },
          { node: 3, title: "Mở cầu dao 5 phút", detail: "Hết hạn mức thì ngắt 5 phút, lỗi mạng thì 30 giây. Trong lúc đó không gọi AI nữa.", logs: [{ kind: "warn", text: "circuit open", meta: "5 phút" }] },
          { node: 4, title: "Trả lời thẳng từ tri thức đã duyệt", detail: "Tìm theo ngưỡng chặt trước, rồi ngưỡng rộng; cuối cùng mới là câu trả lời an toàn.", logs: [{ kind: "ok", text: "match POL-DOI-TRA", meta: "ngưỡng chặt · 0,86" }], set: { db: 1 }, focus: "db" },
          { node: 5, title: "Người hỏi vẫn nhận câu trả lời đúng", detail: "Không có lỗi 500 chỉ vì AI hết token hay cổng AI dừng.", logs: [{ kind: "out", text: "200 → người hỏi", meta: "source DB · 120ms" }], focus: "err" },
          { node: 3, title: "Câu kế tiếp không chờ AI", detail: "Cầu dao còn mở nên đi thẳng xuống dữ liệu, trả lời ngay.", logs: [{ kind: "info", text: "bỏ qua AI", meta: "cầu dao còn 4:12" }, { kind: "ok", text: "200 → người hỏi", meta: "source DB · 95ms" }], set: { db: 2 }, focus: "db" },
        ],
      },
      {
        id: "learn",
        label: "Học từ câu chưa trả lời",
        desc: "Quản trị duyệt → thành tri thức mới",
        nodes: ["Câu chưa trả lời", "Quản trị viên", "Duyệt tri thức", "Kho tri thức", "Trả lời"],
        stats: [
          { key: "open", label: "Câu chờ xử lý" },
          { key: "kb", label: "Mục tri thức" },
          { key: "hit", label: "Trả lời được" },
        ],
        initial: { open: 7, kb: 1240, hit: "91%" },
        steps: [
          { node: 0, title: "Gom câu bot chưa trả lời được", detail: "Không đủ nguồn thì bot hỏi lại người dùng và ghi câu đó vào danh sách chờ.", logs: [{ kind: "in", text: "unanswered +1", meta: "“lõi lọc bao lâu thay một lần?”" }] },
          { node: 1, title: "Quản trị viên xem nhật ký và thống kê", detail: "Câu hỏi được gom theo ý, thấy ngay chủ đề được hỏi nhiều mà chưa có câu trả lời.", logs: [{ kind: "info", text: "GET /admin/chatbot/unanswered", meta: "7 câu · 3 cùng ý" }] },
          { node: 2, title: "Viết câu trả lời chuẩn, gắn sản phẩm", detail: "Một lần duyệt giải quyết cả 3 câu cùng ý.", logs: [{ kind: "ok", text: "resolve → knowledge", meta: "FAQ-LOC-06" }], set: { open: 4 }, focus: "open" },
          { node: 3, title: "Lưu vào kho tri thức", detail: "Có hiệu lực ngay cho website và app, không cần triển khai lại.", logs: [{ kind: "ok", text: "knowledge +1", meta: "đã duyệt" }], set: { kb: 1241 }, focus: "kb" },
          { node: 4, title: "Lần sau có người hỏi, bot trả lời có nguồn", detail: "Câu trả lời dẫn đúng mục tri thức vừa thêm.", logs: [{ kind: "out", text: "200 → người hỏi", meta: "source AI_RAG · FAQ-LOC-06" }], set: { hit: "92%" }, focus: "hit" },
        ],
      },
    ],
  },

  queue: {
    title: "Tự động hoá chiến dịch",
    modules: [
      {
        id: "dispatch",
        label: "Phân việc & tự khôi phục",
        desc: "Không trùng việc, máy treo thì chạy lại",
        nodes: ["Chiến dịch", "Bộ phân việc", "Máy chạy", "Giám sát", "Kết quả"],
        stats: [
          { key: "done", label: "Bài đã xong" },
          { key: "dup", label: "Bị làm trùng" },
          { key: "recover", label: "Tự khôi phục" },
        ],
        initial: { done: 0, dup: 0, recover: 0 },
        steps: [
          { node: 0, title: "Tạo chiến dịch 300 bài", detail: "Nội dung, khung giờ, số máy chạy.", logs: [{ kind: "in", text: "campaign #19", meta: "300 bài · 3 máy" }] },
          { node: 1, title: "Khoá từng bài khi phân", detail: "Bài đã giao cho máy nào thì máy khác không lấy được.", logs: [{ kind: "info", text: "lease #101 → máy 1", meta: "hết hạn 90s" }, { kind: "info", text: "lease #102 → máy 2", meta: "" }] },
          { node: 2, title: "Máy chạy trình duyệt tự động", detail: "Giữ phiên đăng nhập, thao tác theo nhịp tự nhiên.", logs: [{ kind: "ok", text: "máy 1 xong #101", meta: "41s" }], set: { done: 1 } },
          { node: 3, title: "Máy 2 bị treo", detail: "Không báo tiến độ quá 90 giây.", logs: [{ kind: "err", text: "máy 2 không phản hồi", meta: "90s" }] },
          { node: 3, title: "Giám sát thu hồi việc, khởi động lại máy", detail: "Bài #102 trả về hàng đợi, không mất, không trùng.", logs: [{ kind: "warn", text: "release lease #102", meta: "requeue" }, { kind: "ok", text: "restart máy 2", meta: "12s" }], set: { recover: 1 }, focus: "recover" },
          { node: 4, title: "Báo cáo chiến dịch", detail: "Đếm theo bài, theo máy, theo lỗi.", logs: [{ kind: "ok", text: "300/300", meta: "trùng 0" }], set: { done: 300 }, focus: "done" },
        ],
      },
    ],
  },

  /* ───────────── WEBSITE SAPO ───────────── */
  store: {
    title: "Website bán hàng",
    modules: [
      {
        id: "theme",
        label: "Theme & dữ liệu sản phẩm",
        desc: "Một nguồn sản phẩm cho web và Mini App",
        nodes: ["Quản trị cửa hàng", "Theme", "Trang sản phẩm", "SEO", "Mini App"],
        stats: [
          { key: "products", label: "Sản phẩm" },
          { key: "lcp", label: "Tải trang (LCP)" },
          { key: "mini", label: "Mini App đọc lại" },
        ],
        initial: { products: 29, lcp: "—", mini: "chưa" },
        steps: [
          { node: 0, title: "Nhân viên thêm sản phẩm mới", detail: "Ảnh, giá, khuyến mãi nhập một lần trong quản trị.", logs: [{ kind: "in", text: "product created", meta: "#30" }], set: { products: 30 }, focus: "products" },
          { node: 1, title: "Theme tự sắp khối nội dung", detail: "Đổi màu, banner, thứ tự khối ngay trong trang chỉnh giao diện.", logs: [{ kind: "info", text: "render section product-grid", meta: "Liquid" }] },
          { node: 2, title: "Trang sản phẩm tải nhanh", detail: "Ảnh đúng kích thước theo màn hình, tải chậm phần dưới.", logs: [{ kind: "ok", text: "LCP", meta: "1,6s · 4G" }], set: { lcp: "1,6s" }, focus: "lcp" },
          { node: 3, title: "Dữ liệu cấu trúc cho Google", detail: "Product, giá, tình trạng còn hàng.", logs: [{ kind: "ok", text: "schema.org/Product", meta: "hợp lệ" }] },
          { node: 4, title: "Mini App đọc lại sản phẩm", detail: "Bán trên Zalo mà không phải nhập lại.", logs: [{ kind: "out", text: "GET /products/….json", meta: "200 · cache 5 phút" }], set: { mini: "đã có" }, focus: "mini" },
        ],
      },
    ],
  },
};
