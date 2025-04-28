const MainRouter = require("express").Router()
const encoder = require("../../middleware/bodyParser")
const {
    homePage,
    aboutPage,
    servicePage,
    showServicePage,
    appointmentPage,
    createAppointmentPage,
    appointmentConfirmationPage,
    departmentPage,
    doctorPage,
    faqPage,
    testimonialPage,
    galleryPage,
    contactusPage,
    contactusStorePage,
    newsletterSubscription,
    loginPage,
    loginStorePage,
    logoutPage,
    forgetPasword1,
    forgetPasword1Store,
    forgetPasword2,
    forgetPasword2Store,
    forgetPasword3,
    forgetPasword3Store
} = require("../../controllers/main/index")

MainRouter.get("/", homePage)
MainRouter.get("/about", aboutPage)
MainRouter.get("/service", servicePage)
MainRouter.get("/service/:seoUrl", showServicePage)
MainRouter.get("/appointment", appointmentPage)
MainRouter.post("/appointment", encoder, createAppointmentPage)
MainRouter.get("/appointment-confirmation", appointmentConfirmationPage)
MainRouter.get("/department", departmentPage)
MainRouter.get("/doctor", doctorPage)
MainRouter.get("/faq", faqPage)
MainRouter.get("/testimonial", testimonialPage)
MainRouter.get("/gallery", galleryPage)
MainRouter.get("/contactus", contactusPage)
MainRouter.post("/contactus", encoder, contactusStorePage)
MainRouter.post("/newsletter-subscription", encoder, newsletterSubscription)
MainRouter.get("/login", loginPage)
MainRouter.post("/login", encoder, loginStorePage)
MainRouter.get("/logout", logoutPage)
MainRouter.get("/forget-password-1", forgetPasword1)
MainRouter.post("/forget-password-1", encoder, forgetPasword1Store)
MainRouter.get("/forget-password-2", forgetPasword2)
MainRouter.post("/forget-password-2", encoder, forgetPasword2Store)
MainRouter.get("/forget-password-3", forgetPasword3)
MainRouter.post("/forget-password-3", encoder, forgetPasword3Store)

module.exports = MainRouter