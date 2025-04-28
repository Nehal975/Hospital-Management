const NewsletterRoutes = require("express").Router()
const { checkRole } = require("../../middleware/authentication")
const {
    indexPage,
    deletePage,
    editPage,
} = require("../../controllers/admin/admin-newsletter-controller")

NewsletterRoutes.get("/", indexPage)
NewsletterRoutes.get("/delete/:_id",checkRole, deletePage)
NewsletterRoutes.get("/edit/:_id", editPage)

module.exports = NewsletterRoutes