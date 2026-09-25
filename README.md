# 🛠️ Dev Toolkit

> **Bộ công cụ trực tuyến tất-cả-trong-một dành cho Lập trình viên.**  
> 100% Client-Side • Bảo mật tuyệt đối • Giao diện hiện đại • Hỗ trợ Dark Mode.

Dev Toolkit là tập hợp hơn 20 công cụ tiện ích thiết yếu phục vụ công việc lập trình hàng ngày (format JSON, decode JWT, regex tester, cron explainer, diff checker, curl/API tester,...). Toàn bộ xử lý diễn ra **trực tiếp trên trình duyệt của bạn**, không gửi bất kỳ dữ liệu nhạy cảm nào ra máy chủ bên ngoài. Mọi cài đặt (giao diện, yêu thích, lịch sử API) được lưu an toàn trong `localStorage`.

---

## ✨ Tính năng nổi bật

### 🔒 1. Bảo mật & Riêng tư (Privacy-First)
* **100% In-Browser:** Không cần đăng ký, không có backend theo dõi, không lưu log trên server. Dữ liệu token, mật khẩu, payload bí mật của dự án không bao giờ rời khỏi máy tính của bạn.
* **Offline-Ready:** Ứng dụng chạy mượt mà ngay cả khi không có kết nối internet.

### 🎨 2. Trải nghiệm người dùng tối ưu
* **Light / Dark Mode:** Tự động theo hệ thống hoặc tùy chỉnh thủ công.
* **Favorites & Recent Tools:** Ghim các công cụ hay dùng lên đầu để truy cập tức thì.
* **Tìm kiếm nhanh:** Lọc công cụ theo từ khóa thông minh ngay trên thanh tìm kiếm.
* **Tốc độ cực nhanh:** Sử dụng React 19 + Vite + Tailwind CSS v4, tối ưu chia nhỏ gói tải (Code Splitting qua `lazy import`).

---

## 🧰 Danh sách 21 công cụ có sẵn

### 📋 Nhóm 1: Không gian làm việc (Workspace)
| Công cụ | Mô tả tính năng |
| :--- | :--- |
| **Notes & Todo** | Sổ tay ghi chú nhanh và danh sách việc cần làm (Todo list), hỗ trợ định dạng Markdown, lưu lịch sử sửa đổi và tự động lưu. |

### ⚡ Nhóm 2: Tiện ích lập trình (Dev Utilities)
| Công cụ | Mô tả tính năng |
| :--- | :--- |
| **JSON Formatter** | Làm đẹp (Pretty-print), nén gọn (Minify) và kiểm tra tính hợp lệ của JSON với thông báo lỗi chi tiết dòng & cột. |
| **Base64 Encode/Decode** | Mã hóa và giải mã văn bản sang Base64 và ngược lại. |
| **URL Encode/Decode** | Mã hóa và giải mã URL parameters, query strings an toàn. |
| **JWT Decoder** | Giải mã cấu trúc JSON Web Token (Header, Payload, Claims, Expiration) mà không cần khóa bí mật. |
| **Regex Tester** | So khớp biểu thức chính quy (Regular Expressions) theo thời gian thực, tô sáng kết quả và nhóm bóc tách (Capture Groups). |
| **UUID & Hash Generator** | Tạo mã UUID v4 và tính toán các mã băm phổ biến (MD5, SHA-1, SHA-256, SHA-512). |
| **Diff Checker** | So sánh sự khác biệt giữa hai đoạn mã/văn bản (Text Diff) trực quan theo từng dòng hoặc từng ký tự. |
| **Timestamp Converter** | Chuyển đổi qua lại giữa Unix Timestamp (giây / mili-giây) và thời gian thực (ISO, UTC, Local time). |
| **Mobile Terminal Commands** | Tra cứu lệnh terminal để chạy, build, debug app **React Native**, **Flutter**, **Android** (adb, gradle, emulator) và **iOS** (simctl, xcodebuild, CocoaPods, fastlane). Nhập tham số (package name, device, flavor...) một lần, lệnh tự điền và copy nhanh. |

### 🔄 Nhóm 3: Chuyển đổi Dữ liệu & Văn bản (Converters)
| Công cụ | Mô tả tính năng |
| :--- | :--- |
| **CSV ↔ JSON** | Chuyển đổi 2 chiều giữa dữ liệu bảng tính CSV và mảng dữ liệu JSON. |
| **YAML ↔ JSON** | Chuyển đổi qua lại giữa định dạng cấu hình YAML và JSON. |
| **Markdown Preview** | Trình soạn thảo và xem trước Markdown trực tiếp, hỗ trợ bảng biểu GFM, task list và code block. |
| **Case Converter** | Chuyển đổi quy tắc đặt tên chuỗi: `camelCase`, `PascalCase`, `snake_case`, `kebab-case`, `CONSTANT_CASE`, `Title Case`,... |
| **Lorem Ipsum Generator** | Tạo văn bản mẫu ngẫu nhiên (theo số từ, số câu hoặc số đoạn văn) cho mockup giao diện. |
| **Color Converter** | Chuyển đổi mã màu giữa HEX, RGB, HSL, HSV và sinh mã nguồn màu cho **iOS** (UIKit/SwiftUI) & **Android** (Compose/XML). |
| **Cron Expression Parser** | Giải thích biểu thức Cronjob thành câu văn tiếng Anh dễ hiểu và hiển thị lịch các lần chạy dự kiến tiếp theo. |

