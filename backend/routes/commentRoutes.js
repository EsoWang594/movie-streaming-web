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
      return res.status(400).json({ msg: "Vui lòng nhập đầy đủ thông tin" });
    }

    if (!content.trim()) {
      return res.status(400).json({ msg: "Nội dung bình luận không được để trống" });
    }

    // Kiểm tra movie tồn tại
    const movieExists = await Movie.findById(movie);
    if (!movieExists) return res.status(404).json({ msg: "Không tìm thấy phim" });

    // Validate rating
    if (rating !== undefined && rating !== null) {
      const ratingNum = parseInt(rating);
      if (isNaN(ratingNum) || ratingNum < 1 || ratingNum > 5) {
        return res.status(400).json({ msg: "Điểm đánh giá phải từ 1 đến 5" });
      }
    }

    const comment = new Comment({
      user: req.user.id,
      movie,
      content: content.trim(),
      rating: rating ? parseInt(rating) : undefined
    });

    await comment.save();
    const savedComment = await Comment.findById(comment._id).populate('user', 'username');
    res.status(201).json(savedComment);

  } catch (err) {
    console.error("Comment error:", err);
    res.status(500).json({ msg: "Lỗi server: " + err.message });
  }
});

module.exports = router;
