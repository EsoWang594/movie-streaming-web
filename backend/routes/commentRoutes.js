const router = require('express').Router();
const Comment = require('../models/Comment');
const Movie = require('../models/Movie');
const { auth } = require('../middleware/auth');

// Lấy comment theo movie
router.get('/:movieId', async (req, res) => {
  try {
    const movieId = req.params.movieId;
    // Kiểm tra movie tồn tại
    const movie = await Movie.findById(movieId);
    if (!movie) return res.status(404).json({ msg: "Movie not found" });

    // Lấy comment, populate user info
    const comments = await Comment.find({ movie: movieId })
      .populate('user', 'username') // chỉ lấy username
      .sort({ createdAt: -1 });

    res.json(comments);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
});

// Thêm comment (cần đăng nhập)
router.post('/', auth, async (req, res) => {
  try {
    const { movie, content, rating } = req.body;

    if (!movie || !content) {
      return res.status(400).json({ msg: "Movie and content are required" });
    }

    // Kiểm tra movie tồn tại
    const movieExists = await Movie.findById(movie);
    if (!movieExists) return res.status(404).json({ msg: "Movie not found" });

    // Validate rating
    if (rating && (rating < 1 || rating > 5)) {
      return res.status(400).json({ msg: "Rating must be 1-5" });
    }

    const comment = new Comment({
      user: req.user.id,
      movie,
      content,
      rating
    });

    await comment.save();
    const savedComment = await comment.populate('user', 'username');
    res.status(201).json(savedComment);

  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
});

module.exports = router;
