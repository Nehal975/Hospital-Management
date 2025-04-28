const ContactUsRoutes = require("express").Router()
const { checkRole } = require("../../middleware/authentication")
const {
    indexPage,
    deletePage,
    editPage,
    showPage
} = require("../../controllers/admin/admin-contactus-controller")

ContactUsRoutes.get("/", indexPage)
ContactUsRoutes.get("/delete/:_id",checkRole, deletePage)
ContactUsRoutes.get("/edit/:_id", editPage)
ContactUsRoutes.get("/show/:_id", showPage)

module.exports = ContactUsRoutes