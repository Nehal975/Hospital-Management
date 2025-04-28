const GalleryRoutes = require("express").Router()
const encoder = require("../../middleware/bodyParser")
const { galleryUploader } = require("../../middleware/fileUploader")
const { checkRole } = require("../../middleware/authentication")
const {
    indexPage,
    createPage,
    storePage,
    deletePage,
    editPage,
    updatePage
} = require("../../controllers/admin/admin-gallery-controller")

GalleryRoutes.get("/", indexPage)
GalleryRoutes.get("/create", createPage)
GalleryRoutes.post("/store", galleryUploader.single("pic"), encoder, storePage)
GalleryRoutes.get("/delete/:_id", checkRole, deletePage)
GalleryRoutes.get("/edit/:_id", editPage)
GalleryRoutes.post("/update/:_id", galleryUploader.single("pic"), encoder, updatePage)

module.exports = GalleryRoutes