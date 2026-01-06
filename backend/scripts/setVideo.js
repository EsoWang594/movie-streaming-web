require('dotenv').config();
const mongoose = require('mongoose');
const Movie = require('../models/Movie');

mongoose.connect(process.env.MONGO_URI);

async function run() {
  const result = await Movie.updateOne(
    { title: "Avatar: Lửa và Tro Tàn" },
    { $set: { videoUrl: "https://archive.org/download/BigBuckBunny_328/BigBuckBunny_512kb.mp4" } }
  );

  console.log(result);
  process.exit();
}

run();

