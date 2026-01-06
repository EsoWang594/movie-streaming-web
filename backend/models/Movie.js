const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
  title: String,
  poster: String,
  trailer: String,
  description: String,
  genre: String,
  year: Number,
  videoUrl: String
});

module.exports = mongoose.model('Movie', movieSchema);


