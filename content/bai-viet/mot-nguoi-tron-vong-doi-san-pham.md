---
title: Một người, trọn vòng đời sản phẩm
summary: Vì sao tôi chọn tự đi từ ý tưởng, thiết kế, viết code đến vận hành — và bốn thói quen giúp một người làm được việc đó mà không rối.
date: 2026-11-13
category: ve-toi
tags: [Cách làm, Product]
---

Phần lớn những gì có trên trang này bắt đầu giống nhau: một việc đang làm thủ công, chậm, dễ sai — và không ai có thời gian ngồi sửa nó. Tôi không đợi có người giao. Tôi ngồi xem việc đó diễn ra, vẽ thử một cách làm khác, làm bản đầu tiên rồi đưa cho chính những người đang làm việc đó dùng thử.

Đó là lý do tôi tự gọi mình là *product engineer* chứ không chỉ là lập trình viên: tôi chịu trách nhiệm cho cả vòng đời — từ lúc một vấn đề được nhìn ra đến lúc hệ thống chạy ổn mỗi ngày.

## Bắt đầu từ việc thật

Ý tưởng tốt nhất của tôi chưa bao giờ đến từ một buổi họp. Nó đến từ việc ngồi cạnh người dùng: xem họ chép số từ màn hình này sang bảng tính kia, xem họ mở năm tab để trả lời một câu hỏi của khách. Mỗi chỗ họ thở dài là một chỗ đáng làm.

Ví dụ, hệ thống tồn kho đa sàn ra đời vì số tồn trên các sàn thương mại điện tử luôn lệch so với kho thật. Hệ sinh thái bảo hành ra đời vì khách muốn tự tra cứu bảo hành trên điện thoại thay vì gọi điện chờ.

## Vẽ trước, code sau

Tôi tự thiết kế giao diện và luồng thao tác trước khi viết dòng code đầu tiên. Một bản mẫu bấm được — dù thô — trả lời nhanh hơn mọi tài liệu mô tả: người dùng chỉ vào chỗ họ bối rối, và tôi sửa ngay trên bản vẽ, khi việc sửa còn rẻ.

Thiết kế không dừng ở màu sắc. Với Văn Phòng AI, tôi dựng cả một không gian 3D vì muốn việc "giao việc cho AI" có cảm giác quen thuộc như giao việc cho một đồng nghiệp ngồi bàn bên.

## Ra bản dùng được sớm

Tôi làm theo vòng ngắn: mỗi vòng phải có một bản chạy thật cho người dùng thử và góp ý. Một tính năng nằm trên máy tôi ba tháng không có giá trị bằng một tính năng nhỏ được dùng thật từ tuần đầu.

Điều này cũng buộc tôi đầu tư sớm vào việc phát hành: build tự động cho Windows, macOS và Linux, cập nhật tự đẩy xuống máy người dùng. Khi phát hành rẻ, tôi dám phát hành thường xuyên.

## Theo đến khi dùng ổn

Sản phẩm chỉ thật sự xong khi nó chạy ổn mỗi ngày mà không cần tôi đứng cạnh. Vì vậy tôi tự đóng gói bằng Docker, tự triển khai máy chủ, tự theo dõi lỗi và nhìn số liệu sử dụng để quyết định cải tiến tiếp theo.

## Một người làm hết thì có rủi ro gì?

Có. Rủi ro lớn nhất là mọi thứ nằm trong đầu một người. Tôi bù lại bằng ba việc: viết tài liệu ngay trong repo, giữ cấu trúc dự án đơn giản và giống nhau giữa các hệ thống, và tự động hoá mọi bước lặp lại — từ build, kiểm thử đến triển khai.

Rủi ro thứ hai là ôm quá nhiều việc. Câu hỏi tôi tự hỏi mỗi tuần: *việc nào chỉ mình làm được, việc nào nên để máy làm?* Phần lớn các hệ thống trên trang này, suy cho cùng, là câu trả lời cho câu hỏi đó.
