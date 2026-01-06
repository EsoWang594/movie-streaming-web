require('dotenv').config();
const mongoose = require('mongoose');
const axios = require('axios');
const Movie = require('../models/Movie');

mongoose.connect(process.env.MONGO_URI);

async function importMovies() {
  let page = 1;

  while (page <= 2) { // import 2 trang (~40 phim)
    const res = await axios.get(
      `https://api.themoviedb.org/3/movie/popular?api_key=${process.env.TMDB_KEY}&language=vi-VN&page=${page}`
    );

    for (const m of res.data.results) {
      await Movie.updateOne(
        { title: m.title },
        {
          title: m.title,
          poster: `https://image.tmdb.org/t/p/w500${m.poster_path}`,
          description: m.overview,
          year: m.release_date?.slice(0,4),
          genre: m.genre_ids.join(','),
          trailer: "" // sẽ thêm sau
        },
        { upsert: true }
      );
    }
    page++;
  }

  console.log("Import xong!");
  process.exit();
}

importMovies();
