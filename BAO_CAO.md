# Báo cáo nâng cấp — Cá Voi Nhỏ phiên bản 15

## 1. Đã làm được
| Hạng mục | Trạng thái |
|---|---|
| Menu chính (5 mục) với cảnh đại dương sống động, chuyển cảnh, nút tương tác | Hoàn thành, đã kiểm thử |
| Hải Vực Chinh Phục: bản đồ 60 ải (6 vùng × 10 ải, đúng 3 ô/hàng × 20 hàng, cuộn được) | Hoàn thành, đã kiểm thử |
| Mở khóa tuần tự, chơi lại, giữ kỷ lục, chấm 1–3 sao theo ngưỡng riêng từng ải | Hoàn thành, đã kiểm thử |
| 20 Boss (20 hình vẽ riêng) + 13 kỹ năng + giai đoạn + nhiều Boss cùng lúc (tối đa 5) | Hoàn thành, đã kiểm thử |
| Nhiệm vụ vàng + nút Xác Nhận Trả Nhiệm Vụ (không tự trừ vàng) | Hoàn thành, đã kiểm thử |
| Sát thương chạm 8 cấp (nâng bằng 🐚 Ngọc trai), hiệu ứng riêng từng cấp | Hoàn thành, đã kiểm thử |
| Lưu dữ liệu, migration, kiểm tra dữ liệu hỏng, không mất dữ liệu cũ | Hoàn thành, đã kiểm thử |
| Sinh Tồn: thông báo "đang phát triển" | Theo đúng yêu cầu (chưa có chế độ chơi) |

## 2. Thiết kế đồng bộ dữ liệu và kinh tế
* **Vàng tách biệt**: mỗi ải là một hồ mới với ví vàng và đội hình khởi đầu riêng (hàm `startPack`). Không thể cày vàng ở Thủy Cung Bình Yên để mang sang chế độ chinh phục, và ngược lại.
* **Phần dùng chung duy nhất** là 🐚 Ngọc trai (chỉ kiếm được trong Hải Vực Chinh Phục: lần đầu hoàn thành ải + mỗi sao mới đạt; chơi lại không đạt thêm sao thì không nhận) và cấp sát thương chạm.
* Khi vào ải, dữ liệu Thủy Cung được chụp lại trong bộ nhớ và **không bị ghi đè**: lúc ở trong ải, mọi lần lưu tự động chỉ ghi dữ liệu Thủy Cung gốc + tiến trình chiến dịch. Khi thoát ải dữ liệu được khôi phục nguyên vẹn.
* Khóa lưu: `whale1` (Thủy Cung, giữ nguyên định dạng cũ) và `whale_camp` (chiến dịch, có số phiên bản `v` để migration về sau).
* Tiến trình đang chơi dở trong một ải **không được lưu** (rời ải/tải lại trang thì chơi lại ải đó); thành tích và dữ liệu Thủy Cung vẫn an toàn.

## 3. Danh sách file
**Mới** (`src/js/`): `camp-data.js` (6 vùng, 20 Boss, 60 ải, bảng vàng, ngưỡng sao), `boss-art.js` (20 hình vẽ Boss), `boss.js` (AI, kỹ năng, giai đoạn, hiệu ứng, âm thanh, chạm tay), `camp.js` (tiến trình, lưu, phiên ải, trả vàng, chấm sao), `camp-ui.js` (bản đồ ải, thông tin ải, nâng cấp chạm, HUD, tổng kết), `menu.js` (Menu và chuyển chế độ).
**Sửa**: `core.js` (MODE, `loadWorld`, lưu theo chế độ), `update.js`, `combat.js` (kẻ địch chung, `tapFoes`), `input.js`, `render.js`, `shop.js`, `crab.js`, `flock.js`, `chat.js`, `chat-crew.js`, `main.js`, `index.src.html`, `style.css`.
**Khác**: `index.html` (đã build), `src.zip` (mã nguồn), `sw.js` (cache v16), `.github/workflows/android.yml`, `README.md`, thư mục `tests/`.

