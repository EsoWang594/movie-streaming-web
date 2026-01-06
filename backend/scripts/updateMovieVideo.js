require('dotenv').config();
const mongoose = require('mongoose');
const Movie = require('../models/Movie');

// Kết nối MongoDB
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("MongoDB connected"))
.catch(err => {
  console.error("MongoDB connection error:", err.message);
  process.exit(1);
});

async function updateMovieVideo() {
  try {
    // Lấy movieId và videoUrl từ command line arguments
    const movieId = process.argv[2];
    const videoUrl = process.argv[3];
    
    if (!movieId || !videoUrl) {
      console.log('Cách sử dụng:');
      console.log('  node updateMovieVideo.js <movieId> <videoUrl>');
      console.log('\nVí dụ:');
      console.log('  node updateMovieVideo.js 507f1f77bcf86cd799439011 https://example.com/video.mp4');
      console.log('\nHoặc cập nhật theo tên phim:');
      console.log('  node updateMovieVideo.js "Tên phim" https://example.com/video.mp4');
      process.exit(1);
    }
    
    let movie;
    
    // Thử tìm theo ID trước
    if (mongoose.Types.ObjectId.isValid(movieId)) {
      movie = await Movie.findById(movieId);
    }
    
    // Nếu không tìm thấy, thử tìm theo tên
    if (!movie) {
      movie = await Movie.findOne({ title: movieId });
    }
    
    if (!movie) {
      console.error(`Không tìm thấy phim với ID/tên: ${movieId}`);
      process.exit(1);
    }
    
    movie.videoUrl = videoUrl;
    await movie.save();
    
    console.log(`✅ Đã cập nhật video URL cho phim: ${movie.title}`);
    console.log(`   Video URL: ${videoUrl}`);
    
  } catch (err) {
    console.error("Lỗi:", err.message);
  } finally {
    await mongoose.disconnect();
    process.exit();
  }
}

updateMovieVideo();
