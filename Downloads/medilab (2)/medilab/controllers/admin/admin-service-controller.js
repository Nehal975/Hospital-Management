const fs = require("fs")
const Service = require("../../models/Service")
const Newsletter = require("../../models/Newsletter")

const mailer = require("../../mailer/index")

async function indexPage(req, res) {
    try {
        let data = await Service.find().sort({ "sortOrder": 1 })
        res.render("admin/service/index", {
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
    res.render("admin/service/create", {
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
        var data = new Service(req.body)
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
                subject: `New Healthcare Service at ${process.env.SITE_NAME} `,
                html: `
                     <div style="max-width: 600px; margin: auto; background-color: #ffffff; padding: 30px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
    
                        <h2 style="text-align: center; color: #0066cc; margin-bottom: 20px;">🆕 New Service Available at ${process.env.SITE_NAME}</h2>
    
                        <p style="margin-bottom: 15px;">We're excited to announce that we’ve added a brand-new service to our ${process.env.SITE_NAME} offerings: <strong>${data.title}</strong>!</p>
    
                        <p style="margin-bottom: 15px;"><strong>${data.title}</strong> is now available to support your health journey with the latest technology, top specialists, and compassionate care.</p>
    
                        <p style="margin-bottom: 15px;">Whether you're looking for expert consultation, diagnosis, or treatment — we're here for you every step of the way.</p>
    
                        <div style="background-color: #f1f1f1; padding: 15px; border-left: 4px solid #009688; margin-bottom: 25px;">
                        <p style="margin: 5px 0;"><strong>Service:</strong> ${data.title}</p>
                        </div>
    
                        <div style="text-align: center; margin: 30px 0;">
                        <a href="${process.env.SITE_DOMAIN_FULL}/service/${data.seoUrl}" style="padding: 10px 20px; background-color: #009688; color: #ffffff; text-decoration: none; border-radius: 4px; font-weight: bold;">Explore This Service</a>
                        </div>
    
                        <p style="font-size: 14px; color: #555;">Thank you for staying connected with ${process.env.SITE_NAME}. We’re committed to offering you the best in healthcare services.</p>
    
                        <div style="text-align: center; font-size: 13px; color: #999; margin-top: 30px;">
                        © 2025 ${process.env.SITE_NAME} | <a href="${process.env.SITE_DOMAIN}" style="color: #0066cc; text-decoration: none;">${process.env.SITE_DOMAIN}</a> | contact@${process.env.SITE_EMAIL}
                        </div>
    
                    </div>
                `
            })
        })

        res.redirect("/admin/service")
    } catch (error) {
        try {
            fs.unlinkSync(req.file.path)
        } catch (error) {
            console.log(error)
        }

        let errorMessage = {}
        error?.keyValue?.title ? errorMessage.title = "A Service With This Title Already Exist" : null
        error?.keyValue?.seoUrl ? errorMessage.title = "A Service With This SeoUrl Already Exist" : null
        error?.errors?.title ? errorMessage.title = error.errors.title.message : null
        error?.errors?.seoUrl ? errorMessage.seoUrl = error.errors.seoUrl.message : null
        error?.errors?.icon ? errorMessage.icon = error.errors.icon.message : null
        error?.errors?.cover ? errorMessage.cover = error.errors.cover.message : null
        error?.errors?.shortDescription ? errorMessage.shortDescription = error.errors.shortDescription.message : null
        error?.errors?.longDescription ? errorMessage.longDescription = error.errors.longDescription.message : null

        res.render("admin/service/create", {
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
        let data = await Service.findOne({ _id: req.params._id })
        if (data) {
            res.render("admin/service/show", {
                title: `${process.env.SITE_NAME} - Admin Page`,
                currentUrl: '/admin',
                data: data,
                session: req.session
            })
        }
        else
            res.redirect("/admin/service")
    } catch (error) {
        console.log(error)
        res.redirect("/admin/service")
    }
}

async function deletePage(req, res) {
    try {
        let data = await Service.findOne({ _id: req.params._id })
        if (data) {
            try {
                fs.unlinkSync(data.cover)
            } catch (error) { }
            await data.deleteOne()
        }
        res.redirect("/admin/service")
    } catch (error) {
        console.log(error)
        res.redirect("/admin/service")
    }
}

async function editPage(req, res) {
    try {
        let data = await Service.findOne({ _id: req.params._id })
        if (data) {
            res.render("admin/service/edit", {
                title: `${process.env.SITE_NAME} - Admin Page`,
                currentUrl: '/admin',
                data: data,
                errorMessage: {},
                session: req.session
            })
        }
        else
            res.redirect("/admin/service")
    } catch (error) {
        console.log(error)
        res.redirect("/admin/service")
    }
}

async function updatePage(req, res) {
    try {
        var data = await Service.findOne({ _id: req.params._id })
        if (data) {
            data.title = req.body.title
            data.seoUrl = req.body.seoUrl
            data.icon = req.body.icon
            data.shortDescription = req.body.shortDescription
            data.longDescription = req.body.longDescription
            data.metaTitle = req.body.metaTitle
            data.metaDescription = req.body.metaDescription
            data.metaKeywords = req.body.metaKeywords
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
        res.redirect("/admin/service")
    } catch (error) {
        try {
            if (req.file)
                fs.unlinkSync(req.file.path)
        } catch (error) {
            console.log(error)
        }

        let errorMessage = {}
        error?.keyValue?.title ? errorMessage.title = "A Service With This Title Already Exist" : null
        error?.keyValue?.seoUrl ? errorMessage.title = "A Service With This SeoUrl Already Exist" : null
        error?.errors?.title ? errorMessage.title = error.errors.title.message : null
        error?.errors?.seoUrl ? errorMessage.seoUrl = error.errors.seoUrl.message : null
        error?.errors?.icon ? errorMessage.icon = error.errors.icon.message : null
        error?.errors?.cover ? errorMessage.cover = error.errors.cover.message : null
        error?.errors?.shortDescription ? errorMessage.shortDescription = error.errors.shortDescription.message : null
        error?.errors?.longDescription ? errorMessage.longDescription = error.errors.longDescription.message : null

        res.render("admin/service/edit", {
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