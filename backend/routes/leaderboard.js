const express = require('express');
const router = express.Router();

module.exports = (db) => {
  router.get('/', (req, res) => {
    db.all(
      'SELECT s.id, s.name, u.username, s.performance FROM strategies s JOIN users u ON u.id = s.userId ORDER BY s.performance DESC LIMIT 20',
      [],
      (err, rows) => {
        if (err) return res.status(400).json({ message: err.message });
        res.json(rows);
      }
    );
  });

  return router;
};
