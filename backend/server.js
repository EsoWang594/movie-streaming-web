require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

// Routes
const authRoutes = require('./routes/authRoutes');
const movieRoutes = require('./routes/movieRoutes');
const commentRoutes = require('./routes/commentRoutes');

const app = express();

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || '*', // cho phép frontend truy cập
  credentials: true
}));
app.use(express.json()); // parse JSON body
app.use(express.urlencoded({ extended: true }));

// MongoDB connect
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("MongoDB connected"))
.catch(err => {
  console.error("MongoDB connection error:", err.message);
  process.exit(1);
});

// Logging middleware cho API routes
app.use('/api', (req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

// API Routes - phải đặt trước static files
app.use('/api/auth', authRoutes);
app.use('/api/movies', movieRoutes);
app.use('/api/comments', commentRoutes);

// 404 handler cho API routes - phải đặt sau tất cả API routes
app.use((req, res, next) => {
  if (req.path.startsWith('/api/')) {
    return res.status(404).json({ msg: "API endpoint not found", path: req.path });
  }
  next();
});

// Serve frontend tĩnh - chỉ cho non-API routes
app.use((req, res, next) => {
  if (req.path.startsWith('/api/')) {
    return next(); // Bỏ qua static cho API routes
  }
  express.static(path.join(__dirname, '../frontend'))(req, res, next);
});

// Catch-all handler: serve index.html for non-API routes
app.use((req, res, next) => {
  // Bỏ qua API routes (đã được xử lý ở trên)
  if (req.path.startsWith('/api/')) {
    return next(); // Đã được xử lý ở middleware trên
  }
  // Serve index.html for all other routes
  res.sendFile(path.join(__dirname, '../frontend/index.html'), (err) => {
    if (err) next(err);
  });
});

// Error handler middleware (phải đặt cuối cùng)
app.use((err, req, res, next) => {
  console.error("Error:", err);
  res.status(err.status || 500).json({ 
    msg: err.message || "Internal server error",
    error: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`API URL: http://localhost:${PORT}/api`);
  console.log(`Frontend: http://localhost:${PORT}`);
});
