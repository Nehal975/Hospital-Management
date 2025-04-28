const fs = require("fs")
const Doctor = require("../../models/Doctor")
const { getDepartment } = require("../main/index")

async function indexPage(req, res) {
    try {
        let data = await Doctor.find()
            .populate({
                path: "department",
                select: "-_id title"
            })
            .sort({ "sortOrder": 1 })
        res.render("admin/doctor/index", {
            title: `${process.env.SITE_NAME} - Admin Page`,
            currentUrl: '/admin',
            data: data,
            session: req.session
        })
    } catch (error) {
        console.log(error)
    }
}

async function createPage(req, res) {
    res.render("admin/doctor/create", {
        title: `${process.env.SITE_NAME} - Admin Page`,
        currentUrl: '/admin',
        errorMessage: {},
        data: {
            sortOrder: 10
        },
        departments: await getDepartment(),
        session: req.session
    })
}

async function storePage(req, res) {
    try {
        var data = new Doctor(req.body)
        if (req.file) {
            data.pic = req.file.path
        }
        data.createdBy = req.session.name
        await data.save()
        res.redirect("/admin/doctor")
    } catch (error) {
        try {
            fs.unlinkSync(req.file.path)
        } catch (error) {
            console.log(error)
        }

        let errorMessage = {}
        error?.errors?.name ? errorMessage.name = error.errors.name.message : null
        error?.errors?.pic ? errorMessage.pic = error.errors.pic.message : null
        error?.errors?.description ? errorMessage.description = error.errors.description.message : null
        error?.errors?.designation ? errorMessage.designation = error.errors.designation.message : null

        // console.log(data)
        res.render("admin/doctor/create", {
            title: `${process.env.SITE_NAME} - Admin Page`,
            currentUrl: '/admin',
            errorMessage: errorMessage,
            data: data,
            departments: await getDepartment(),
            session: req.session
        })
    }
}

async function showPage(req, res) {
    try {
        let data = await Doctor.findOne({ _id: req.params._id })
            .populate({
                path: "department",
                select: "-_id title"
            })
        if (data) {
            res.render("admin/doctor/show", {
                title: `${process.env.SITE_NAME} - Admin Page`,
                currentUrl: '/admin',
                data: data,
                session: req.session
            })
        }
        else
            res.redirect("/admin/doctor")
    } catch (error) {
        console.log(error)
        res.redirect("/admin/doctor")
    }
}

async function deletePage(req, res) {
    try {
        let data = await Doctor.findOne({ _id: req.params._id })
        if (data) {
            try {
                fs.unlinkSync(data.pic)
            } catch (error) { }
            await data.deleteOne()
        }
        res.redirect("/admin/doctor")
    } catch (error) {
        console.log(error)
        res.redirect("/admin/doctor")
    }
}

async function editPage(req, res) {
    try {
        let data = await Doctor.findOne({ _id: req.params._id })
        if (data) {
            res.render("admin/doctor/edit", {
                title: `${process.env.SITE_NAME} - Admin Page`,
                currentUrl: '/admin',
                data: data,
                errorMessage: {},
                departments: await getDepartment(),
                session: req.session
            })
        }
        else
            res.redirect("/admin/doctor")
    } catch (error) {
        console.log(error)
        res.redirect("/admin/doctor")
    }
}

async function updatePage(req, res) {
    try {
        var data = await Doctor.findOne({ _id: req.params._id })
        if (data) {
            data.name = req.body.name
            data.designation = req.body.designation
            data.department = req.body.department
            data.description = req.body.description
            data.twitter = req.body.twitter
            data.facebook = req.body.facebook
            data.instagram = req.body.instagram
            data.linkedin = req.body.linkedin
            data.youtube = req.body.youtube
            data.sortOrder = req.body.sortOrder
            data.active = req.body.active
            data.updatedBy.push({
                user: req.session.name,
                time: new Date()
            })
            if (await data.save() && req.file) {
                try {
                    fs.unlinkSync(data.pic)
                } catch (error) { }
                data.pic = req.file.path
            }
            await data.save()
        }
        res.redirect("/admin/doctor")
    } catch (error) {
        try {
            if (req.file)
                fs.unlinkSync(req.file.path)
        } catch (error) {
            console.log(error)
        }

        let errorMessage = {}
        error?.errors?.name ? errorMessage.name = error.errors.name.message : null
        error?.errors?.pic ? errorMessage.pic = error.errors.pic.message : null
        error?.errors?.description ? errorMessage.description = error.errors.description.message : null
        error?.errors?.designation ? errorMessage.designation = error.errors.designation.message : null

        res.render("admin/doctor/edit", {
            title: `${process.env.SITE_NAME} - Admin Page`,
            currentUrl: '/admin',
            errorMessage: errorMessage,
            data: data,
            departments: await getDepartment(),
            session: req.session
        })
    }
}

module.exports = {
    indexPage: indexPage,
    createPage: createPage,
    storePage: storePage,
    showPage: showPage,
    deletePage: deletePage,
    editPage: editPage,
    updatePage: updatePage,
}