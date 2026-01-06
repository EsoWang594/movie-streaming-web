require('dotenv').config();
const mongoose = require('mongoose');
const Movie = require('../models/Movie');

// Danh sách video URL mẫu (các video công khai, miễn phí)
const sampleVideos = [
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
  'https://archive.org/download/BigBuckBunny_328/BigBuckBunny_512kb.mp4',
  'https://archive.org/download/ElephantsDream/ed_hd.mp4',
  'https://archive.org/download/Sintel/sintel-2048-surround.mp4',
  'https://archive.org/download/TearsOfSteel/TearsOfSteel_720p.mp4',
  'https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4',
  'https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_2mb.mp4',
  'https://sample-videos.com/video123/mp4/480/big_buck_bunny_480p_1mb.mp4',
  'https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/720/Big_Buck_Bunny_720_10s_1MB.mp4',
  'https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/1080/Big_Buck_Bunny_1080_10s_1MB.mp4',
  'https://www.learningcontainer.com/wp-content/uploads/2020/05/sample-mp4-file.mp4'
];

// Kết nối MongoDB
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("MongoDB connected"))
.catch(err => {
  console.error("MongoDB connection error:", err.message);
  process.exit(1);
});

async function addVideosToMovies() {
  try {
    // Lấy tất cả phim chưa có video URL
    const movies = await Movie.find({ 
      $or: [
        { videoUrl: { $exists: false } },
        { videoUrl: null },
        { videoUrl: '' }
      ]
    });
    
    console.log(`\nTìm thấy ${movies.length} phim chưa có video URL\n`);
    
    if (movies.length === 0) {
      console.log('Tất cả phim đã có video URL!');
      await mongoose.disconnect();
      process.exit(0);
    }
    
    let updated = 0;
    let failed = 0;
    
    // Cập nhật video URL cho từng phim
    for (let i = 0; i < movies.length; i++) {
      const movie = movies[i];
      // Phân bổ video theo vòng lặp để mỗi phim có video khác nhau
      const videoUrl = sampleVideos[i % sampleVideos.length];
      
      try {
        movie.videoUrl = videoUrl;
        await movie.save();
        console.log(`✅ ${i + 1}. ${movie.title}`);
        console.log(`   Video: ${videoUrl.substring(0, 60)}...`);
        updated++;
      } catch (err) {
        console.error(`❌ Lỗi khi cập nhật ${movie.title}:`, err.message);
        failed++;
      }
    }
    
    console.log(`\n=== KẾT QUẢ ===`);
    console.log(`✅ Đã cập nhật: ${updated} phim`);
    if (failed > 0) {
      console.log(`❌ Thất bại: ${failed} phim`);
    }
    console.log(`\nTất cả phim giờ đã có video URL!`);
    
  } catch (err) {
    console.error("Lỗi:", err.message);
  } finally {
    await mongoose.disconnect();
    process.exit();
  }
}

addVideosToMovies();
