const router = require('express').Router();
const Comment = require('../models/Comment');
const auth = require('../middleware/auth');

router.get('/:movieId', async(req,res)=>{
  res.json(await Comment.find({movieId:req.params.movieId}));
});

router.post('/', auth, async(req,res)=>{
  const c = new Comment({...req.body,user:req.user.id});
  await c.save();
  res.json(c);
});

module.exports = router;
