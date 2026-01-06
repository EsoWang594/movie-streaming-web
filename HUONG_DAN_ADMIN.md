# Hướng dẫn sử dụng Admin Panel

## Tài khoản Admin

### Tạo tài khoản Admin

**Cách 1: Dùng script (khuyến nghị)**
```bash
cd backend
node scripts/createAdmin.js <username> <password>
```

Ví dụ:
```bash
node scripts/createAdmin.js admin admin123
```

**Cách 2: Đăng ký tài khoản thường rồi nâng cấp lên admin**
```bash
# 1. Đăng ký tài khoản qua web
# 2. Nâng cấp lên admin:
node scripts/updateUserRole.js <username> admin
```

### Tài khoản Admin mặc định

Sau khi chạy script `createAdmin.js`, bạn sẽ có:
- **Username**: `admin`
- **Password**: `admin123`
- **Role**: `admin`

⚠️ **LƯU Ý**: Hãy đổi mật khẩu sau khi đăng nhập!

## Đăng nhập Admin

1. Mở trình duyệt: `http://localhost:5000`
2. Click "Đăng nhập" hoặc truy cập: `http://localhost:5000/login.html`
3. Nhập:
   - Username: `admin`
   - Password: `admin123`
4. Sau khi đăng nhập, bạn sẽ thấy link "Admin" trong menu

## Các chức năng Admin

### 1. Thêm phim mới

**Bước:**
1. Vào trang Admin (`admin.html`)
2. Điền form "Thêm phim mới":
   - **Tên phim**: Tên của phim
   - **URL poster**: Link ảnh poster (ví dụ: `https://example.com/poster.jpg`)
   - **URL video**: Link video (ví dụ: `https://example.com/video.mp4`)
   - **Mô tả phim**: Mô tả về phim
   - **Thể loại**: Thể loại phim (ví dụ: Hành động, Kinh dị, Hài, v.v.)
   - **Năm sản xuất**: Năm phim được sản xuất
3. Click "Thêm phim"

**Test:**
- Thêm một phim mới với đầy đủ thông tin
- Kiểm tra phim xuất hiện trong danh sách phim ở trang chủ
- Click vào phim để xem chi tiết

### 2. Xem danh sách phim

**Bước:**
1. Vào trang Admin
2. Xem danh sách phim ở phần "Danh sách phim"
3. Mỗi phim hiển thị:
   - Tên phim
   - Trạng thái video (✅ có video / ❌ chưa có video)
   - URL video (preview)

**Test:**
- Kiểm tra tất cả phim đều hiển thị
- Kiểm tra trạng thái video đúng

### 3. Sửa Video URL

**Bước:**
1. Vào trang Admin
2. Tìm phim cần sửa trong danh sách
3. Click nút "Sửa Video"
4. Nhập URL video mới
5. Click OK

**Test:**
- Sửa video URL của một phim
- Vào trang chi tiết phim để kiểm tra video mới có phát được không

### 4. Xóa phim

**Bước:**
1. Vào trang Admin
2. Tìm phim cần xóa trong danh sách
3. Click nút "Xóa"
4. Xác nhận xóa

**Test:**
- Xóa một phim test
- Kiểm tra phim không còn xuất hiện trong danh sách
- Kiểm tra phim không còn truy cập được qua URL

## Kiểm tra quyền Admin

### Test 1: Đăng nhập với tài khoản thường
1. Đăng ký/đăng nhập với tài khoản user thường
2. Kiểm tra: **KHÔNG** thấy link "Admin" trong menu
3. Thử truy cập trực tiếp: `http://localhost:5000/admin.html`
4. Kết quả: Bị chặn hoặc hiển thị thông báo "Bạn không phải admin"

### Test 2: Đăng nhập với tài khoản admin
1. Đăng nhập với tài khoản admin
2. Kiểm tra: **CÓ** thấy link "Admin" trong menu
3. Click vào link "Admin"
4. Kết quả: Vào được trang Admin và thấy đầy đủ chức năng

### Test 3: Thêm phim (chỉ admin)
1. Đăng nhập với tài khoản admin
2. Vào trang Admin
3. Thử thêm phim mới
4. Kết quả: Thêm thành công

### Test 4: Xóa phim (chỉ admin)
1. Đăng nhập với tài khoản admin
2. Vào trang Admin
3. Thử xóa một phim
4. Kết quả: Xóa thành công

## Scripts hữu ích

### Xem danh sách tất cả users
```bash
cd backend
node scripts/listUsers.js
```

### Tạo tài khoản admin mới
```bash
cd backend
node scripts/createAdmin.js <username> <password>
```

### Cập nhật role của user
```bash
cd backend
node scripts/updateUserRole.js <username> <role>
# role: admin hoặc user
```

### Xóa tất cả users (cẩn thận!)
```bash
cd backend
node scripts/clearUsers.js
```

## Checklist test Admin

- [ ] Đăng nhập với tài khoản admin thành công
- [ ] Thấy link "Admin" trong menu sau khi đăng nhập
- [ ] Vào được trang Admin
- [ ] Thêm phim mới thành công
- [ ] Phim mới xuất hiện ở trang chủ
- [ ] Sửa video URL thành công
- [ ] Video mới phát được
- [ ] Xóa phim thành công
- [ ] Phim đã xóa không còn trong danh sách
- [ ] Tài khoản user thường không thấy link Admin
- [ ] Tài khoản user thường không thể truy cập Admin

## Xử lý lỗi

### Không thấy link "Admin"
- Kiểm tra đã đăng nhập chưa
- Kiểm tra tài khoản có role "admin" không (dùng `listUsers.js`)
- Refresh trang (Ctrl+F5)

### Không thể thêm phim
- Kiểm tra đã đăng nhập với tài khoản admin chưa
- Kiểm tra form đã điền đầy đủ chưa
- Kiểm tra console (F12) để xem lỗi

### Không thể xóa phim
- Kiểm tra đã đăng nhập với tài khoản admin chưa
- Kiểm tra phim có tồn tại không
- Kiểm tra console (F12) để xem lỗi
