const AdminRouter = require("express").Router()

const ServiceRoutes = require("./ServiceRoutes")
const DepartmentRoutes = require("./DepartmentRoutes")
const DoctorRoutes = require("./DoctorRoutes")
const TestimonialRoutes = require("./TestimonialRoutes")
const GalleryRoutes = require("./GalleryRoutes")
const FaqRoutes = require("./FaqRoutes")
const NewsletterRoutes = require("./NewsletterRoutes")
const AppointmentRoutes = require("./AppointmentRoutes")
const ContactUsRoutes = require("./ContactUsRoutes")
const UserRoutes = require("./UserRoutes")

const { indexPage } = require("../../controllers/admin/admin-home-controller")

AdminRouter.get("/", indexPage)
AdminRouter.use("/service", ServiceRoutes)
AdminRouter.use("/department", DepartmentRoutes)
AdminRouter.use("/doctor", DoctorRoutes)
AdminRouter.use("/testimonial", TestimonialRoutes)
AdminRouter.use("/gallery", GalleryRoutes)
AdminRouter.use("/faq", FaqRoutes)
AdminRouter.use("/newsletter", NewsletterRoutes)
AdminRouter.use("/appointment", AppointmentRoutes)
AdminRouter.use("/contactus", ContactUsRoutes)
AdminRouter.use("/user", UserRoutes)

module.exports = AdminRouter