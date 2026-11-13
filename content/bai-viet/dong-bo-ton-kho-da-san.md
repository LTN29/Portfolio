---
title: Đồng bộ tồn kho đa sàn mà không bán âm
summary: Webhook, hàng đợi và khoá chống trùng — cách giữ số tồn khớp nhau giữa kho thật và các sàn thương mại điện tử.
date: 2026-11-13
category: ve-toi
tags: [Hệ thống, Tích hợp]
---

Bán trên nhiều sàn cùng lúc có một nỗi sợ chung: **bán âm** — sàn vẫn nhận đơn trong khi kho đã hết hàng. Nguyên nhân gần như luôn giống nhau: mỗi sàn giữ một con số tồn riêng, và các con số đó cập nhật chậm hơn tốc độ khách đặt hàng.

Hệ thống tồn kho đa sàn của tôi giải quyết điều đó bằng một nguyên tắc: *chỉ có một nguồn sự thật là kho nội bộ; các sàn chỉ là nơi hiển thị.*

## Đơn mới đi qua sáu bước

1. **Sàn báo có đơn** — sàn gọi webhook vào hệ thống ngay khi trạng thái đơn đổi.
2. **Xác thực chữ ký** — kiểm tra chữ ký của sàn để chặn yêu cầu giả mạo, rồi trả lời ngay để sàn không gửi lại.
3. **Đưa vào hàng đợi, chống trùng** — mỗi đơn có một khoá riêng; sàn có gửi lại ba lần thì hệ thống vẫn chỉ xử lý một lần.
4. **Lấy chi tiết đơn** — gọi API của sàn để lấy danh sách sản phẩm.
5. **Ánh xạ mã sàn sang mã nội bộ** — một mã combo trên sàn được tách thành từng sản phẩm thật trong kho.
6. **Giữ hàng và ghi nhật ký** — trừ tồn tại kho phù hợp và ghi lại mọi thay đổi để truy vết.

## Ba quyết định quan trọng

**Trả lời sàn trước, xử lý sau.** Sàn chỉ đợi một khoảng thời gian ngắn rồi coi như lỗi và gửi lại. Nếu xử lý xong mới trả lời, đơn đông là hệ thống tự tạo ra bão yêu cầu trùng. Hàng đợi tách hai việc này ra.

**Khoá chống trùng thay vì hy vọng.** Mạng chập chờn, sàn gửi lại là chuyện bình thường. Thiết kế để việc nhận một đơn hai lần *không có hậu quả* an toàn hơn nhiều so với cố gắng đảm bảo nó không bao giờ xảy ra.

**Kho ảo cho từng kênh.** Không phải toàn bộ tồn kho đều nên mở bán trên mọi sàn. Mỗi kênh có một "kho ảo" — phần tồn được phép bán — để giữ lại dự phòng cho kênh quan trọng hơn.

## Ngoài tồn kho

Khi đơn hàng đã đổ về một chỗ, những thứ khác đi theo khá tự nhiên: đổi trả, đánh giá, quảng cáo từ các sàn, báo cáo hằng ngày, và theo dõi hàng nhập khẩu đang trên đường về kho.

## Bài học

Tích hợp với hệ thống bên ngoài, hãy giả định mọi thứ sẽ đến trễ, đến hai lần hoặc không đến. Hàng đợi, khoá chống trùng và nhật ký thay đổi không làm hệ thống phức tạp hơn — chúng làm nó ngủ ngon hơn.
