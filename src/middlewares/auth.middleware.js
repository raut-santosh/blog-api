const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  try {
    const token = req.headers["authtoken"];
    const decoded = jwt.verify(token, process.env.JWT_KEY);
    req.user = decoded; // Add the logged-in user ID to the request object
    next();
  } catch (e) {
    return res.status(401).json({
      msg: "Your not logged in",
    });
  }
};