require('dotenv').config();
const mongoose = require('mongoose');
const axios = require('axios');
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

async function importMovies() {
  try {
    let page = 1;
    const totalPages = 2; // import 2 trang (~40 phim)

    while (page <= totalPages) {
      const res = await axios.get(
        `https://api.themoviedb.org/3/movie/popular?api_key=${process.env.TMDB_KEY}&language=vi-VN&page=${page}`
      );

      for (const m of res.data.results) {
        let trailer = "";
        try {
          // Lấy trailer nếu có
          const trailerRes = await axios.get(
            `https://api.themoviedb.org/3/movie/${m.id}/videos?api_key=${process.env.TMDB_KEY}&language=vi-VN`
          );
          trailer = trailerRes.data.results.find(v => v.type === "Trailer")?.key || "";
        } catch (err) {
          console.warn(`Không có trailer cho phim: ${m.title}`);
        }

        // Upsert phim
        await Movie.updateOne(
          { title: m.title },
          {
            title: m.title,
            poster: `https://image.tmdb.org/t/p/w500${m.poster_path}`,
            description: m.overview,
            year: m.release_date?.slice(0,4),
            genre: m.genre_ids.join(','),
            trailer
          },
          { upsert: true }
        );
      }

      console.log(`Import xong trang ${page}`);
      page++;
    }

    console.log("Import toàn bộ xong!");
    process.exit();

  } catch (err) {
    console.error("Import thất bại:", err.message);
    process.exit(1);
  }
}

importMovies();
