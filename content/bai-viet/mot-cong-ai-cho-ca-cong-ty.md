---
title: Một cổng AI cho cả công ty
summary: Khi mỗi phòng ban tự dùng một tài khoản AI, chi phí và quyền truy cập nhanh chóng vượt khỏi tầm kiểm soát. Đây là cách tôi gom tất cả về một cổng duy nhất.
date: 2026-11-13
category: ve-toi
tags: [AI, Hạ tầng]
---

Khi AI bắt đầu được dùng rộng rãi trong công ty, tôi thấy cùng một bức tranh lặp lại: mỗi người một tài khoản, mỗi ứng dụng một khoá API, không ai biết tháng này đã tiêu bao nhiêu và ai đang dùng model nào. Khi một nhà cung cấp gặp sự cố, mọi công cụ dựa vào nó dừng theo.

AI Gateway là câu trả lời của tôi: **một cổng duy nhất** đứng giữa mọi ứng dụng và mọi nhà cung cấp model.

## Một địa chỉ, một khoá

Mọi ứng dụng nội bộ — app desktop, trợ lý chat, công cụ tự động — chỉ cần biết một địa chỉ và một khoá, gọi theo chuẩn API quen thuộc của OpenAI. Ứng dụng không cần biết phía sau là model nào, của hãng nào.

Chuẩn chung này là quyết định quan trọng nhất. Nó biến việc thêm một model mới hay đổi nhà cung cấp thành chuyện cấu hình ở cổng, không phải sửa từng ứng dụng.

## Mỗi yêu cầu đi qua bốn bước

1. **Nhận diện** — khoá cho biết đây là ai, thuộc nhóm nào.
2. **Hạn mức** — kiểm tra hạn mức theo người và theo nhóm, đặt lại theo chu kỳ.
3. **Chọn model** — mỗi nhóm chỉ được dùng một tập model nhất định; nếu người dùng chọn model ngoài tập đó, cổng tự chuyển sang model tương đương.
4. **Dự phòng** — nếu nhà cung cấp trả lỗi quá tải giữa chừng, cổng chuyển sang model khác và tiếp tục trả lời. Người dùng không thấy lỗi; nhật ký ghi lại để thống kê.

Phần mô phỏng ở trang chủ chạy đúng luồng này — bạn có thể bấm từng bước để xem.

## Những chỗ tôi từng vấp

**Ảnh lớn bị cắt giữa chừng.** Tạo và sửa ảnh có thể mất vài chục giây. Cloudflare đứng trước máy chủ sẽ cắt kết nối nếu im lặng quá 100 giây, nên những yêu cầu ảnh nặng thỉnh thoảng biến mất. Cách xử lý: gửi tín hiệu giữ kết nối định kỳ trong lúc chờ.

**Model ảnh phải "cùng phe" với model đang chat.** Người dùng đang chat bằng model của hãng nào thì yêu cầu sửa ảnh nên đi tới model ảnh của chính hãng đó. Tôi tuỳ biến bộ định tuyến mã nguồn mở để làm điều này, thay vì bắt người dùng tự chọn.

## Không chỉ là cổng gọi model

Về sau, cổng còn làm thêm hai việc mà ban đầu tôi không định làm: phát công cụ, kỹ năng và bản cập nhật app xuống máy nhân viên tự động, và chạy máy chủ thời gian thực cho Sảnh 3D nhiều người cùng lúc. Khi đã có một điểm trung tâm mà mọi ứng dụng tin tưởng, rất nhiều việc trở nên đơn giản hơn.

## Bài học

Nếu tổ chức của bạn đang dùng AI ở nhiều nơi, hãy gom về một cổng *trước khi* số lượng ứng dụng tăng lên. Chi phí làm sớm rất nhỏ; chi phí làm muộn là đi sửa từng ứng dụng một.
