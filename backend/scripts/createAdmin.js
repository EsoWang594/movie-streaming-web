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

async function createAdmin() {
  try {
    // Kiểm tra xem đã có admin chưa
    const existingAdmin = await User.findOne({ role: 'admin' });
    
    if (existingAdmin) {
      console.log('\n=== TÀI KHOẢN ADMIN ĐÃ TỒN TẠI ===\n');
      console.log(`Username: ${existingAdmin.username}`);
      console.log(`Role: ${existingAdmin.role}`);
      console.log(`ID: ${existingAdmin._id}`);
      console.log('\nNếu bạn quên mật khẩu, hãy tạo tài khoản admin mới với username khác.');
    } else {
      console.log('\nChưa có tài khoản admin nào.\n');
    }
    
    // Tạo tài khoản admin mới
    const username = process.argv[2] || 'admin';
    const password = process.argv[3] || 'admin123';
    
    // Kiểm tra username đã tồn tại chưa
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      console.log(`\n⚠️  Username "${username}" đã tồn tại!`);
      console.log('Vui lòng chọn username khác hoặc cập nhật role của user này thành admin.');
      console.log('\nCách cập nhật role:');
      console.log(`  node scripts/updateUserRole.js "${username}" admin`);
      await mongoose.disconnect();
      process.exit(1);
    }
    
    const admin = new User({
      username: username,
      password: password, // Model sẽ tự động hash
      role: 'admin'
    });
    
    await admin.save();
    
    console.log('\n=== ✅ ĐÃ TẠO TÀI KHOẢN ADMIN THÀNH CÔNG ===\n');
    console.log('Thông tin đăng nhập:');
    console.log(`  Username: ${username}`);
    console.log(`  Password: ${password}`);
    console.log(`  Role: admin`);
    console.log('\n⚠️  LƯU Ý: Hãy đổi mật khẩu sau khi đăng nhập!');
    console.log('\nBạn có thể đăng nhập tại: http://localhost:5000/login.html');
    
  } catch (err) {
    console.error("Lỗi:", err.message);
  } finally {
    await mongoose.disconnect();
    process.exit();
  }
}

createAdmin();
