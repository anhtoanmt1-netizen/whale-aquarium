# whale-aquarium (Cá Voi Nhỏ) — phiên bản 14

Game nuôi cá kawaii kiểu Insaniquarium, chạy trên trình duyệt / PWA.

## Cách làm việc với mã nguồn
1. Giải nén `src.zip` ra thư mục gốc dự án (sẽ có `src/` và `tools/`).
2. Sửa trong `src/` (HTML: `src/index.src.html`, CSS: `src/css/style.css`, JS: `src/js/*.js`).
3. Chạy `python3 tools/build.py` để gộp thành `index.html` tự chạy.
4. Tăng số trong `sw.js` (`CACHE = 'whale-vNN'`) mỗi lần phát hành.

> Các file lẻ `index.src.html`, `style.css`, `main.js` ở thư mục gốc là bản cũ, **không** dùng khi build.

## Mới ở phiên bản 14
- 🔍 Tầm nhìn Gần / Rộng / Siêu rộng (nút 🔎 trên thanh trên, hoặc ⚙️ → Hiển thị).
- 🐠 Cá tụ đàn, lo lắng và hoảng sợ khi có quái vật (`src/js/flock.js`).
- 🦀 Cua có level 1–5, tên, tuổi, máu, kỹ năng lướt / bắn tim, danh sách, bán, mua thêm chỗ tới 50 (`crab.js`, `crab-ui.js`).
- 💬 Chiến binh, Support, Cua biết trò chuyện và đối đáp với nhau và với cá (`chat-crew.js`).
