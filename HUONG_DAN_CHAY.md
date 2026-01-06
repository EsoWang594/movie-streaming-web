# Hướng dẫn chạy đồ án Movie Streaming

## Yêu cầu hệ thống

1. **Node.js** (phiên bản 14 trở lên)
2. **MongoDB** (cài đặt và chạy local hoặc sử dụng MongoDB Atlas)

## Các bước chạy

### 1. Cài đặt MongoDB

Nếu chưa có MongoDB, bạn có thể:
- **Cài đặt MongoDB Community Edition** từ https://www.mongodb.com/try/download/community
- Hoặc sử dụng **MongoDB Atlas** (cloud) và cập nhật `MONGO_URI` trong file `.env`

### 2. Khởi động MongoDB (nếu dùng local)

```bash
# Windows (nếu đã cài MongoDB như service, nó sẽ tự động chạy)
# Hoặc chạy thủ công:
mongod
```

### 3. Cài đặt dependencies

```bash
cd backend
npm install
```

### 4. Cấu hình môi trường

File `.env` đã được tạo tự động trong thư mục `backend/` với nội dung:
```
MONGO_URI=mongodb://localhost:27017/movie-streaming
JWT_SECRET=your-secret-key-change-this-in-production
PORT=5000
FRONTEND_URL=http://localhost:5000
```

Nếu dùng MongoDB Atlas, cập nhật `MONGO_URI` với connection string của bạn.

### 5. Chạy server

```bash
cd backend
npm start
```

Hoặc:
```bash
cd backend
node server.js
```

Server sẽ chạy tại: **http://localhost:5000**

### 6. Truy cập ứng dụng

Mở trình duyệt và truy cập: **http://localhost:5000**

## Các tính năng

- ✅ Xem danh sách phim
- ✅ Xem chi tiết phim và video
- ✅ Đăng ký / Đăng nhập
- ✅ Bình luận và đánh giá phim
- ✅ Admin panel (thêm/xóa phim) - cần đăng nhập với tài khoản admin

## Tạo tài khoản Admin

Để tạo tài khoản admin, bạn có thể:
1. Đăng ký tài khoản bình thường
2. Vào MongoDB và cập nhật role của user thành "admin":
```javascript
db.users.updateOne({username: "your-username"}, {$set: {role: "admin"}})
```

Hoặc tạo script để tự động tạo admin user.

## Xử lý lỗi thường gặp

### Lỗi: "MongoDB connection error"
- Kiểm tra MongoDB đã chạy chưa
- Kiểm tra `MONGO_URI` trong file `.env` có đúng không
- Kiểm tra firewall có chặn port 27017 không

### Lỗi: "Cannot find module"
- Chạy lại `npm install` trong thư mục `backend`

### Lỗi: "Port 5000 already in use"
- Đổi `PORT` trong file `.env` sang port khác (ví dụ: 5001)
- Hoặc tắt ứng dụng đang dùng port 5000

## Cấu trúc thư mục

```
Movie/
├── backend/          # Backend API (Node.js + Express + MongoDB)
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── scripts/
│   ├── server.js
│   └── .env
└── frontend/         # Frontend (HTML + CSS + JavaScript)
    ├── js/
    │   └── main.js
    ├── index.html
    ├── login.html
    ├── movie.html
    ├── admin.html
    └── style.css
```
