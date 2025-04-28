const ContactUs = require("../../models/ContactUs")

async function indexPage(req, res) {
    try {
        let data = await ContactUs.find().sort({ "_id": -1 })
        res.render("admin/contactus/index", {
            title: `${process.env.SITE_NAME} - Admin Page`,
            currentUrl: '/admin',
            data: data,
            session:req.session
        })
    } catch (error) {
        console.log(error)
    }
}

async function showPage(req, res) {
    try {
        let data = await ContactUs.findOne({ _id: req.params._id })
        if (data) {
            res.render("admin/contactus/show", {
                title: `${process.env.SITE_NAME} - Admin Page`,
                currentUrl: '/admin',
                data: data,
                session:req.session
            })
        }
        else
            res.redirect("/admin/contactus")
    } catch (error) {
        console.log(error)
        res.redirect("/admin/contactus")
    }
}


async function deletePage(req, res) {
    try {
        let data = await ContactUs.findOne({ _id: req.params._id })
        if (data) {
            await data.deleteOne()
        }
        res.redirect("/admin/contactus")
    } catch (error) {
        console.log(error)
        res.redirect("/admin/contactus")
    }
}

async function editPage(req, res) {
    try {
        let data = await ContactUs.findOne({ _id: req.params._id })
        if (data) {
            data.active = !data.active
            await data.save()
        }
        res.redirect("/admin/contactus")
    } catch (error) {
        console.log(error)
        res.redirect("/admin/contactus")
    }
}


module.exports = {
    indexPage: indexPage,
    deletePage: deletePage,
    editPage: editPage,
    showPage:showPage
}