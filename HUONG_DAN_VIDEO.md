# Hướng dẫn quản lý Video URL cho từng phim

## Vấn đề
Mỗi phim cần có video URL riêng để hiển thị đúng video khi người dùng xem phim.

## Giải pháp

### 1. Kiểm tra phim nào chưa có video URL

Chạy script để xem danh sách tất cả phim và video URL của chúng:

```bash
cd backend
node scripts/listMoviesWithVideos.js
```

Script này sẽ hiển thị:
- Danh sách tất cả phim
- ID của mỗi phim
- Video URL hiện tại (hoặc "CHƯA CÓ")
- Danh sách phim chưa có video URL

### 2. Cập nhật video URL cho phim

#### Cách 1: Dùng script (nhanh)

```bash
cd backend
node scripts/updateMovieVideo.js <movieId> <videoUrl>
```

Ví dụ:
```bash
# Cập nhật theo ID
node scripts/updateMovieVideo.js 507f1f77bcf86cd799439011 https://example.com/video.mp4

# Hoặc cập nhật theo tên phim
node scripts/updateMovieVideo.js "Avatar: Lửa và Tro Tàn" https://example.com/video.mp4
```

#### Cách 2: Dùng Admin Panel (dễ dàng)

1. Đăng nhập với tài khoản admin
2. Vào trang Admin (`admin.html`)
3. Trong danh sách phim, bạn sẽ thấy:
   - ✅ = Phim đã có video URL
   - ❌ = Phim chưa có video URL
4. Click nút "Sửa Video" bên cạnh phim cần cập nhật
5. Nhập URL video mới và nhấn OK

### 3. Thêm phim mới với video URL

Khi thêm phim mới qua Admin Panel:
1. Điền đầy đủ thông tin
2. **Quan trọng**: Nhập URL video vào ô "URL video"
3. Click "Thêm phim"

### 4. Nguồn video URL

Bạn có thể sử dụng:
- **Video từ internet**: URL trực tiếp đến file video (`.mp4`, `.webm`, etc.)
- **YouTube**: Sử dụng embed URL hoặc direct link
- **Vimeo**: Sử dụng embed URL
- **Video hosting services**: Upload video lên các dịch vụ như:
  - Archive.org
  - Cloudinary
  - AWS S3
  - Google Drive (cần public link)

**Ví dụ URL video:**
```
https://archive.org/download/BigBuckBunny_328/BigBuckBunny_512kb.mp4
https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4
```

### 5. Kiểm tra video có hoạt động không

Sau khi cập nhật video URL:
1. Vào trang chủ
2. Click vào phim vừa cập nhật
3. Kiểm tra xem video có phát được không
4. Nếu không phát được, kiểm tra lại URL

## Lưu ý

- Video URL phải là URL trực tiếp đến file video (không phải trang web chứa video)
- Đảm bảo video URL có thể truy cập công khai
- Một số trình duyệt có thể chặn video từ domain khác (CORS), cần đảm bảo server video cho phép CORS
- Video format được hỗ trợ: MP4, WebM, OGG

## Troubleshooting

### Video không phát được
1. Kiểm tra URL có đúng không (copy và paste vào trình duyệt)
2. Kiểm tra video có public không
3. Kiểm tra console (F12) để xem lỗi CORS
4. Thử URL video khác

### Tất cả phim đều phát cùng 1 video
- Kiểm tra xem các phim có video URL khác nhau không (dùng script listMoviesWithVideos.js)
- Đảm bảo khi thêm phim mới, bạn nhập video URL riêng cho từng phim
