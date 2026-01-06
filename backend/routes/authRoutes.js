const router = require('express').Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

router.post('/register', async(req,res)=>{
  try {
    console.log("Register request received:", { username: req.body.username });
    
    if (!req.body.username || !req.body.password) {
      return res.status(400).json({ msg: "Vui lòng nhập đầy đủ thông tin" });
    }
    
    // Model sẽ tự động hash password trong pre-save hook
    const user = new User({
      username: req.body.username,
      password: req.body.password, // Password plain text, model sẽ hash
      role: req.body.role || 'user'
    });
    await user.save();
    // Không trả về password
    const userResponse = user.toObject();
    delete userResponse.password;
    console.log("User registered successfully:", userResponse.username);
    res.json({ msg: "Đăng ký thành công", user: userResponse });
  } catch (err) {
    console.error("Register error:", err);
    if (err.code === 11000) {
      return res.status(400).json({ msg: "Tên đăng nhập đã tồn tại" });
    }
    res.status(400).json({ msg: err.message || "Đăng ký thất bại" });
  }
});

router.post('/login', async(req,res)=>{
  try {
    const user = await User.findOne({username:req.body.username});
    if(!user) return res.status(400).json({msg:"Tên đăng nhập không tồn tại"});
    
    const ok = await bcrypt.compare(req.body.password, user.password);
    if(!ok) return res.status(400).json({msg:"Mật khẩu không đúng"});
    
    const token = jwt.sign({id:user._id, role:user.role}, process.env.JWT_SECRET);
    res.json({token, msg: "Đăng nhập thành công"});
  } catch (err) {
    res.status(500).json({msg: "Lỗi server: " + err.message});
  }
});

module.exports = router;

