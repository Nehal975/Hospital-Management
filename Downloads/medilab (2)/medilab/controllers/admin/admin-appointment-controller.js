const Appointment = require("../../models/Appointment")

async function indexPage(req, res) {
    try {
        let data = await Appointment.find().sort({ "_id": -1 })
        .populate({
            path: "department",
            select: "-_id title"
        })
        .populate({
            path: "doctor",
            select: "-_id name"
        })
        res.render("admin/appointment/index", {
            title: `${process.env.SITE_NAME} - Admin Page`,
            currentUrl: '/admin',
            data: data,
            session:req.session
        })
    } catch (error) {
        console.log(error)
    }
}

async function deletePage(req, res) {
    try {
        let data = await Appointment.findOne({ _id: req.params._id })
        if (data) {
            await data.deleteOne()
        }
        res.redirect("/admin/appointment")
    } catch (error) {
        console.log(error)
        res.redirect("/admin/appointment")
    }
}

async function editPage(req, res) {
    try {
        let data = await Appointment.findOne({ _id: req.params._id })
        if (data) {
            data.active = !data.active
            await data.save()
        }
        res.redirect("/admin/appointment")
    } catch (error) {
        console.log(error)
        res.redirect("/admin/appointment")
    }
}


module.exports = {
    indexPage: indexPage,
    deletePage: deletePage,
    editPage: editPage,
}