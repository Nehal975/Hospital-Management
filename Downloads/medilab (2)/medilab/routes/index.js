const Router = require("express").Router()
const { checkLogin } = require("../middleware/authentication")
const MainRouter = require("./main/index")
const AdminRouter = require("./admin/index")

Router.use("/", MainRouter)
Router.use("/admin", checkLogin, AdminRouter)

module.exports = Router