const UserRoutes = require("express").Router()
const encoder = require("../../middleware/bodyParser")
const { userUploader } = require("../../middleware/fileUploader")
const { checkRole } = require("../../middleware/authentication")
const {
    indexPage,
    createPage,
    storePage,
    deletePage,
    editPage,
    updatePage,
    editProfilePage,
    updateProfilePage
} = require("../../controllers/admin/admin-user-controller")

UserRoutes.get("/",checkRole, indexPage)
UserRoutes.get("/create",checkRole, createPage)
UserRoutes.post("/store",checkRole, encoder, storePage)
UserRoutes.get("/delete/:_id",checkRole, deletePage)
UserRoutes.get("/edit/:_id",checkRole, editPage)
UserRoutes.post("/update/:_id",checkRole, encoder, updatePage)
UserRoutes.get("/update-profile", editProfilePage)
UserRoutes.post("/update-profile",userUploader.single("pic"), encoder, updateProfilePage)

module.exports = UserRoutes