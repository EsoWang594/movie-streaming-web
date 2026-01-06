require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');

async function clearUsers() {
  try {
    // Kết nối MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected");

    // Đếm số users hiện tại
    const count = await User.countDocuments();
    console.log(`Tìm thấy ${count} user(s) trong database`);

    if (count === 0) {
      console.log("Không có user nào để xóa.");
      await mongoose.disconnect();
      return;
    }

    // Xóa tất cả users
    const result = await User.deleteMany({});
    console.log(`✅ Đã xóa ${result.deletedCount} user(s) thành công!`);
    console.log("Bạn có thể đăng ký tài khoản mới bây giờ.");

    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error("Lỗi:", err.message);
    process.exit(1);
  }
}

clearUsers();
