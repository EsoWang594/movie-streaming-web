require('dotenv').config();
const mongoose = require('mongoose');
const Movie = require('../models/Movie');

// Danh sách video đa dạng hơn cho 10 phim đầu tiên
// Mỗi phim sẽ có video khác nhau để dễ phân biệt
const videoList = [
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4'
];

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
    console.log('Lưu ý: Đây là các video demo/trailer công khai để test.\n');
    console.log('Để có video thật của phim, bạn cần:');
    console.log('1. Tìm video từ nguồn chính thức (có bản quyền)');
    console.log('2. Hoặc upload video lên server của bạn');
    console.log('3. Hoặc sử dụng dịch vụ streaming có bản quyền\n');
    console.log('---\n');
    
    if (movies.length === 0) {
      console.log('Không có phim nào trong database');
      return;
    }
    
    let updated = 0;
    
    for (let i = 0; i < movies.length && i < videoList.length; i++) {
      const movie = movies[i];
      const videoUrl = videoList[i];
      
      try {
        const oldVideo = movie.videoUrl;
        movie.videoUrl = videoUrl;
        await movie.save();
        
        console.log(`${updated + 1}. ${movie.title}`);
        console.log(`   Video mới: ${videoUrl.substring(0, 60)}...`);
        if (oldVideo && oldVideo !== videoUrl) {
          console.log(`   (Đã thay thế video cũ)`);
        }
        console.log('');
        updated++;
      } catch (err) {
        console.error(`❌ Lỗi khi cập nhật ${movie.title}:`, err.message);
      }
    }
    
    console.log(`\n=== KẾT QUẢ ===`);
    console.log(`✅ Đã cập nhật: ${updated} phim`);
    console.log(`\nMỗi phim giờ có video khác nhau để dễ phân biệt khi test.`);
    
  } catch (err) {
    console.error("Lỗi:", err.message);
  } finally {
    await mongoose.disconnect();
    process.exit();
  }
}

updateFirst10Movies();
