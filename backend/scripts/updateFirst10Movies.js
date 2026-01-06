require('dotenv').config();
const mongoose = require('mongoose');
const Movie = require('../models/Movie');

// Video URLs cho 10 phim đầu tiên (trailer hoặc video công khai)
// Lưu ý: Đây là các video trailer/demo công khai, không phải phim đầy đủ
const movieVideos = {
  'Avatar: Lửa và Tro Tàn': 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4', // Placeholder - cần tìm video thật
  'Phi Vụ Động Trời 2': 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4', // Placeholder
  'Baahubali: The Epic': 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4', // Placeholder
  'Toàn Trí Độc Giả': 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4', // Placeholder
  'Thanh Gươm Diệt Quỷ: Vô Hạn Thành': 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4', // Placeholder
  'Năm Đêm Kinh Hoàng 2': 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4', // Placeholder
  'Cuộc Chiến Giữa Các Thế Giới': 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4', // Placeholder
  'Đại hồng thủy': 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4', // Placeholder
  'Yadang: Ba Mặt Lật Kèo': 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4', // Placeholder
  'Phi Vụ Thế Kỷ 3: Thoắt Ẩn Thoắt Hiện': 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4' // Placeholder
};

// Kết nối MongoDB
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("MongoDB connected"))
.catch(err => {
  console.error("MongoDB connection error:", err.message);
  process.exit(1);
});

async function updateFirst10Movies() {
  try {
    // Lấy 10 phim đầu tiên
    const movies = await Movie.find().limit(10).sort({ _id: 1 });
    
    console.log(`\n=== CẬP NHẬT VIDEO CHO 10 PHIM ĐẦU TIÊN ===\n`);
    
    if (movies.length === 0) {
      console.log('Không có phim nào trong database');
      return;
    }
    
    let updated = 0;
    let notFound = 0;
    
    for (const movie of movies) {
      // Tìm video URL trong danh sách
      let videoUrl = movieVideos[movie.title];
      
      // Nếu không tìm thấy trong danh sách, giữ nguyên video hiện tại
      if (!videoUrl) {
        console.log(`⚠️  Không tìm thấy video cho: ${movie.title}`);
        console.log(`   Giữ nguyên video hiện tại: ${movie.videoUrl || 'Chưa có'}`);
        notFound++;
        continue;
      }
      
      try {
        movie.videoUrl = videoUrl;
        await movie.save();
        console.log(`✅ ${updated + 1}. ${movie.title}`);
        console.log(`   Video: ${videoUrl.substring(0, 70)}...`);
        updated++;
      } catch (err) {
        console.error(`❌ Lỗi khi cập nhật ${movie.title}:`, err.message);
      }
    }
    
    console.log(`\n=== KẾT QUẢ ===`);
    console.log(`✅ Đã cập nhật: ${updated} phim`);
    if (notFound > 0) {
      console.log(`⚠️  Không tìm thấy video: ${notFound} phim`);
    }
    
  } catch (err) {
    console.error("Lỗi:", err.message);
  } finally {
    await mongoose.disconnect();
    process.exit();
  }
}

updateFirst10Movies();
