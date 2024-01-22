module.exports = function verifyToken(req, res, next) {
  const bearerHeader = req.cookies.token;
  if (typeof bearerHeader !== "undefined") {
    req.token = bearerHeader;
    next();
  } else {
    req.token = undefined;
    next();
  }
};
