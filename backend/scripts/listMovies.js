require('dotenv').config();
const mongoose = require('mongoose');
const Movie = require('../models/Movie');

mongoose.connect(process.env.MONGO_URI);

async function run() {
  const movies = await Movie.find().limit(5);
  console.log(movies.map(m => m.title));
  process.exit();
}

run();
