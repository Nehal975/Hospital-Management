const DoctorRoutes = require("express").Router()
const encoder = require("../../middleware/bodyParser")
const { doctorUploader } = require("../../middleware/fileUploader")
const { checkRole } = require("../../middleware/authentication")
const {
    indexPage,
    createPage,
    storePage,
    showPage,
    deletePage,
    editPage,
    updatePage
} = require("../../controllers/admin/admin-doctor-controller")

DoctorRoutes.get("/", indexPage)
DoctorRoutes.get("/create", createPage)
DoctorRoutes.post("/store", doctorUploader.single("pic"), encoder, storePage)
DoctorRoutes.get("/show/:_id", showPage)
DoctorRoutes.get("/delete/:_id",checkRole, deletePage)
DoctorRoutes.get("/edit/:_id", editPage)
DoctorRoutes.post("/update/:_id", doctorUploader.single("pic"), encoder, updatePage)

module.exports = DoctorRoutes