const fs = require("fs")
const Testimonial = require("../../models/Testimonial")

async function indexPage(req, res) {
    try {
        let data = await Testimonial.find().sort({ "sortOrder": 1 })
        res.render("admin/testimonial/index", {
            title: `${process.env.SITE_NAME} - Admin Page`,
            currentUrl: '/admin',
            data: data,
            session: req.session
        })
    } catch (error) {
        console.log(error)
    }
}

function createPage(req, res) {
    res.render("admin/testimonial/create", {
        title: `${process.env.SITE_NAME} - Admin Page`,
        currentUrl: '/admin',
        errorMessage: {},
        data: {
            sortOrder: 10
        },
        session: req.session
    })
}

async function storePage(req, res) {
    try {
        var data = new Testimonial(req.body)
        if (req.file) {
            data.pic = req.file.path
        }
        data.createdBy = req.session.name
        await data.save()
        res.redirect("/admin/testimonial")
    } catch (error) {
        try {
            fs.unlinkSync(req.file.path)
        } catch (error) {
            console.log(error)
        }

        let errorMessage = {}
        error?.errors?.name ? errorMessage.name = error.errors.name.message : null
        error?.errors?.pic ? errorMessage.pic = error.errors.pic.message : null
        error?.errors?.message ? errorMessage.message = error.errors.message.message : null

        res.render("admin/testimonial/create", {
            title: `${process.env.SITE_NAME} - Admin Page`,
            currentUrl: '/admin',
            errorMessage: errorMessage,
            data: data,
            session: req.session
        })
    }
}


async function deletePage(req, res) {
    try {
        let data = await Testimonial.findOne({ _id: req.params._id })
        if (data) {
            try {
                fs.unlinkSync(data.pic)
            } catch (error) { }
            await data.deleteOne()
        }
        res.redirect("/admin/testimonial")
    } catch (error) {
        console.log(error)
        res.redirect("/admin/testimonial")
    }
}

async function editPage(req, res) {
    try {
        let data = await Testimonial.findOne({ _id: req.params._id })
        if (data) {
            res.render("admin/testimonial/edit", {
                title: `${process.env.SITE_NAME} - Admin Page`,
                currentUrl: '/admin',
                data: data,
                errorMessage: {},
                session: req.session
            })
        }
        else
            res.redirect("/admin/testimonial")
    } catch (error) {
        console.log(error)
        res.redirect("/admin/testimonial")
    }
}

async function updatePage(req, res) {
    try {
        var data = await Testimonial.findOne({ _id: req.params._id })
        if (data) {
            data.name = req.body.name
            data.message = req.body.message
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
        res.redirect("/admin/testimonial")
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

        res.render("admin/testimonial/edit", {
            title: `${process.env.SITE_NAME} - Admin Page`,
            currentUrl: '/admin',
            errorMessage: errorMessage,
            data: data,
            session: req.session
        })
    }
}

module.exports = {
    indexPage: indexPage,
    createPage: createPage,
    storePage: storePage,
    deletePage: deletePage,
    editPage: editPage,
    updatePage: updatePage,
}