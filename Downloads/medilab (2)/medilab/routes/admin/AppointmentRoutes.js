const AppointmentRoutes = require("express").Router()
const { checkRole } = require("../../middleware/authentication")
const {
    indexPage,
    deletePage,
    editPage,
} = require("../../controllers/admin/admin-appointment-controller")

AppointmentRoutes.get("/", indexPage)
AppointmentRoutes.get("/delete/:_id", checkRole, deletePage)
AppointmentRoutes.get("/edit/:_id", editPage)

module.exports = AppointmentRoutes