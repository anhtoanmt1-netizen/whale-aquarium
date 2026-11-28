# Báo cáo phiên bản 16

## 1. Hoạt ảnh bơi Chiến Binh / Support
* **Biến dạng ảnh (Image Deformation)**: `src/js/deform.js`. Ảnh gốc được phủ lưới ô 10×10 px, mỗi đỉnh lưới bị dịch chuyển theo *trường biến dạng* riêng của loài; **không cắt ảnh thành mảnh**.
  * **Cá kiếm** (ảnh nhìn trái): đầu cố định, thân uốn sóng tăng dần về đuôi; vây lưng dạng buồm trôi ra sau và phập phồng trễ pha; vây ngực vỗ quanh gốc gắn thân (càng xa gốc càng vỗ mạnh); hai vây bụng đung đưa; đuôi chẻ vẫy lệch pha hai thùy.
  * **Hải mã** (dựng đứng): thân dập dờn, đuôi cuộn vung xa nhất; **vây quạt ở lưng là động cơ chính** (gợn sóng nhanh theo chiều cao vây); mào gai gợn sóng; đầu gật nhẹ ngược pha.
  * Mỗi loài có 16 pha × 2 mức (lơ lửng / bơi); các khung được dựng sẵn và dán lại → mỗi con chỉ 1 lệnh vẽ. Ảnh tùy chỉnh do người chơi tải lên dùng trường biến dạng chung (thân uốn sóng dọc theo chiều dài).
* **Tư thế & chống kẹt** (`swimPose`, `keepInside`): hướng nhìn theo chiều ngang, lật mượt (không đổi đột ngột); chúi/ngóc tối đa ±29° (±54° khi lao đâm) → không còn cắm đầu; lực đẩy mềm khỏi mép; phát hiện kẹt tường 0,7 giây thì chọn đích mới ở giữa hồ.
* **Nguyên nhân gốc lỗi ở màn ngang**: khi xoay màn hình, vị trí và đích bơi cũ (ví dụ y = 700) nằm ngoài khung mới (cao 390) nên cá đâm mãi vào mép dưới, và hướng thân lấy thẳng từ vận tốc nên chúi 90°. Đã sửa bằng co giãn mọi vị trí/đích theo tỉ lệ khung mới (`remapWorld`, dùng chung cho xoay màn hình và đổi tầm nhìn).
* **Kiểm chứng** (14 Chiến Binh + 6 Support, mô phỏng 120 giây mỗi hướng):

| | Bản cũ (v15) | Bản mới (v16) |
|---|---|---|
| Tỉ lệ thời gian chúi quá 34° | 17–85% | **0%** |
| Góc chúi lớn nhất | 90° | **28,6°** |
| Khung bị kẹt góc (dọc→ngang) | 278 | **0** |
| Khung bị kẹt mép tường | có | **0** |

Cá hề (kỹ thuật riêng) cũng được kiểm tra ở cả hai hướng: không kẹt góc, không ra ngoài khung.

## 2. Thông tin quái vật
Mục "Thông tin quái vật" có 3 thẻ: **Thủy Cung (4 loài)**, **Boss Chinh Phục (20 Boss, nhóm theo 6 vùng, mỗi Boss có hình, máu theo ải, sát thương, tốc độ, nhịp đánh, thời gian nuốt cá, lối đánh, giai đoạn, thưởng, ải xuất hiện, và từng kỹ năng kèm mô tả)**, **Quái phụ (2)** (quái con triệu hồi, phân thân). Kiểm tra tự động đối chiếu với `MON` và `BD`: **không thiếu loài nào**, mọi kỹ năng đều có mô tả.

## 3. Biểu tượng ngọc trai
Đã thay 🐚 (vỏ ốc) bằng biểu tượng ngọc trai vẽ bằng CSS (viên cầu ánh tím nhạt có điểm sáng) ở bảng nâng cấp chạm, bản đồ ải, kết quả ải, hướng dẫn và Cửa hàng. Bản build không còn ký tự 🐚.

## 4. Đổi vàng lấy ngọc trai
Trong **Cửa hàng của Thủy Cung Bình Yên**: thẻ "Ngọc trai" (5.000 vàng = 1), "Ngọc trai ×10" (50.000 vàng, có hỏi xác nhận) và "Sức mạnh chạm" (mở bảng nâng cấp). Bảng nâng cấp cũng có nút đổi nhanh. Tỉ lệ cố định; thiếu vàng thì từ chối; lưu cùng dữ liệu chiến dịch; **ẩn và không đổi được khi đang ở trong ải** (vàng của ải tách biệt). Lưu ý: sát thương chạm nâng bằng ngọc trai chỉ áp dụng khi đánh Boss trong Hải Vực Chinh Phục; chạm quái thường ở Thủy Cung giữ nguyên 5 sát thương.

