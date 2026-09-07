function adminAuth(req, res, next) {

    if (req.session.usuario) {
        return next();
    }

    res.redirect("/login");
}

module.exports = adminAuth;

