const ServiceRoutes = require("express").Router()
const encoder = require("../../middleware/bodyParser")
const { serviceUploader } = require("../../middleware/fileUploader")
const { checkRole } = require("../../middleware/authentication")
const {
    indexPage,
    createPage,
    storePage,
    showPage,
    deletePage,
    editPage,
    updatePage
} = require("../../controllers/admin/admin-service-controller")

ServiceRoutes.get("/", indexPage)
ServiceRoutes.get("/create", createPage)
ServiceRoutes.post("/store", serviceUploader.single("cover"), encoder, storePage)
ServiceRoutes.get("/show/:_id", showPage)
ServiceRoutes.get("/delete/:_id",checkRole, deletePage)
ServiceRoutes.get("/edit/:_id", editPage)
ServiceRoutes.post("/update/:_id", serviceUploader.single("cover"), encoder, updatePage)

module.exports = ServiceRoutes