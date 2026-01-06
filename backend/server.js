require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB connect
mongoose.connect(process.env.MONGO_URI, {
  serverSelectionTimeoutMS: 5000,
  tls: true,
  tlsAllowInvalidCertificates: false
})
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error("MongoDB error:", err));

// API routes
app.use('/api/movies', require('./routes/movieRoutes'));
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/comments', require('./routes/commentRoutes'));

// Serve frontend files
app.use(express.static(path.join(__dirname, '../frontend')));

// Route for home page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

// Fallback route (for client-side routing)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log('Server running on', PORT));