### 🌐 Nhóm 4: Mạng & Kiểm thử API (Network Tools)
| Công cụ | Mô tả tính năng |
| :--- | :--- |
| **HTTP Status Codes** | Tra cứu nhanh ý nghĩa, nguyên nhân và cách xử lý toàn bộ mã trạng thái HTTP (2xx, 3xx, 4xx, 5xx). |
| **cURL Generator / Parser** | Sinh câu lệnh `curl` từ tham số nhập vào, hoặc phân tích câu lệnh `curl` có sẵn thành Method, Headers, URL và Body. |
| **API Tester** | Trình gửi yêu cầu HTTP (GET, POST, PUT, DELETE...) gọn nhẹ trực tiếp trên trình duyệt, hỗ trợ CORS Proxy và lưu lịch sử. |
| **Webhook Inspector** | Phân tích cấu trúc payload Webhook (raw HTTP, curl hoặc JSON) và hỗ trợ gửi lại (Replay request) đến endpoint mong muốn. |

---

## 🚀 Công nghệ sử dụng (Tech Stack)

* **Core:** [React 19](https://react.dev/), [TypeScript](https://www.typescriptlang.org/)
* **Bundler & Build Tool:** [Vite 8](https://vite.dev/)
* **Styling:** [Tailwind CSS v4](https://tailwindcss.com/)
* **Routing:** [React Router 7](https://reactrouter.com/) (Data Browser Router)
* **Icons:** [Lucide React](https://lucide.dev/)
* **Testing:** [Vitest](https://vitest.dev/) (Bộ test bao phủ 21 test suites, 149 unit tests)
* **Linter:** [Oxlint](https://oxc.rs/) siêu tốc

---

## 💻 Cài đặt & Chạy cục bộ (Local Development)

Yêu cầu môi trường: **Node.js 20+**

```bash
# 1. Cài đặt các thư viện phụ thuộc
npm install

# 2. Khởi động máy chủ dev (mặc định tại http://localhost:5173)
npm run dev

# 3. Chạy kiểm thử tự động (Unit Tests)
npm run test

# 4. Kiểm tra lỗi mã nguồn (Linting)
npm run lint

# 5. Đóng gói cho Production
npm run build

# 6. Xem thử bản đóng gói production trên máy
npm run preview
```

---

## 🌐 Triển khai lên Production (Deploy)

Dự án đã được cấu hình sẵn file [`vercel.json`](./vercel.json) và [`public/_redirects`](./public/_redirects) để xử lý việc chuyển trang SPA mượt mà (tránh lỗi 404 khi tải lại trang).

### Triển khai miễn phí qua Vercel (Khuyên dùng)
1. Đẩy mã nguồn lên một repository trên **GitHub**.
2. Đăng nhập vào [vercel.com](https://vercel.com) bằng tài khoản GitHub.
3. Chọn **Add New...** -> **Project** -> Chọn repository của bạn.
4. Bấm **Deploy**. Vercel sẽ tự động build và cung cấp cho bạn một domain HTTPS miễn phí dạng: `https://ten-du-an.vercel.app`.

---

## 🤝 Hướng dẫn thêm một công cụ mới

Dự án được thiết kế theo kiến trúc module hóa rất dễ mở rộng:

1. **Thêm logic xử lý:** Tạo thư mục `src/lib/<ten-cong-cu>/<ten-cong-cu>.ts` kèm file unit test `<ten-cong-cu>.test.ts`.
2. **Tạo giao diện:** Tạo component React trong `src/tools/<ten-cong-cu>/<TenTool>.tsx` (sử dụng các component dùng chung trong `src/components/` như `Panel`, `TextAreaField`, `CopyButton`,...).
3. **Đăng ký công cụ:** Thêm 1 object định nghĩa vào mảng `TOOLS` trong [`src/tools/registry.ts`](./src/tools/registry.ts).  
   *Sidebar, danh sách tìm kiếm, trang chủ và router sẽ tự động cập nhật mà không cần cấu hình thêm.*

---

## 📄 Bản quyền (License)

Dự án được phân phối dưới giấy phép mã nguồn mở **MIT License**.
