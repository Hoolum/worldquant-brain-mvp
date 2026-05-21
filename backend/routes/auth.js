const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const SECRET = "yourSecret";

const router = express.Router();

module.exports = (db) => {
  // User registration
  router.post('/register', async (req, res) => {
    const { username, password } = req.body;
    const hash = await bcrypt.hash(password, 10);
    db.run(
      'INSERT INTO users(username, password, isAdmin) VALUES (?, ?, ?)',
      [username, hash, 0],
      function (err) {
        if (err) return res.status(400).json({ message: err.message });
        res.status(201).json({ message: "User registered" });
      }
    );
  });

  // User login
  router.post('/login', (req, res) => {
    const { username, password } = req.body;
    db.get(
      'SELECT * FROM users WHERE username = ?',
      [username],
      async (err, user) => {
        if (err || !user) return res.status(401).json({ message: "Invalid credentials" });
        const match = await bcrypt.compare(password, user.password);
        if (!match) return res.status(401).json({ message: "Invalid credentials" });

        const token = jwt.sign(
          { id: user.id, username: user.username, isAdmin: !!user.isAdmin },
          SECRET,
          { expiresIn: "1d" }
        );
        res.json({ token });
      }
    );
  });

  return router;
};
