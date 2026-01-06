require('dotenv').config();
const mongoose = require('mongoose');
const Movie = require('../models/Movie');

// Kết nối MongoDB
mongoose.connect(process.env.MONGO_URI, { 
  useNewUrlParser: true, 
  useUnifiedTopology: true 
})
.then(() => console.log("MongoDB connected"))
.catch(err => {
  console.error("MongoDB connection error:", err.message);
  process.exit(1);
});

async function run() {
  try {
    const result = await Movie.updateOne(
      { title: "Avatar: Lửa và Tro Tàn" },
      { $set: { videoUrl: "https://archive.org/download/BigBuckBunny_328/BigBuckBunny_512kb.mp4" } }
    );

    if (result.matchedCount === 0) {
      console.warn("Không tìm thấy phim để cập nhật");
    } else {
      console.log("Cập nhật thành công:", result);
    }

  } catch (err) {
    console.error("Cập nhật thất bại:", err.message);
  } finally {
    process.exit();
  }
}

run();
