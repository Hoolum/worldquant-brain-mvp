const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const db = new sqlite3.Database('db.sqlite');

// Create tables if not exists
// (Run ONCE, safe on every start)
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY, 
    username TEXT UNIQUE,
    password TEXT,
    isAdmin INTEGER
  )`);
  db.run(`CREATE TABLE IF NOT EXISTS strategies (
    id INTEGER PRIMARY KEY, 
    userId INTEGER,
    name TEXT,
    code TEXT,
    performance REAL,
    dateSubmitted TEXT,
    FOREIGN KEY(userId) REFERENCES users(id)
  )`);
});

// Route includes
app.use('/api/auth', require('./routes/auth')(db));
app.use('/api/strategy', require('./routes/strategy')(db));
app.use('/api/leaderboard', require('./routes/leaderboard')(db));
app.use('/api/admin', require('./routes/admin')(db));

app.get('/', (req, res) => {
  res.send('WorldQuant Brain MVP Backend Running!');
});

app.listen(4000, () => {
  console.log('Backend running on port 4000');
});
