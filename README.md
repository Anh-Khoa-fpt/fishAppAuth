# Metro HCMC Authentication

Ứng dụng web React với chức năng đăng nhập và đăng ký sử dụng API từ metrohcmc.xyz

## Cài đặt

1. Cài đặt dependencies:
```bash
npm install
```

2. Chạy ứng dụng ở chế độ development:
```bash
npm run dev
```

3. Build ứng dụng cho production:
```bash
npm run build
```

## Cấu trúc Project

```
src/
├── components/
│   ├── Login.jsx          # Component đăng nhập
│   ├── SignUp.jsx         # Component đăng ký
│   ├── Dashboard.jsx      # Component dashboard sau khi đăng nhập
│   ├── Auth.css           # Styles cho Login và SignUp
│   └── Dashboard.css      # Styles cho Dashboard
├── services/
│   └── api.js             # Service để gọi API
├── App.jsx                 # Component chính với routing
├── App.css                 # Styles cho App
├── main.jsx                # Entry point
└── index.css               # Global styles
```

## Tính năng

- ✅ Đăng nhập với email và mật khẩu
- ✅ Đăng nhập bằng Google OAuth
- ✅ Đăng ký tài khoản mới
- ✅ Quản lý token và session
- ✅ Bảo vệ routes (chỉ truy cập dashboard khi đã đăng nhập)
- ✅ Giao diện đẹp và responsive
- ✅ Xử lý lỗi và thông báo

## API Endpoints

Ứng dụng sử dụng các endpoint từ `https://api.metrohcmc.xyz`:

- `POST /api/auth/login` - Đăng nhập
- `POST /api/auth/google` - Đăng nhập bằng Google
- `POST /api/auth/register` - Đăng ký
- `GET /api/auth/me` - Lấy thông tin user hiện tại (có thể sử dụng)

## Cấu hình Google OAuth

1. Tạo Google OAuth Client ID:
   - Truy cập [Google Cloud Console](https://console.cloud.google.com/)
   - Tạo project mới hoặc chọn project hiện có
   - Bật Google+ API
   - Tạo OAuth 2.0 Client ID cho "Web application"
   - Thêm Authorized JavaScript origins: `http://localhost:5173` (cho dev) và domain của bạn (cho production)
   - Thêm Authorized redirect URIs: `http://localhost:5173` (cho dev) và domain của bạn (cho production)

2. Cấu hình trong project:
   - Tạo file `.env` trong thư mục gốc (copy từ `.env.example`)
   - Thêm Google Client ID vào file `.env`:
     ```
     VITE_GOOGLE_CLIENT_ID=your_google_client_id_here
     ```
   - Hoặc thay trực tiếp trong file `src/App.jsx` tại dòng `const GOOGLE_CLIENT_ID = ...`

## Lưu ý

- Token được lưu trong localStorage
- Nếu token hết hạn hoặc không hợp lệ, user sẽ tự động được chuyển về trang login
- Cần kiểm tra tài liệu Swagger tại https://api.metrohcmc.xyz/swagger/index.html để xác nhận đúng endpoint và format dữ liệu
- Đối với Google login, API backend cần nhận `token` (Google access token) và trả về token của hệ thống
- Nếu API endpoint cho Google login khác (ví dụ: `/api/auth/google/callback`), cần cập nhật trong file `src/services/api.js`

