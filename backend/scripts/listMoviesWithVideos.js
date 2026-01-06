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

async function listMovies() {
  try {
    const movies = await Movie.find().select('title videoUrl _id');
    
    console.log('\n=== DANH SÁCH PHIM VÀ VIDEO URL ===\n');
    
    if (movies.length === 0) {
      console.log('Không có phim nào trong database');
      return;
    }
    
    movies.forEach((movie, index) => {
      console.log(`${index + 1}. ${movie.title}`);
      console.log(`   ID: ${movie._id}`);
      console.log(`   Video URL: ${movie.videoUrl || '(CHƯA CÓ)'}`);
      console.log('');
    });
    
    const withoutVideo = movies.filter(m => !m.videoUrl || m.videoUrl.trim() === '');
    if (withoutVideo.length > 0) {
      console.log(`\n⚠️  Có ${withoutVideo.length} phim chưa có video URL:`);
      withoutVideo.forEach(m => console.log(`   - ${m.title} (ID: ${m._id})`));
    }
    
  } catch (err) {
    console.error("Lỗi:", err.message);
  } finally {
    await mongoose.disconnect();
    process.exit();
  }
}

listMovies();
