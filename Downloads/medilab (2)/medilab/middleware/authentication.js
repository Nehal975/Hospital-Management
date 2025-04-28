function checkLogin(req, res, next) {
    if (req.session.login)
        next()
    else
        res.redirect("/login")
}

function checkRole(req, res, next) {
    if (req.session.role === "Super Admin")
        next()
    else
        res.redirect("/admin")
}

module.exports = {
    checkLogin: checkLogin,
    checkRole: checkRole
}