const jwt = require('jsonwebtoken');
const SECRET = "yourSecret";

module.exports = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(403).json({message: "No token"});
  try {
    req.user = jwt.verify(token, SECRET);
    next();
  } catch (e) {
    res.status(401).json({message: "Invalid token"});
  }
};
