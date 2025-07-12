



const express = require('express');
const router = express.Router();
const Notice = require('../models/Notice');
const User = require('../models/User');

// Home page showing latest notices + subscription form
router.get('/', async (req, res) => {
  const notices = await Notice.find().sort({ date: -1 });
  res.render('user/home', { notices });
});

// Handle form submission
router.post('/subscribe', async (req, res) => {
  const { name, email, branch, year } = req.body;

  // Avoid duplicate email
  const existing = await User.findOne({ email });
  if (existing) return res.send('You are already subscribed.');

  const user = new User({ name, email, branch, year });
  await user.save();
  res.send('Subscription successful! You will receive notice updates via email.');
});

module.exports = router;




