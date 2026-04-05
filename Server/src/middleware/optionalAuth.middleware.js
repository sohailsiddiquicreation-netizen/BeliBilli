const jwt = require("jsonwebtoken");

const optionalAuthMiddleware = (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return next(); // Just proceed without req.user
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    // If token is invalid, also proceed without user
    next();
  }
};

module.exports = optionalAuthMiddleware;
