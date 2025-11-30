const express = require('express');
const router = express.Router();
const Notice = require('../models/Notice');
const User = require('../models/User');
const nodemailer = require('nodemailer'); // add at top if not present

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

// Contact form POST: sends email to admin
router.post('/contact', async (req, res) => {
  try {
    const { name, email, message } = req.body || {};
    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Name, email and message are required.' });
    }

    // create transporter (uses env vars)
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: 'infocascade.gndec@gmail.com',
      subject: `Infocascade query from ${name}`,
      replyTo: email,
      text: `You have received a new query via InfoCascade.\n\nName: ${name}\nEmail: ${email}\n\nQuery:\n${message}`
    };

    await transporter.sendMail(mailOptions);

    return res.json({ ok: true, message: 'Thank You!! , we will respond as soon as possible' });
  } catch (err) {
    console.error('Contact send error:', err);
    return res.status(500).json({ error: 'Unable to send message at this time. Try again' });
  }
});

module.exports = router;




