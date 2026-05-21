const express = require('express');
const admin = require('../middleware/admin');
const auth = require('../middleware/auth');

const router = express.Router();

module.exports = (db) => {
  // List all users
  router.get('/users', auth, admin, (req, res) => {
    db.all('SELECT id, username, isAdmin FROM users', [], (err, rows) => {
      if (err) return res.status(400).json({ message: err.message });
      res.json(rows);
    });
  });

  // Promote user to admin
  router.post('/users/:id/promote', auth, admin, (req, res) => {
    db.run(
      'UPDATE users SET isAdmin = 1 WHERE id = ?',
      [req.params.id],
      function (err) {
        if (err) return res.status(400).json({ message: err.message });
        res.json({ message: "User promoted" });
      }
    );
  });

  // Delete strategy
  router.delete('/strategies/:id', auth, admin, (req, res) => {
    db.run(
      'DELETE FROM strategies WHERE id = ?',
      [req.params.id],
      function (err) {
        if (err) return res.status(400).json({ message: err.message });
        res.json({ message: "Strategy deleted" });
      }
    );
  });

  return router;
};
