# Hướng dẫn sử dụng YouTube URL

## Vấn đề

YouTube URL (ví dụ: `https://www.youtube.com/watch?v=nb_fFj_0rq8`) không thể phát trực tiếp trong thẻ `<video>` HTML vì:
- YouTube không cho phép truy cập trực tiếp file video
- Cần sử dụng iframe với embed URL

## Giải pháp

Code đã được cập nhật để tự động:
1. **Phát hiện YouTube URL**: Tự động nhận biết URL YouTube
2. **Chuyển đổi sang embed format**: Chuyển từ `watch?v=...` sang `embed/...`
3. **Hiển thị bằng iframe**: Sử dụng iframe để phát YouTube video

## Cách sử dụng

### 1. Thêm YouTube URL qua Admin Panel

1. Đăng nhập với tài khoản admin
2. Vào trang Admin
3. Click "Sửa Video" bên cạnh phim cần cập nhật
4. Nhập YouTube URL (bất kỳ format nào):
   - `https://www.youtube.com/watch?v=nb_fFj_0rq8`
   - `https://youtu.be/nb_fFj_0rq8`
   - `https://www.youtube.com/embed/nb_fFj_0rq8`
5. Click OK

### 2. Các format YouTube URL được hỗ trợ

✅ **Được hỗ trợ:**
- `https://www.youtube.com/watch?v=VIDEO_ID`
- `https://youtu.be/VIDEO_ID`
- `https://www.youtube.com/embed/VIDEO_ID`
- `https://www.youtube.com/watch?v=VIDEO_ID&t=30s` (với timestamp)

❌ **Không hỗ trợ:**
- YouTube Shorts URL
- YouTube Playlist URL
- Private/Unlisted videos (nếu không có quyền truy cập)

### 3. Video thường vs YouTube

**Video thường (MP4, WebM, etc.):**
- URL trực tiếp đến file video
- Ví dụ: `https://example.com/video.mp4`
- Sử dụng thẻ `<video>` HTML5

**YouTube Video:**
- URL YouTube (bất kỳ format nào)
- Ví dụ: `https://www.youtube.com/watch?v=nb_fFj_0rq8`
- Tự động chuyển đổi và sử dụng iframe

## Ví dụ

### Thêm YouTube video cho phim "Avatar"

1. Tìm video YouTube về Avatar
2. Copy URL: `https://www.youtube.com/watch?v=d9MyW72ELq0`
3. Vào Admin Panel → Sửa Video → Dán URL
4. Lưu và kiểm tra

### Thêm video MP4 thường

1. Có URL video MP4: `https://example.com/avatar.mp4`
2. Vào Admin Panel → Sửa Video → Dán URL
3. Lưu và kiểm tra

## Lưu ý

1. **Bản quyền**: Đảm bảo bạn có quyền sử dụng video YouTube
2. **Video công khai**: Chỉ video công khai mới phát được
3. **Video riêng tư**: Video riêng tư hoặc không có quyền sẽ không phát được
4. **Tốc độ internet**: YouTube video cần kết nối internet ổn định

## Troubleshooting

### Video YouTube không phát được
- Kiểm tra URL có đúng không
- Kiểm tra video có công khai không
- Kiểm tra kết nối internet
- Mở Console (F12) để xem lỗi

### Video thường không phát được
- Kiểm tra URL có truy cập được không (copy vào trình duyệt)
- Kiểm tra format video (MP4, WebM được hỗ trợ tốt nhất)
- Kiểm tra CORS (Cross-Origin Resource Sharing)

### Cả hai loại video đều không phát
- Kiểm tra JavaScript có bị lỗi không (F12 → Console)
- Refresh trang (Ctrl+F5)
- Kiểm tra server có đang chạy không
