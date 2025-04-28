const DepartmentRoutes = require("express").Router()
const encoder = require("../../middleware/bodyParser")
const { departmentUploader } = require("../../middleware/fileUploader")
const { checkRole } = require("../../middleware/authentication")
const {
    indexPage,
    createPage,
    storePage,
    showPage,
    deletePage,
    editPage,
    updatePage
} = require("../../controllers/admin/admin-department-controller")

DepartmentRoutes.get("/", indexPage)
DepartmentRoutes.get("/create", createPage)
DepartmentRoutes.post("/store", departmentUploader.single("cover"), encoder, storePage)
DepartmentRoutes.get("/show/:_id", showPage)
DepartmentRoutes.get("/delete/:_id",checkRole, deletePage)
DepartmentRoutes.get("/edit/:_id", editPage)
DepartmentRoutes.post("/update/:_id", departmentUploader.single("cover"), encoder, updatePage)

module.exports = DepartmentRoutes