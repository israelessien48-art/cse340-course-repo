export function requireLogin(req, res, next) {
  if (!req.session.user) {
    req.flash("error", "Please log in to access that page.");
    return res.redirect("/login");
  }

  next();
}

export function requireRole(role) {
  return (req, res, next) => {
    if (!req.session.user) {
      req.flash("error", "Please log in to access that page.");
      return res.redirect("/login");
    }

    if (req.session.user.role_id !== role) {
      req.flash("error", "You do not have permission to access that page.");
      return res.redirect("/");
    }

    next();
  };
}