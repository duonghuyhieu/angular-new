# Angular Core Deep Dive — Tóm tắt tiếng Việt

Trang web tóm tắt khoá học **Angular Core Deep Dive** sang tiếng Việt — đọc nhanh, hiểu sâu, kèm nhiều ví dụ code thực tế.

## Nội dung

- **19 chương / 110 bài** từ cú pháp control-flow Angular 17, Signals, @defer, đến DI, Change Detection, Lifecycle Hooks.
- Mỗi bài có cấu trúc: ngữ cảnh → khái niệm cốt lõi → 3-5 ví dụ code → "dưới mui xe" → bẫy thường gặp → tóm tắt cần nhớ.
- Bảng so sánh ở các điểm dễ nhầm (`@for` vs `*ngFor`, OnPush vs Default, Signal vs Observable…).

## Cách dùng

Mở file `index.html` bằng trình duyệt — không cần build, không cần server.

```bash
# Windows
start index.html
# macOS
open index.html
# Linux
xdg-open index.html
```

## Tính năng

- Sidebar điều hướng theo chương/bài, có thể gập từng chương.
- Ô tìm kiếm bài học (phím `/`).
- Đánh dấu "đã đọc" cho từng bài, lưu trong `localStorage`.
- Thanh tiến độ tổng thể.
- Phím tắt `M` để đánh dấu bài đang xem.
- Responsive — hoạt động tốt trên mobile.

## Cấu trúc

```
summary-site/
├── index.html      # trang chính + JS điều hướng
├── styles.css      # phong cách (Be Vietnam Pro + JetBrains Mono)
└── data.js         # toàn bộ nội dung tóm tắt (19 chương, 110 bài)
```

## Font

- **Be Vietnam Pro** (Google Fonts) cho text — hỗ trợ đầy đủ dấu tiếng Việt.
- **JetBrains Mono** cho code.