## 4. Kết quả kiểm thử (Chromium headless, Playwright)
| Câu hỏi | Kết quả |
|---|---|
| Menu hoạt động? | Có (dọc và ngang). Nút, chuyển cảnh, hộp thoại Sinh Tồn đúng nội dung |
| Chuyển chế độ có lỗi không? | Không. Vào/ra ải 6 lần: dữ liệu Thủy Cung giống hệt, không nhân bản đối tượng |
| 60 ải mở khóa đúng thứ tự? | Có: lúc đầu chỉ ải 1 mở; ải khóa bấm vào báo lỗi; hoàn thành ải n mới mở ải n+1 |
| Chơi lại ải cũ, giữ thành tích? | Có. Chơi lại tệ hơn: sao/thời gian/điểm giữ nguyên, không nhận thêm Ngọc trai |
| Chấm sao chính xác? | Có: điểm 5 thành phần (thời gian 30, sống sót 25, ít bị tấn công 20, hiệu quả 15, mục tiêu phụ 10) |
| 20 Boss hoạt động đúng? | Có: mỗi Boss chiến đấu mô phỏng 90 giây, không lỗi, đủ kỹ năng, lên đủ giai đoạn |
| Kỹ năng gây sát thương/hiệu ứng đúng? | Có: 13/13 loại kỹ năng đã kích hoạt (kể cả hút máu kiểm riêng); hồi máu, khiên, choáng, hố đen, tia, thiên thạch, độc, bắn gai, phân thân, triệu hồi, lao tới |
| Nhiều Boss cùng lúc? | Có: 5 Boss, ở nhiều hướng, không ra ngoài khu vực, khoảng cách tối thiểu ≈ 0,97 tổng bán kính |
| Nút trả vàng chính xác? | Có: không tự trừ; hủy thì không mất; xác nhận mới trừ đúng số; hạ Boss trước khi trả chưa tính hoàn thành |
| Chạm hoạt động ở điện thoại và máy tính? | Có: chuột thật và sự kiện cảm ứng; đúng ở mọi mức thu phóng (1×, 1,5×, 2,25×). Chưa thử trên máy thật |
| Lưu sau khi tải lại? | Có. Dữ liệu cũ thiếu trường, dữ liệu hỏng, JSON lỗi đều được làm sạch về giá trị mặc định |
| Tính năng cũ còn chạy? | Có: quái thường, cá tụ đàn, Cua (lướt, bắn tim), trò chuyện, thu phóng, lưu/nạp |
| Hiệu năng | Cảnh nặng nhất (5 Boss + 40 cá + 33 Chiến Binh…): ≈ 3,9 ms/khung (phần mềm, không GPU) |

## 5. Cân bằng độ khó (đo bằng mô phỏng)
Bot chơi tự động (nuôi cá, vuốt ve, mua quân, nâng cấp, chạm Boss, trả vàng) trên 15 ải mẫu từ ải 1 đến 60. **Cả 15 ải đều được bot vượt qua**. Số đo được dùng làm mốc để tính ngưỡng thời gian, số lần bị tấn công, số đơn vị mất và thời gian hạ Boss cho **từng ải** (nội suy giữa các mốc, điều chỉnh theo tổng máu Boss, số đợt, số Boss đồng thời).
Ví dụ thời gian hoàn thành của bot: ải 1 ≈ 6 phút, ải 20 ≈ 12,5 phút, ải 60 ≈ 13 phút. Bot chơi gần tối ưu nên nhận 3 sao ở ải 1/10/30 và 2 sao ở ải 50. Người chơi thật thường chậm hơn và sẽ nhận 1–2 sao.
**Những gì đo cho thấy và đã sửa**: Boss ban đầu quá bền/quá đau so với kinh tế thật (đã giảm máu, sát thương theo vùng, kéo dài chuẩn bị và nghỉ giữa các đợt); hồi máu + khiên của Boss từng tạo thế bế tắc (đã giảm); cá tụ đàn làm đòn phạm vi đánh trúng nhiều cá (cá chịu 50% sát thương phạm vi).

## 6. Hạn chế — cần nói thẳng
* **Bot không phải người.** Ngưỡng sao và độ khó được kiểm chứng bằng bot; cảm giác thực tế (đặc biệt ải 45–60) cần người chơi thử và có thể phải chỉnh. Ải 60 (Hải Vương) bot thắng 3/4 lần, tức là khó và còn may rủi.
* **Chưa thử trên thiết bị thật** (điện thoại, trình duyệt khác). Chỉ kiểm thử bằng Chromium headless.
* **Hoạt ảnh Boss**: hình vẽ bằng code (không phải ảnh vẽ tay). Mỗi Boss có hoạt ảnh bơi/chuyển động riêng, hiệu ứng trúng đòn và nổ khi chết; một số Boss có hoạt ảnh riêng khi tung kỹ năng (mập, lươn điện, lồng đèn, hải mã, mắt thần, rồng). Các Boss còn lại dùng vòng cảnh báo chung theo kỹ năng, **không** có khung hoạt ảnh tấn công riêng cho từng Boss.
* **Âm thanh**: tổng hợp bằng WebAudio (không có tệp thu âm). Mỗi Boss có "giọng gầm" riêng (cao độ) khi xuất hiện; kỹ năng, tích tụ, hồi máu, choáng, hố đen, triệu hồi, khiên, cuồng nộ, tiêu diệt đều có âm riêng nhưng **dùng chung giữa các Boss**, chưa có âm riêng cho từng cặp Boss–kỹ năng.
* Sát thương chạm có 8 cấp (không phải 5). Con số "Boss gây sát thương" ở các ải sau lên tới hàng trăm vì đếm từng lần trúng.
* Đã giảm sát thương và máu Boss rất nhiều so với dự định ban đầu để cân bằng với máu đơn vị (Chiến Binh chỉ 50–104 máu).
* Tiến trình ải dở dang không lưu (xem mục 2). Chế độ Sinh Tồn chưa có.
* Quy trình build APK (GitHub Actions) chưa được xác nhận lại sau lần sửa trước.

## 7. Nút chỉnh cân bằng
`camp-data.js`: `BD` (máu, sát thương, kỹ năng từng Boss), `WAVES` (các đợt), `GA` (vàng), `startPack` (đội hình đầu ải), `PAR` (số đo chuẩn của bot), `TD` (sát thương chạm). `boss.js`: `DMGK` và `DMGZ` (hệ số sát thương lên đơn vị theo vùng).
Chạy lại bot: `python3 -m http.server 8765` ở thư mục dự án rồi `python3 tests/balance_bot.py 1,30,60` (cần `pip install playwright`).