## 5. Hiệu năng
**Chẩn đoán** (giả lập điện thoại: màn 390×780, DPR 2,75, CPU chậm 4×; hồ 30 cá hề + 20 Chiến Binh + 10 Support + 5 Cua):
* Nếu không vẽ gì, môi trường đạt đúng 60 FPS → **toàn bộ độ chậm do canvas vẽ**, JavaScript chỉ chiếm một phần nhỏ (~10 ms).
* Chế độ 60 FPS (DPR 2): chỉ **2,2 FPS**; chế độ tiết kiệm ~10 FPS.
* Phân rã: 30 cá hề ≈ 50% thời gian khung hình (mỗi con ~N+6 lệnh vẽ), Chiến Binh + Support ≈ 30%, cua/xu/hiệu ứng ≈ 20%; riêng 61 phần tử CSS động của nền ≈ 40% (ở chế độ cao).

**Đã làm**:
1. Thay 61 phần tử CSS động bằng **1** lớp tia sáng vẽ sẵn; đốm sáng và bong bóng nền vẽ trên canvas bằng sprite.
2. **Bộ tự điều chỉnh chất lượng** (mức 0→3): đo FPS thực, tự hạ độ phân giải canvas (×0,75/0,6/0,5), tắt tia sáng/đốm sáng, giảm chi tiết cá; tự thử tăng lại khi máy khỏe; **nhớ mức đã học cho lần mở sau**; có công tắc trong ⚙️.
3. **Cá hề nướng sẵn** khung bơi (1 lệnh vẽ/con) khi chất lượng thấp hoặc hồ có ≥25 cá.
4. Khung biến dạng Chiến Binh/Support dựng sẵn và ép tải GPU ngay trong Menu (không giật lúc vào chơi).
5. Bỏ `ctx.filter` ở Boss (rất chậm trên WebView) → chớp sáng bằng vẽ cộng sáng; ★ vẽ bằng sprite thay vì `fillText` mỗi khung.
6. Bỏ đọc layout (`offsetHeight`) mỗi khung (ResizeObserver); HUD cập nhật ~9 lần/giây thay vì mỗi khung; bỏ cấp phát mảng mỗi khung; lưu mỗi 8 giây (+ khi ẩn trang).
7. Menu: lớp vignette/cát vẽ sẵn, giảm gradient mỗi khung, giảm độ phân giải theo mức chất lượng.
8. Phông chữ tải không chặn dựng hình; Android: bật `hardwareAccelerated` tường minh.

**Kết quả đo** (cùng điều kiện, FPS giả lập — **không phải số trên máy thật**):

| Cấu hình | Cũ v15 | Mới v16 |
|---|---|---|
| Tiết kiệm, tự điều chỉnh tắt | 13,7 | 12,2 (ngang) |
| Tiết kiệm, tự điều chỉnh bật | — | **17,8** |
| Cao (60 FPS), tự điều chỉnh tắt | 3,8 | 4,0 |
| Cao (60 FPS), tự điều chỉnh bật | — | **8,2** (≈2,2×) |
| 30 cá hề, mức đầy đủ | 10,6 | **18,0** |
| 30 cá hề, mức 1 | — | 27,3 |
| 30 cá hề, mức 2 | — | **59,2** |

## 6. Hạn chế — nói thẳng
* **Chưa đo trên điện thoại thật và chưa build/cài APK để thử.** Mọi số FPS ở trên là từ trình duyệt giả lập (dựng hình bằng phần mềm, CPU chậm 4×); GPU điện thoại thật khác. Mục tiêu 60 FPS **chưa được xác nhận** trên máy thật. Nếu vẫn thấp, hãy bật ⚙️ → "Hiện FPS" (hiển thị cả mức Q), cho tôi biết đời máy và số FPS.
* Bộ tự điều chỉnh làm hình **mờ hơn** trên máy yếu (hạ độ phân giải canvas). Có thể tắt trong ⚙️.
* Cá hề nướng sẵn mất một số chi tiết riêng từng con (miệng, vây theo phản ứng); các trạng thái đặc biệt vẫn dùng bản vẽ đầy đủ.
* Khung biến dạng chiếm ~12 MB bộ nhớ ở độ phân giải cao.
* Ảnh Chiến Binh/Support do người chơi tải lên dùng biến dạng chung (không có vây riêng vì không biết cấu tạo).
* Thẻ Boss trong mục thông tin không hỗ trợ đổi hình (chỉ 4 quái Thủy Cung như trước).
