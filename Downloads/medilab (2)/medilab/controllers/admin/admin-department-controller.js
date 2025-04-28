const fs = require("fs")
const Department = require("../../models/Department")
const Newsletter = require("../../models/Newsletter")

const mailer = require("../../mailer/index")
async function indexPage(req, res) {
    try {
        let data = await Department.find().sort({ "sortOrder": 1 })
        res.render("admin/department/index", {
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
    res.render("admin/department/create", {
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
        var data = new Department(req.body)
        if (req.file) {
            data.cover = req.file.path
        }
        data.createdBy = req.session.name
        await data.save()

        let newsletterData = await Newsletter.find()
        newsletterData.forEach(x => {
            mailer.sendMail({
                from: process.env.MAIL_SENDER,
                to: x.email,
                subject: `New Department Added - ${process.env.SITE_NAME} `,
                html: `
                            <div style="max-width: 600px; margin: auto; background-color: #ffffff; padding: 30px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">

                                <h2 style="text-align: center; color: #0066cc; margin-bottom: 20px;">🏥 New Department Now Open at ${process.env.SITE_NAME}</h2>


                                <p style="margin-bottom: 15px;">We’re happy to share that our hospital has launched a new department: <strong>${data.title}</strong>!</p>

                                <p style="margin-bottom: 15px;">This department is fully equipped with the latest technology and headed by experienced medical professionals dedicated to your health and well-being.</p>

                                <p style="margin-bottom: 15px;">Our new <strong>${data.title}</strong> department will offer consultations, diagnostics, and advanced treatments to better serve you and your family.</p>

                                <div style="background-color: #f1f1f1; padding: 15px; border-left: 4px solid #009688; margin-bottom: 25px;">
                                <p style="margin: 5px 0;"><strong>Department:</strong> ${data.title}</p>
                                </div>

                                <div style="text-align: center; margin: 30px 0;">
                                <a href="${process.env.SITE_DOMAIN_FULL}/department" style="padding: 10px 20px; background-color: #009688; color: #ffffff; text-decoration: none; border-radius: 4px; font-weight: bold;">Learn More</a>
                                </div>

                                <p style="font-size: 14px; color: #555;">Stay tuned for more updates and thank you for trusting ${process.env.SITE_NAME} with your health!</p>

                                <div style="text-align: center; font-size: 13px; color: #999; margin-top: 30px;">
                                © 2025 ${process.env.SITE_NAME} | <a href="${process.env.SITE_DOMAIN_FULL}" style="color: #0066cc; text-decoration: none;">${process.env.SITE_DOMAIN}</a> | contact@${process.env.SITE_DOMAIN_EMAIL}
                                </div>

                            </div>
                        `
            })
        })
        res.redirect("/admin/department")
    } catch (error) {
        try {
            fs.unlinkSync(req.file.path)
        } catch (error) {
            console.log(error)
        }

        let errorMessage = {}
        error?.keyValue?.title ? errorMessage.title = "A Department With This Title Already Exist" : null
        error?.errors?.title ? errorMessage.title = error.errors.title.message : null
        error?.errors?.cover ? errorMessage.cover = error.errors.cover.message : null
        error?.errors?.description ? errorMessage.description = error.errors.description.message : null

        res.render("admin/department/create", {
            title: `${process.env.SITE_NAME} - Admin Page`,
            currentUrl: '/admin',
            errorMessage: errorMessage,
            data: data,
            session: req.session
        })
    }
}

async function showPage(req, res) {
    try {
        let data = await Department.findOne({ _id: req.params._id })
        if (data) {
            res.render("admin/department/show", {
                title: `${process.env.SITE_NAME} - Admin Page`,
                currentUrl: '/admin',
                data: data,
                session: req.session
            })
        }
        else
            res.redirect("/admin/department")
    } catch (error) {
        console.log(error)
        res.redirect("/admin/department")
    }
}

async function deletePage(req, res) {
    try {
        let data = await Department.findOne({ _id: req.params._id })
        if (data) {
            try {
                fs.unlinkSync(data.cover)
            } catch (error) { }
            await data.deleteOne()
        }
        res.redirect("/admin/department")
    } catch (error) {
        console.log(error)
        res.redirect("/admin/department")
    }
}

async function editPage(req, res) {
    try {
        let data = await Department.findOne({ _id: req.params._id })
        if (data) {
            res.render("admin/department/edit", {
                title: `${process.env.SITE_NAME} - Admin Page`,
                currentUrl: '/admin',
                data: data,
                errorMessage: {},
                session: req.session
            })
        }
        else
            res.redirect("/admin/department")
    } catch (error) {
        console.log(error)
        res.redirect("/admin/department")
    }
}

async function updatePage(req, res) {
    try {
        var data = await Department.findOne({ _id: req.params._id })
        if (data) {
            data.title = req.body.title
            data.description = req.body.description
            data.sortOrder = req.body.sortOrder
            data.active = req.body.active
            data.updatedBy.push({
                user: req.session.name,
                time: new Date()
            })
            if (await data.save() && req.file) {
                try {
                    fs.unlinkSync(data.cover)
                } catch (error) { }
                data.cover = req.file.path
            }
            await data.save()
        }
        res.redirect("/admin/department")
    } catch (error) {
        try {
            if (req.file)
                fs.unlinkSync(req.file.path)
        } catch (error) {
            console.log(error)
        }

        let errorMessage = {}
        error?.keyValue?.title ? errorMessage.title = "A Department With This Title Already Exist" : null
        error?.errors?.title ? errorMessage.title = error.errors.title.message : null
        error?.errors?.cover ? errorMessage.cover = error.errors.cover.message : null
        error?.errors?.description ? errorMessage.description = error.errors.description.message : null

        res.render("admin/department/edit", {
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
    showPage: showPage,
    deletePage: deletePage,
    editPage: editPage,
    updatePage: updatePage,
}