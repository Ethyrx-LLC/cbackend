const ROLE = {
  ADMIN: 100,
  MOD: 50,
  BASIC: 0,
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
