const FaqRoutes = require("express").Router()
const encoder = require("../../middleware/bodyParser")
const { checkRole } = require("../../middleware/authentication")
const {
    indexPage,
    createPage,
    storePage,
    deletePage,
    editPage,
    updatePage
} = require("../../controllers/admin/admin-faq-controller")

FaqRoutes.get("/", indexPage)
FaqRoutes.get("/create", createPage)
FaqRoutes.post("/store", encoder, storePage)
FaqRoutes.get("/delete/:_id", checkRole, deletePage)
FaqRoutes.get("/edit/:_id", editPage)
FaqRoutes.post("/update/:_id", encoder, updatePage)

module.exports = FaqRoutes