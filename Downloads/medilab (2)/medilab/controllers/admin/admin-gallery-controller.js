const fs = require("fs")
const Gallery = require("../../models/Gallery")

async function indexPage(req, res) {
    try {
        let data = await Gallery.find().sort({ "sortOrder": 1 })
        res.render("admin/gallery/index", {
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
    res.render("admin/gallery/create", {
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
        var data = new Gallery(req.body)
        if (req.file) {
            data.pic = req.file.path
        }
        data.createdBy = req.session.name
        await data.save()
        res.redirect("/admin/gallery")
    } catch (error) {
        try {
            fs.unlinkSync(req.file.path)
        } catch (error) {
            console.log(error)
        }

        let errorMessage = {}
        error?.errors?.pic ? errorMessage.pic = error.errors.pic.message : null

        res.render("admin/gallery/create", {
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
        let data = await Gallery.findOne({ _id: req.params._id })
        if (data) {
            try {
                fs.unlinkSync(data.pic)
            } catch (error) { }
            await data.deleteOne()
        }
        res.redirect("/admin/gallery")
    } catch (error) {
        console.log(error)
        res.redirect("/admin/gallery")
    }
}

async function editPage(req, res) {
    try {
        let data = await Gallery.findOne({ _id: req.params._id })
        if (data) {
            res.render("admin/gallery/edit", {
                title: `${process.env.SITE_NAME} - Admin Page`,
                currentUrl: '/admin',
                data: data,
                errorMessage: {},
                session: req.session
            })
        }
        else
            res.redirect("/admin/gallery")
    } catch (error) {
        console.log(error)
        res.redirect("/admin/gallery")
    }
}

async function updatePage(req, res) {
    try {
        var data = await Gallery.findOne({ _id: req.params._id })
        if (data) {
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
        res.redirect("/admin/gallery")
    } catch (error) {
        try {
            if (req.file)
                fs.unlinkSync(req.file.path)
        } catch (error) {
            console.log(error)
        }

        let errorMessage = {}
        error?.errors?.pic ? errorMessage.pic = error.errors.pic.message : null

        res.render("admin/gallery/edit", {
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