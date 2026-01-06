const router = require('express').Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

router.post('/register', async(req,res)=>{
  const hash = await bcrypt.hash(req.body.password,10);
  const user = new User({...req.body,password:hash});
  await user.save();
  res.json(user);
});

router.post('/login', async(req,res)=>{
  const user = await User.findOne({username:req.body.username});
  if(!user) return res.status(400).json({msg:"Not found"});
  const ok = await bcrypt.compare(req.body.password,user.password);
  if(!ok) return res.status(400).json({msg:"Wrong password"});
  const token = jwt.sign({id:user._id,role:user.role},process.env.JWT_SECRET);
  res.json({token});
});

module.exports = router;

