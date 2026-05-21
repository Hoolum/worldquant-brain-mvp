const express = require('express');
const auth = require('../middleware/auth');
const { sandboxBacktest } = require('../utils/backtest');

const router = express.Router();

module.exports = (db) => {
  // Submit a strategy
  router.post('/submit', auth, (req, res) => {
    const { name, code } = req.body;
    if (!name || !code) return res.status(400).json({ message: "Missing fields" });

    // Simulate backtest and get performance
    const performance = sandboxBacktest(code);

    db.run(
      'INSERT INTO strategies(userId, name, code, performance, dateSubmitted) VALUES (?, ?, ?, ?, ?)',
      [req.user.id, name, code, performance, new Date().toISOString()],
      function (err) {
        if (err) return res.status(400).json({ message: err.message });
        res.status(201).json({ id: this.lastID, performance });
      }
    );
  });

  // List user's strategies
  router.get('/my', auth, (req, res) => {
    db.all(
      'SELECT * FROM strategies WHERE userId = ?',
      [req.user.id],
      (err, rows) => {
        if (err) return res.status(400).json({ message: err.message });
        res.json(rows);
      }
    );
  });

  // Get strategy by ID (user's or public)
  router.get('/:id', auth, (req, res) => {
    db.get(
      'SELECT * FROM strategies WHERE id = ?',
      [req.params.id],
      (err, row) => {
        if (err || !row) return res.status(404).json({ message: "Not found" });
        // Only allow owner or admin
        if (row.userId !== req.user.id && !req.user.isAdmin)
          return res.status(403).json({ message: "Not authorized" });
        res.json(row);
      }
    );
  });

  return router;
};
