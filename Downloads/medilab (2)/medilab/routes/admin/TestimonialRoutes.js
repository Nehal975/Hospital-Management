const TestimonialRoutes = require("express").Router()
const encoder = require("../../middleware/bodyParser")
const { testimonialUploader } = require("../../middleware/fileUploader")
const { checkRole } = require("../../middleware/authentication")
const {
    indexPage,
    createPage,
    storePage,
    deletePage,
    editPage,
    updatePage
} = require("../../controllers/admin/admin-testimonial-controller")

TestimonialRoutes.get("/", indexPage)
TestimonialRoutes.get("/create", createPage)
TestimonialRoutes.post("/store", testimonialUploader.single("pic"), encoder, storePage)
TestimonialRoutes.get("/delete/:_id",checkRole, deletePage)
TestimonialRoutes.get("/edit/:_id", editPage)
TestimonialRoutes.post("/update/:_id", testimonialUploader.single("pic"), encoder, updatePage)

module.exports = TestimonialRoutes