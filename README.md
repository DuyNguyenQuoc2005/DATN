# BBQ QuocDuy

Dự án gồm `server` (Node.js, Express, MongoDB) và `client` (React, TypeScript, Vite).

## Chuẩn bị

Cài Node.js, npm và MongoDB. Tạo cơ sở dữ liệu MongoDB cục bộ hoặc dùng MongoDB Atlas.

## Chạy backend

1. Mở terminal trong `server`.
2. Sao chép `.env.example` thành `.env` và chỉnh `MONGODB_URI`, `CLIENT_ORIGIN` nếu cần.
3. Chạy `npm install` rồi `npm run dev`.
4. Kiểm tra `http://localhost:5000/api/health`.

Backend chỉ khởi động khi kết nối MongoDB thành công.

## Chạy frontend

1. Mở terminal khác trong `client`.
2. Sao chép `.env.example` thành `.env` và chỉnh `VITE_API_BASE_URL` nếu cần.
3. Chạy `npm install` rồi `npm run dev`.
4. Mở địa chỉ Vite hiển thị trong terminal.

## Trạng thái

Đây là bộ khung khởi tạo. Chưa có nghiệp vụ gọi món, tài khoản, phân quyền, màn hình bếp, thanh toán VNPAY hoặc thống kê. Socket.IO đã khởi tạo nhưng chưa có sự kiện nghiệp vụ.
