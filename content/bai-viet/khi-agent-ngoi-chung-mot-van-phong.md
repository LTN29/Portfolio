---
title: Khi agent ngồi chung một văn phòng
summary: Thiết kế một đội AI biết chia việc, kiểm tra chéo và nộp file — và vì sao tôi chọn hiển thị nó như một văn phòng 3D.
date: 2026-11-13
category: ve-toi
tags: [AI, Thiết kế]
---

Phần lớn công cụ AI hiện nay vẫn là một khung chat: bạn hỏi, nó trả lời. Nhưng công việc thật hiếm khi gọn trong một câu hỏi. Một kế hoạch khuyến mãi cần người phân tích kênh, người lên lịch đăng bài, người tính dự toán — rồi ai đó kiểm tra lại tất cả.

Văn Phòng AI bắt đầu từ câu hỏi: *nếu giao việc cho AI giống như giao cho một đội người thật thì sao?*

## Một đội, không phải một con bot

Trong app, mỗi nhân viên AI ngồi một bàn trong văn phòng 3D. Bạn kéo thẻ việc vào bàn trưởng nhóm. Trưởng nhóm chia việc thành các phần, giao cho từng thành viên; mỗi người làm phần của mình, một người khác kiểm tra chéo, rồi cả nhóm nộp file kết quả.

Mỗi agent có thể dùng một model khác nhau — GPT, Claude, Gemini hay model nội bộ — nhưng tất cả dùng chung một bộ công cụ và kỹ năng. Nhờ vậy tôi có thể chọn model mạnh nhất cho từng loại việc mà không phải viết lại công cụ cho từng model.

## Vì sao lại là 3D?

Câu hỏi tôi nhận nhiều nhất. Câu trả lời ngắn: **để người không rành công nghệ vẫn hiểu chuyện gì đang xảy ra.**

Khi năm agent cùng làm việc, một danh sách log dài là vô nghĩa với hầu hết mọi người. Nhưng nhìn thấy trưởng nhóm đang "suy nghĩ", hai người đang gõ phím, một người đang mở trình duyệt đọc tài liệu — ai cũng hiểu ngay. Giao diện quen thuộc làm phần công nghệ phức tạp phía sau trở nên dễ tin.

## Ba không gian trong một app

- **Văn phòng** — đội AI làm việc theo nhóm.
- **Chat nhiều model** — khi bạn chỉ cần hỏi nhanh, với trình duyệt ngay cạnh khung chat để AI tự mở web và đọc tài liệu Excel, Word trên đám mây.
- **Sảnh 3D** — không gian online chung cho cả công ty, có cả bản cho điện thoại.

## Phát hành cho ba hệ điều hành

Một app desktop chỉ có giá trị khi nó cập nhật được dễ dàng. Tôi dựng quy trình build tự động cho Windows, macOS và Linux; khi có bản mới, máy người dùng tự cập nhật. Đây là phần ít ai nhìn thấy nhưng tốn công nhất — và cũng là phần khiến app được dùng mỗi ngày thay vì bị bỏ quên sau tuần đầu.

## Điều tôi học được

Agent giỏi chưa đủ. Thứ làm người dùng tin AI là **thấy được nó đang làm gì** và **kiểm tra được kết quả**. Thiết kế cho sự minh bạch quan trọng không kém việc chọn model.
