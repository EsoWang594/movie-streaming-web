require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');

// Kết nối MongoDB
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("MongoDB connected"))
.catch(err => {
  console.error("MongoDB connection error:", err.message);
  process.exit(1);
});

async function listUsers() {
  try {
    const users = await User.find().select('username role _id createdAt');
    
    console.log('\n=== DANH SÁCH TẤT CẢ TÀI KHOẢN ===\n');
    
    if (users.length === 0) {
      console.log('Chưa có tài khoản nào trong database.');
      console.log('\nTạo tài khoản admin:');
      console.log('  node scripts/createAdmin.js');
      return;
    }
    
    const admins = users.filter(u => u.role === 'admin');
    const regularUsers = users.filter(u => u.role !== 'admin');
    
    if (admins.length > 0) {
      console.log('👑 TÀI KHOẢN ADMIN:');
      admins.forEach((user, index) => {
        console.log(`  ${index + 1}. Username: ${user.username}`);
        console.log(`     Role: ${user.role}`);
        console.log(`     ID: ${user._id}`);
        console.log(`     Tạo lúc: ${new Date(user.createdAt).toLocaleString('vi-VN')}`);
        console.log('');
      });
    }
    
    if (regularUsers.length > 0) {
      console.log('👤 TÀI KHOẢN NGƯỜI DÙNG:');
      regularUsers.forEach((user, index) => {
        console.log(`  ${index + 1}. Username: ${user.username}`);
        console.log(`     Role: ${user.role || 'user'}`);
        console.log(`     ID: ${user._id}`);
        console.log(`     Tạo lúc: ${new Date(user.createdAt).toLocaleString('vi-VN')}`);
        console.log('');
      });
    }
    
    console.log(`\nTổng cộng: ${users.length} tài khoản (${admins.length} admin, ${regularUsers.length} user)`);
    
  } catch (err) {
    console.error("Lỗi:", err.message);
  } finally {
    await mongoose.disconnect();
    process.exit();
  }
}

listUsers();
