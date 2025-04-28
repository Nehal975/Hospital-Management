const Newsletter = require("../../models/Newsletter")

async function indexPage(req, res) {
    try {
        let data = await Newsletter.find().sort({ "_id": -1 })
        res.render("admin/newsletter/index", {
            title: `${process.env.SITE_NAME} - Admin Page`,
            currentUrl: '/admin',
            data: data,
            session: req.session
        })
    } catch (error) {
        console.log(error)
    }
}

async function deletePage(req, res) {
    try {
        let data = await Newsletter.findOne({ _id: req.params._id })
        if (data) {
            await data.deleteOne()
        }
        res.redirect("/admin/newsletter")
    } catch (error) {
        console.log(error)
        res.redirect("/admin/newsletter")
    }
}

async function editPage(req, res) {
    try {
        let data = await Newsletter.findOne({ _id: req.params._id })
        if (data) {
            data.active = !data.active
            await data.save()
        }
        res.redirect("/admin/newsletter")
    } catch (error) {
        console.log(error)
        res.redirect("/admin/newsletter")
    }
}


module.exports = {
    indexPage: indexPage,
    deletePage: deletePage,
    editPage: editPage,
}