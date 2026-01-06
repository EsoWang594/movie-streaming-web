const router = require('express').Router();
const Movie = require('../models/Movie');
const { auth, adminOnly } = require('../middleware/auth');

// Lấy tất cả phim
router.get('/', async (req, res) => {
  try {
    const movies = await Movie.find().sort({ createdAt: -1 });
    res.json(movies);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
});

// Lấy phim theo id
router.get('/:id', async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);
    if (!movie) return res.status(404).json({ msg: "Movie not found" });
    res.json(movie);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
});

// Thêm phim (admin only)
router.post('/', auth, adminOnly, async (req, res) => {
  try {
    const { title, poster, videoUrl } = req.body;
    if (!title || !poster || !videoUrl) {
      return res.status(400).json({ msg: "Title, poster, and videoUrl are required" });
    }

    const movie = new Movie(req.body);
    await movie.save();
    res.status(201).json(movie);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
});

// Cập nhật phim (admin only)
router.put('/:id', auth, adminOnly, async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);
    if (!movie) return res.status(404).json({ msg: "Movie not found" });

    // Cập nhật các field được gửi lên
    Object.keys(req.body).forEach(key => {
      if (req.body[key] !== undefined) {
        movie[key] = req.body[key];
      }
    });

    await movie.save();
    res.json(movie);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
});

// Xóa phim (admin only)
router.delete('/:id', auth, adminOnly, async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);
    if (!movie) return res.status(404).json({ msg: "Movie not found" });

    await Movie.findByIdAndDelete(req.params.id);
    res.sendStatus(204);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
});

module.exports = router;
