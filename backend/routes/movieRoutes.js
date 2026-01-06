const router = require('express').Router();
const Movie = require('../models/Movie');
const auth = require('../middleware/auth');

router.get('/', async(req,res)=>{
  res.json(await Movie.find());
});

router.get('/:id', async(req,res)=>{
  res.json(await Movie.findById(req.params.id));
});

router.post('/', auth, async(req,res)=>{
  if(req.user.role!=='admin') return res.sendStatus(403);
  const m = new Movie(req.body);
  await m.save();
  res.json(m);
});

router.delete('/:id', auth, async(req,res)=>{
  if(req.user.role!=='admin') return res.sendStatus(403);
  await Movie.findByIdAndDelete(req.params.id);
  res.sendStatus(204);
});

module.exports = router;

