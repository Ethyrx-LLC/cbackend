const ROLE = {
  ADMIN: "admin",
  MOD: "mod",
  BASIC: "user",
};

function AuthorizeDashboard(req, res, next) {
  if (req.user.perms !== ROLE.ADMIN && req.user.perms !== ROLE.MOD) {
    res.status(401).json("You are not authorized");
  }
  next();
}

module.exports = {
  ROLE,
  AuthorizeDashboard,
};
