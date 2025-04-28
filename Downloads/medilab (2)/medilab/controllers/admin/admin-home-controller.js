const User = require("../../models/User")
async function indexPage(req, res) {
    let user = await User.findOne({ _id: req.session.userid })
    if (user) {
        res.render("admin/index", {
            title: `${process.env.SITE_NAME} - Admin Page`,
            currentUrl: '/admin',
            data: user,
            session: req.session
        })
    }
    else
        res.redirect("/login")
}

module.exports = {
    indexPage: indexPage
}