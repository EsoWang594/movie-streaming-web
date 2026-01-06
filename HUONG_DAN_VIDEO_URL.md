# Hướng dẫn về Video URL và các vấn đề thường gặp

## ❌ Tại sao không thể dùng link từ trang phim lậu?

### 1. Vấn đề kỹ thuật

**CORS (Cross-Origin Resource Sharing):**
- Các trang web phim lậu thường chặn truy cập từ domain khác
- Browser sẽ chặn request do vi phạm CORS policy
- Video không thể load được

**Referrer Protection:**
- Nhiều trang kiểm tra nguồn gốc request (referrer)
- Chỉ cho phép phát video khi truy cập trực tiếp từ trang của họ
- Khi embed vào trang khác sẽ bị chặn

**Token/Session Protection:**
- Video URL thường có token hoặc session ID
- Token này chỉ hợp lệ trong một khoảng thời gian ngắn
- Khi copy URL, token sẽ hết hạn

**Dynamic Loading:**
- Video không được load trực tiếp qua URL
- Sử dụng JavaScript để load video động
- Không thể embed trực tiếp

### 2. Vấn đề pháp lý

⚠️ **CẢNH BÁO:**
- Sử dụng nội dung từ trang phim lậu là **BẤT HỢP PHÁP**
- Vi phạm bản quyền
- Có thể bị kiện tụng
- Không nên sử dụng cho mục đích thương mại

## ✅ Giải pháp hợp pháp

### 1. Sử dụng video công khai miễn phí

**Archive.org:**
- Nhiều phim cũ đã hết bản quyền
- URL trực tiếp đến file video
- Ví dụ: `https://archive.org/download/...`

**YouTube (Trailer/Review):**
- Trailer chính thức
- Review phim
- Video phân tích
- URL: `https://www.youtube.com/watch?v=...`

**Vimeo:**
- Video công khai
- Creative Commons
- URL: `https://vimeo.com/...`

### 2. Upload video lên server của bạn

**Nếu bạn có bản quyền:**
1. Upload video lên server của bạn
2. Lưu trong thư mục `public/videos/`
3. Sử dụng URL: `http://localhost:5000/videos/movie.mp4`

**Sử dụng Cloud Storage:**
- AWS S3
- Google Cloud Storage
- Cloudinary
- Upload video và lấy URL công khai

### 3. Sử dụng dịch vụ streaming hợp pháp

**API từ dịch vụ hợp pháp:**
- Netflix API (nếu có quyền)
- Amazon Prime Video API
- Disney+ API
- YouTube API (cho trailer)

## 🔧 Cách kiểm tra URL video có hoạt động không

### Test 1: Mở trực tiếp trong trình duyệt
1. Copy URL video
2. Paste vào thanh địa chỉ trình duyệt
3. Nếu video phát được → URL hợp lệ
4. Nếu bị chặn/lỗi → URL không thể dùng

### Test 2: Kiểm tra CORS
1. Mở Console (F12)
2. Thử load video
3. Nếu thấy lỗi CORS → URL không thể embed

### Test 3: Kiểm tra format
- ✅ MP4, WebM, OGG → Hỗ trợ tốt
- ✅ YouTube URL → Tự động chuyển đổi
- ❌ M3U8 (HLS) → Cần player đặc biệt
- ❌ DASH → Cần player đặc biệt

## 📝 Ví dụ URL hợp lệ

### Video MP4 trực tiếp:
```
https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4
https://archive.org/download/BigBuckBunny_328/BigBuckBunny_512kb.mp4
```

### YouTube:
```
https://www.youtube.com/watch?v=dQw4w9WgXcQ
https://youtu.be/dQw4w9WgXcQ
```

### Vimeo:
```
https://vimeo.com/123456789
```

## ⚠️ Lưu ý quan trọng

1. **Bản quyền**: Luôn đảm bảo bạn có quyền sử dụng video
2. **Pháp lý**: Không sử dụng nội dung từ trang phim lậu
3. **Bảo mật**: Một số URL có thể chứa mã độc
4. **Hiệu suất**: Video từ server khác có thể chậm

## 🛠️ Troubleshooting

### Video không phát được
1. Kiểm tra URL có đúng không
2. Kiểm tra CORS (mở Console xem lỗi)
3. Thử mở URL trực tiếp trong trình duyệt
4. Kiểm tra format video

### Video bị chặn
- URL có thể yêu cầu authentication
- URL có thể chỉ hợp lệ trong thời gian ngắn
- URL có thể yêu cầu referrer cụ thể

### Giải pháp
- Sử dụng video từ nguồn công khai hợp pháp
- Upload video lên server của bạn
- Sử dụng dịch vụ streaming hợp pháp
