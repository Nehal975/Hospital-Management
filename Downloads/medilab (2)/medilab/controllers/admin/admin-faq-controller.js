const Faq = require("../../models/Faq")

async function indexPage(req, res) {
    try {
        let data = await Faq.find().sort({ "sortOrder": 1 })
        res.render("admin/faq/index", {
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
    res.render("admin/faq/create", {
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
        var data = new Faq(req.body)
        data.createdBy = req.session.name
        await data.save()
        res.redirect("/admin/faq")
    } catch (error) {
        let errorMessage = {}
        error?.errors?.question ? errorMessage.question = error.errors.question.message : null
        error?.errors?.answer ? errorMessage.answer = error.errors.answer.message : null

        res.render("admin/faq/create", {
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
        let data = await Faq.findOne({ _id: req.params._id })
        if (data) {
            await data.deleteOne()
        }
        res.redirect("/admin/faq")
    } catch (error) {
        console.log(error)
        res.redirect("/admin/faq")
    }
}

async function editPage(req, res) {
    try {
        let data = await Faq.findOne({ _id: req.params._id })
        if (data) {
            res.render("admin/faq/edit", {
                title: `${process.env.SITE_NAME} - Admin Page`,
                currentUrl: '/admin',
                data: data,
                errorMessage: {},
                session: req.session
            })
        }
        else
            res.redirect("/admin/faq")
    } catch (error) {
        console.log(error)
        res.redirect("/admin/faq")
    }
}

async function updatePage(req, res) {
    try {
        var data = await Faq.findOne({ _id: req.params._id })
        // console.log(data)
        if (data) {
            data.question = req.body.question
            data.answer = req.body.answer
            data.sortOrder = req.body.sortOrder
            data.active = req.body.active
            data.updatedBy.push({
                user: req.session.name,
                time: new Date()
            })
            await data.save()
        }
        res.redirect("/admin/faq")
    } catch (error) {
        console.log(error)
        let errorMessage = {}
        error?.errors?.question ? errorMessage.question = error.errors.question.message : null
        error?.errors?.answer ? errorMessage.answer = error.errors.answer.message : null

        res.render("admin/faq/edit", {
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