const express = require('express');
const bcrypt = require('bcryptjs');
const { connectDB } = require('../db/database');
const User = require('../models/User');
const { signToken } = require('../middleware/auth');

const router = express.Router();

router.post('/register', async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password)
    return res.status(400).json({ error: 'username, email and password are required' });
  if (password.length < 6)
    return res.status(400).json({ error: 'Password must be at least 6 characters' });

  try {
    await connectDB();
    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ username, email, password: hashed });
    const token = signToken({ id: user._id, username: user.username, email: user.email });
    res.status(201).json({ token, user: { id: user._id, username: user.username, email: user.email } });
  } catch (err) {
    if (err.code === 11000)
      return res.status(409).json({ error: 'Username or email already exists' });
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({ error: 'email and password are required' });

  try {
    await connectDB();
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ error: 'Invalid credentials' });

    const token = signToken({ id: user._id, username: user.username, email: user.email });
    res.json({ token, user: { id: user._id, username: user.username, email: user.email } });
  } catch {
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
