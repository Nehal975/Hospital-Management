const Service = require("../../models/Service")
const Department = require("../../models/Department")
const Doctor = require("../../models/Doctor")
const Faq = require("../../models/Faq")
const Testimonial = require("../../models/Testimonial")
const Gallery = require("../../models/Gallery")
const ContactUs = require("../../models/ContactUs")
const Newsletter = require("../../models/Newsletter")
const Appointment = require("../../models/Appointment")
const User = require("../../models/User")

const bcrypt = require("bcrypt")
const passwordValidator = require("password-validator")

var schema = new passwordValidator();
schema
    .is().min(8)                                    // Minimum length 8
    .is().max(100)                                  // Maximum length 100
    .has().uppercase(1)                             // Must have at least 1 uppercase letter
    .has().lowercase(1)                             // Must have at least 1 lowercase letter
    .has().digits(1)                                // Must have at least 1 digits
    .has().not().spaces()                           // Should not have spaces
    .is().not().oneOf(['Passw0rd', 'Password123']); // Blacklist these values

const mailer = require("../../mailer/index")

async function getServices(count = null) {
    try {
        let data = await Service.find({ active: true }).sort({ sortOrder: 1 })
        return count ? data.slice(0, count) : data
    } catch (error) {
        return []
    }
}

async function getDepartment(count = null) {
    try {
        let data = await Department.find({ active: true }).sort({ sortOrder: 1 })
        return count ? data.slice(0, count) : data
    } catch (error) {
        return []
    }
}

async function getDoctor(count = null) {
    try {
        let data = await Doctor.find({ active: true }).sort({ sortOrder: 1 })
        return count ? data.slice(0, count) : data
    } catch (error) {
        return []
    }
}
async function getFaq(count = null) {
    try {
        let data = await Faq.find({ active: true }).sort({ sortOrder: 1 })
        return count ? data.slice(0, count) : data
    } catch (error) {
        return []
    }
}
async function getTestimonial() {
    try {
        let data = await Testimonial.find({ active: true }).sort({ sortOrder: 1 })
        return data
    } catch (error) {
        return []
    }
}

async function getGallery(count = null) {
    try {
        let data = await Gallery.find({ active: true }).sort({ sortOrder: 1 })
        return count ? data.slice(0, count) : data
    } catch (error) {
        return []
    }
}

function loginPage(req, res) {
    res.render("login-page", {
        title: `${process.env.SITE_NAME} - Login to Your Account`,
        currentUrl: "/login"
    })
}

async function loginStorePage(req, res) {
    try {
        let data = await User.findOne({
            $or: [
                { username: req.body.username },
                { email: req.body.username }
            ]
        })
        if (data) {
            if (await bcrypt.compare(req.body.password, data.password)) {
                req.session.login = true
                req.session.name = data.name
                req.session.userid = data._id
                req.session.role = data.role
                var time = 86400000  //One Day
                req.session.cookie.expires = new Date(Date.now() + time)
                req.session.cookie.maxAge = time
                res.redirect("/admin")
            }
        }
        res.render("login-page", {
            title: `${process.env.SITE_NAME} - Login to Your Account`,
            currentUrl: "/login",
            errorMessage: "Invalid Username or Password"
        })
    } catch (error) {
        res.render("login-page", {
            title: `${process.env.SITE_NAME} - Login to Your Account`,
            currentUrl: "/login",
            errorMessage: "Invalid Username or Password"
        })
    }
}

async function logoutPage(req, res) {
    req.session.destroy()
    res.redirect("/login")
}

async function homePage(req, res) {
    res.render("index", {
        title: `${process.env.SITE_NAME} - Home`,
        currentUrl: "/",
        services: await getServices(6),
        departments: await getDepartment(5),
        doctors: await getDoctor(4),
        faqs: await getFaq(5),
        testimonials: await getTestimonial(),
        gallery: await getGallery(8),
        session: req.session
    })
}

async function aboutPage(req, res) {
    res.render("about-page", {
        title: `${process.env.SITE_NAME} - About`,
        currentUrl: "/about",
        doctors: await getDoctor(4),
        faqs: await getFaq(5),
        testimonials: await getTestimonial(),
        session: req.session
    })
}

async function servicePage(req, res) {
    res.render("service-page", {
        title: `${process.env.SITE_NAME} - Service`,
        currentUrl: "/service",
        services: await getServices(),
        testimonials: await getTestimonial(),
        session: req.session,
        session: req.session
    })
}

async function showServicePage(req, res) {
    try {
        let data = await Service.findOne({ seoUrl: req.params.seoUrl })
        if (data) {
            res.render("show-service-page", {
                title: `${process.env.SITE_NAME} - Service - ${data.title}`,
                currentUrl: "/service",
                data: data,
                services: await getServices(),
                session: req.session
            })
        }
        else
            res.redirect("/service")
    } catch (error) {
        console.log(error)
        res.redirect("/service")
    }
}


async function appointmentPage(req, res) {
    res.render("appointment-page", {
        title: `${process.env.SITE_NAME} - Appointment`,
        currentUrl: "/appointment",
        testimonials: await getTestimonial(),
        faqs: await getFaq(5),
        doctors: await getDoctor(),
        departments: await getDepartment(),
        message: "",
        session: req.session
    })
}

async function createAppointmentPage(req, res) {
    try {
        let data = new Appointment(req.body)
        await data.save()

        let finalData = await Appointment.findOne({ _id: data._id })
            .populate({
                path: "department",
                select: "-_id title"
            })
            .populate({
                path: "doctor",
                select: "-_id name"
            })

        mailer.sendMail({
            from: process.env.MAIL_SENDER,
            to: data.email,
            subject: `Your Appointment Has Been Scheduled : Team ${process.env.SITE_NAME} `,
            html: `
                 <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 30px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">

                <h2 style="text-align: center; color: #0066cc; margin-bottom: 20px;">✅ Appointment Request Received</h2>

                <p style="font-size: 16px; margin-bottom: 15px;">Dear <strong>${data.name}</strong>,</p>

                <p style="margin-bottom: 15px;">Thank you for booking an appointment with <strong>${process.env.SITE_NAME}</strong>. Your request has been received and is currently being reviewed by our team.</p>

                <p style="margin-bottom: 15px;">Here are the details of your appointment request:</p>

                <div style="background-color: #f1f1f1; padding: 15px; border-radius: 6px; margin-bottom: 20px;">
                <p style="margin: 5px 0;"><strong>Department:</strong> ${finalData?.department?.title}</p>
                <p style="margin: 5px 0;"><strong>Doctor:</strong>  ${finalData?.doctor?.name}</p>
                <p style="margin: 5px 0;"><strong>Date:</strong>  ${new Date(finalData.date).toLocaleString()}</p>
                <p style="margin: 5px 0;"><strong>Concern:</strong> ${finalData.message}</p>
                </div>

                <p style="margin-bottom: 15px;">You will receive a confirmation once the appointment is scheduled. If you need to make changes, feel free to reply to this email or call us directly at <strong>${process.env.SITE_PHONE}</strong>.</p>

                <p style="margin-bottom: 30px;">We look forward to seeing you soon and providing the care you deserve.</p>

                <div style="font-size: 14px; color: #777777; text-align: center;">
                Warm regards,<br>
                <strong>The ${process.env.SITE_NAME} Team</strong><br>
                <a href="${process.env.SITE_DOMAIN_FULL}" style="color: #0066cc; text-decoration: none;">${process.env.SITE_DOMAIN}</a><br>
                contact@${process.env.SITE_EMAIL}
                </div>

            </div>
            `
        })
        mailer.sendMail({
            from: process.env.MAIL_SENDER,
            to: process.env.MAIL_SENDER,
            subject: `New Appointment Query Recieved : Team ${process.env.SITE_NAME}`,
            html: `
                <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; padding: 30px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
    
                <h2 style="color: #009688; text-align: center; margin-bottom: 30px;">📅 New Appointment Request Received</h2>

                <p style="margin-bottom: 10px;"><strong>Name:</strong> ${data.name}</p>
                <p style="margin-bottom: 10px;"><strong>Email:</strong> ${data.email}</p>
                <p style="margin-bottom: 10px;"><strong>Phone:</strong> ${data.phone}</p>
                <p style="margin-bottom: 10px;"><strong>Department:</strong> ${finalData?.department?.title}</p>
                <p style="margin-bottom: 10px;"><strong>Preferred Doctor:</strong> ${finalData?.doctor?.name}</p>
                <p style="margin-bottom: 10px;"><strong>Preferred Date:</strong> ${new Date(finalData.date).toLocaleString()}</p>
                <p style="margin-bottom: 20px;"><strong>Health Concern:</strong><br> ${finalData?.message}</p>

                <hr style="border: none; border-top: 1px solid #dddddd; margin: 30px 0;">

                <p style="font-size: 14px; color: #555;">This appointment request was submitted through the ${process.env.SITE_NAME} website.</p>

                <div style="text-align: center; margin-top: 30px; font-size: 13px; color: #999;">
                © 2025 MediLab | <a href="${process.env.SITE_DOMAIN_FULL}" style="color: #0066cc; text-decoration: none;">${process.env.SITE_DOMAIN}</a>
                </div>
                
            </div>
            `
        })

        res.redirect("/appointment-confirmation")
    } catch (error) {
        console.log(error)
        res.render("appointment-page", {
            title: `${process.enAME} - Appointment`,
            currentUrl: "/appointment",
            testimonials: await getTestimonial(),
            faqs: await getFaq(5),
            doctors: await getDoctor(),
            departments: await getDepartment(),
            message: "Something Went Wrong. Please Try After Some Time",
            session: req.session
        })
    }

}

async function appointmentConfirmationPage(req, res) {
    res.render("appointment-confirmation-page", {
        title: `${process.env.SITE_NAME} - Appointment Confirmation`,
        currentUrl: "/appointment-confirmation",
        message: "Your Appontment Has Been Scheduled. Thank You",
        session: req.session
    })
}


async function departmentPage(req, res) {
    res.render("department-page", {
        title: `${process.env.SITE_NAME} - Department`,
        currentUrl: "/department",
        departments: await getDepartment(),
        doctors: await getDoctor(4),
        testimonials: await getTestimonial(),
        session: req.session
    })
}

async function doctorPage(req, res) {
    res.render("doctor-page", {
        title: `${process.env.SITE_NAME} - Doctor`,
        currentUrl: "/doctor",
        doctors: await getDoctor(),
        faqs: await getFaq(5),
        testimonials: await getTestimonial(),
        session: req.session
    })
}

async function faqPage(req, res) {
    res.render("faq-page", {
        title: `${process.env.SITE_NAME} - Faq`,
        currentUrl: "/faq",
        faqs: await getFaq(),
        testimonials: await getTestimonial(),
        session: req.session
    })
}

async function testimonialPage(req, res) {
    res.render("testimonial-page", {
        title: `${process.env.SITE_NAME} - Testimonial`,
        currentUrl: "/testimonial",
        testimonials: await getTestimonial(),
        session: req.session
    })
}

async function galleryPage(req, res) {
    res.render("gallery-page", {
        title: `${process.env.SITE_NAME} - Gallery`,
        currentUrl: "/gallery",
        gallery: await getGallery(),
        session: req.session
    })
}

async function contactusPage(req, res) {
    res.render("contactus-page", {
        title: `${process.env.SITE_NAME} - Conatct Us`,
        currentUrl: "/contactus",
        testimonials: await getTestimonial(),
        message: "",
        session: req.session
    })
}

async function contactusStorePage(req, res) {
    try {
        var data = new ContactUs(req.body)
        await data.save()

        mailer.sendMail({
            from: process.env.MAIL_SENDER,
            to: data.email,
            subject: `Thank You for Contacting ${process.env.SITE_NAME} - We've Received Your Message`,
            html: `
                <h2 style="text-align: center; color: #0066cc;">Thank You for Contacting ${process.env.SITE_NAME}</h2>
                <p style="margin-bottom: 15px;">Dear <strong>${data.name}</strong>,</p>
                
                <p style="margin-bottom: 15px;">Thank you for reaching out to <strong>${process.env.SITE_NAME}</strong>. We have successfully received your message and our team is reviewing your query.</p>
                
                <p style="margin-bottom: 15px;">One of our representatives will get back to you shortly with the necessary information or next steps. We aim to respond within 24 hours, and often even sooner.</p>
                
                <div style="background-color: #f1f1f1; padding: 15px; border-radius: 6px; margin-top: 20px; margin-bottom: 20px;">
                <p style="margin: 5px 0;"><strong>Name:</strong> ${data.name}</p>
                <p style="margin: 5px 0;"><strong>Email:</strong> ${data.email}</p>
                <p style="margin: 5px 0;"><strong>Subject:</strong> ${data.subject}</p>
                <p style="margin: 5px 0;"><strong>Message:</strong><br> ${data.message}</p>
                </div>
                
                <p style="margin-bottom: 15px;">If your inquiry is urgent, feel free to call us directly at <strong>${process.env.SITE_PHONE}</strong>.</p>
                
                <p style="margin-bottom: 30px;">Thank you for choosing ${process.env.SITE_NAME}. We're here to support your health with expert care and compassion.</p>
                
                <div style="font-size: 14px; color: #777777; text-align: center;">
                Warm regards,<br>
                <strong>${process.env.SITE_NAME} Team</strong><br>
                <a href="${process.env.SITE_DOMAIN_FULL}" style="color: #0066cc; text-decoration: none;">${process.env.SITE_DOMAIN}</a><br>
                contact@${process.env.SITE_EMAIL}
                </div>
            `
        })
        mailer.sendMail({
            from: process.env.MAIL_SENDER,
            to: process.env.MAIL_SENDER,
            subject: `New Contact Us Query Recieved : Team ${process.env.SITE_NAME}`,
            html: `
                <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; padding: 30px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                    <h2 style="color: #cc0000; text-align: center; margin-bottom: 30px;">📥 New Contact Us Query Received</h2>
                    <p style="margin-bottom: 10px;"><strong>Name:</strong> ${data.name}</p>
                    <p style="margin-bottom: 10px;"><strong>Email:</strong> ${data.email}</p>
                    <p style="margin-bottom: 10px;"><strong>Phone:</strong>${data.phone}</p>
                    <p style="margin-bottom: 10px;"><strong>Subject:</strong> ${data.subject}</p>
                    <p style="margin-bottom: 20px;"><strong>Message:</strong><br> ${data.message}</p>

                    <hr style="border: none; border-top: 1px solid #dddddd; margin: 30px 0;">

                    <p style="font-size: 14px; color: #555;">This message was automatically sent from the ${process.env.SITE_NAME} website Contact Us form.</p>

                    <div style="text-align: center; margin-top: 30px; font-size: 13px; color: #999;">
                    © 2025 ${process.env.SITE_NAME} | <a href="${process.env.SITE_DOMAIN_FULL}" style="color: #0066cc; text-decoration: none;">${process.env.SITE_DOMAIN}</a>
                    </div>
                    
                </div>
            `
        })

        res.render("contactus-page", {
            title: `${process.env.SITE_NAME} - Conatct Us`,
            currentUrl: "/contactus",
            testimonials: await getTestimonial(),
            message: "Thank You. We Recieved Your Query. Our Team Will Contact You Soon",
            session: req.session
        })
    } catch (error) {
        res.render("contactus-page", {
            title: `${process.env.SITE_NAME} - Conatct Us`,
            currentUrl: "/contactus",
            testimonials: await getTestimonial(),
            message: "Something Went Wrong. Please Try Again After Some Time",
            session: req.session
        })
    }
}


async function newsletterSubscription(req, res) {
    try {
        var data = new Newsletter(req.body)
        await data.save()

        mailer.sendMail({
            from: process.env.MAIL_SENDER,
            to: data.email,
            subject: `Thank You for Subscribing - ${process.env.SITE_NAME} Newsletter `,
            html: `
                 <div style="max-width: 600px; margin: auto; background-color: #ffffff; padding: 30px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">

                <h2 style="text-align: center; color: #009688; margin-bottom: 20px;">🎉 Welcome to the MediLab Newsletter!</h2>

                <p style="margin-bottom: 15px;">Thank you for subscribing to <strong>${process.env.SITE_NAME} Newsletter</strong>! We’re thrilled to have you as part of our healthcare community.</p>

                <p style="margin-bottom: 15px;">From expert health tips and wellness insights to the latest updates from our departments and doctors — you'll now be among the first to know.</p>

                <p style="margin-bottom: 20px;">We promise to send only helpful and relevant content — no spam, ever!</p>

                <div style="text-align: center; margin: 30px 0;">
                <a href="${process.env.SITE_DOMAIN_FULL}" style="padding: 10px 20px; background-color: #009688; color: #ffffff; text-decoration: none; border-radius: 4px; font-weight: bold;">Visit Our Website</a>
                </div>

                <p style="font-size: 14px; color: #555; text-align: center;">Stay connected with us for better health, every day.</p>

                <div style="text-align: center; font-size: 13px; color: #999; margin-top: 30px;">
                © 2025 MediLab | <a href="${process.env.SITE_DOMAIN_FULL}" style="color: #0066cc; text-decoration: none;">${process.env.SITE_DOMAIN}</a> | contact@${process.env.SITE_DOMAIN}
                </div>

            </div>
            `
        })

        res.render("newsletter-subscription-confirmation-page.hbs", {
            title: `${process.env.SITE_NAME} - Newsletter Subscription Confirmation`,
            currentUrl: "/newsletter-subscription",
            message: "Thanks to Subscribe Our Newsletter Service. Now We Can Send Emails Regarding Various Services and Features",
            session: req.session
        })


    } catch (error) {
        res.render("newsletter-subscription-confirmation-page.hbs", {
            title: `${process.env.SITE_NAME} - Newsletter Subscription Confirmation`,
            currentUrl: "/newsletter-subscription",
            message: "Your Email Address is Already Registered With Us",
            session: req.session
        })
    }
}

async function forgetPasword1(req, res) {
    res.render("forget-password1-page.hbs", {
        title: `${process.env.SITE_NAME} - Reset Password`,
        currentUrl: "/forget-password-1",
        errorMessage: "",
        session: req.session
    })
}

async function forgetPasword1Store(req, res) {
    try {
        let data = await User.findOne({
            $or: [
                { username: req.body.username },
                { email: req.body.username }
            ]
        })
        if (data) {
            req.session.reset_password_username = req.body.username
            let otp = Number(Number(Math.random().toString().slice(2, 7)).toString().padEnd(6, "1"))
            data.otp = otp
            await data.save()

            mailer.sendMail({
                from: process.env.MAIL_SENDER,
                to: data.email,
                subject: `Password Reset OTP - ${process.env.SITE_NAME} Newsletter `,
                html: `
                      <div style="max-width: 600px; margin: auto; background-color: #ffffff; padding: 30px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">

                        <h2 style="text-align: center; color: #0066cc; margin-bottom: 20px;">🔐 Password Reset Request</h2>

                        <p style="font-size: 16px; margin-bottom: 15px;">Hi <strong>${data.name}</strong>,</p>

                        <p style="margin-bottom: 15px;">We received a request to reset your password for your <strong>${process.env.SITE_NAME}</strong> account. Please use the following One-Time Password (OTP) to proceed:</p>

                        <div style="text-align: center; margin: 30px 0;">
                        <p style="font-size: 24px; font-weight: bold; color: #009688; letter-spacing: 2px;">${otp}</p>
                        </div>

                        <p style="margin-bottom: 15px;">This OTP is valid for the next <strong>10 minutes</strong>. If you did not request a password reset, you can safely ignore this email.</p>

                        <p style="font-size: 14px; color: #555;">Thank you for choosing ${process.env.SITE_NAME}. We're here to support your healthcare needs with safety and trust.</p>

                        <div style="text-align: center; font-size: 13px; color: #999; margin-top: 30px;">
                        © 2025 ${process.env.SITE_NAME} | <a href="${process.env.SITE_DOMAIN_FULL}" style="color: #0066cc; text-decoration: none;">${process.env.SITE_DOMAIN}</a> | contact@${process.env.SITE_EMAIL}
                        </div>

                    </div>
                `
            })
            res.redirect("/forget-password-2")
        }
        else
            res.render("forget-password1-page.hbs", {
                title: `${process.env.SITE_NAME} - Reset Password`,
                currentUrl: "/forget-password-1",
                errorMessage: "User Not Found. Please Enter Registered Username or Email Address",
                session: req.session
            })
    } catch (error) {
        res.render("forget-password1-page.hbs", {
            title: `${process.env.SITE_NAME} - Reset Password`,
            currentUrl: "/forget-password-1",
            errorMessage: "Something Went Wrong. Please Try After Some Time",
            session: req.session
        })
    }
}

async function forgetPasword2(req, res) {
    res.render("forget-password2-page.hbs", {
        title: `${process.env.SITE_NAME} - Reset Password`,
        currentUrl: "/forget-password-2",
        errorMessage: "",
        session: req.session
    })
}

async function forgetPasword2Store(req, res) {
    try {
        let data = await User.findOne({
            $or: [
                { username: req.session.reset_password_username },
                { email: req.session.reset_password_username }
            ]
        })
        console.log(req.body)
        if (data) {
            if (data.otp == req.body.otp)
                res.redirect("/forget-password-3")
            else
                res.render("forget-password1-page.hbs", {
                    title: `${process.env.SITE_NAME} - Reset Password`,
                    currentUrl: "/forget-password-2",
                    errorMessage: "Invalid OTP",
                    session: req.session
                })
        }
        else
            res.render("forget-password2-page.hbs", {
                title: `${process.env.SITE_NAME} - Reset Password`,
                currentUrl: "/forget-password-2",
                errorMessage: "Un-authorized Activity",
                session: req.session
            })
    } catch (error) {
        res.render("forget-password2-page.hbs", {
            title: `${process.env.SITE_NAME} - Reset Password`,
            currentUrl: "/forget-password-1",
            errorMessage: "Something Went Wrong. Please Try After Some Time",
            session: req.session
        })
    }
}


async function forgetPasword3(req, res) {
    res.render("forget-password3-page.hbs", {
        title: `${process.env.SITE_NAME} - Reset Password`,
        currentUrl: "/forget-password-3",
        errorMessage: "",
        session: req.session
    })
}

async function forgetPasword3Store(req, res) {
    try {
        let data = await User.findOne({
            $or: [
                { username: req.session.reset_password_username },
                { email: req.session.reset_password_username }
            ]
        })
        if (data) {
            if (req.body.password === req.body.cpassword) {
                if (schema.validate(req.body.password)) {
                    bcrypt.hash(req.body.password, 12, async (error, hash) => {
                        data.password = hash
                        await data.save()
                        delete req.session.reset_password_username
                        res.redirect("/login")
                    })
                }
                else
                    res.render("forget-password3-page.hbs", {
                        title: `${process.env.SITE_NAME} - Reset Password`,
                        currentUrl: "/forget-password-3",
                        errorMessage: "nvalid Password. Password Must Contains Alteast 1 Upper Case Character, 1 Lower Case Character, 1 Digit and Length Must be 8-100 Character",
                        session: req.session
                    })
            }
            else {
                res.render("forget-password3-page.hbs", {
                    title: `${process.env.SITE_NAME} - Reset Password`,
                    currentUrl: "/forget-password-3",
                    errorMessage: "Password and Confirm Password Doesn't Matched",
                    session: req.session
                })
            }
        }
        else
            res.render("forget-password3-page.hbs", {
                title: `${process.env.SITE_NAME} - Reset Password`,
                currentUrl: "/forget-password-3",
                errorMessage: "Un-authorized Activity",
                session: req.session
            })
    } catch (error) {
        res.render("forget-password3-page.hbs", {
            title: `${process.env.SITE_NAME} - Reset Password`,
            currentUrl: "/forget-password-3",
            errorMessage: "Something Went Wrong. Please Try After Some Time",
            session: req.session
        })
    }
}

module.exports = {
    homePage: homePage,
    aboutPage: aboutPage,
    servicePage: servicePage,
    showServicePage: showServicePage,
    appointmentPage: appointmentPage,
    departmentPage: departmentPage,
    doctorPage: doctorPage,
    faqPage: faqPage,
    testimonialPage: testimonialPage,
    galleryPage: galleryPage,
    contactusPage: contactusPage,
    contactusStorePage: contactusStorePage,
    newsletterSubscription: newsletterSubscription,
    getDepartment: getDepartment,
    createAppointmentPage: createAppointmentPage,
    appointmentConfirmationPage: appointmentConfirmationPage,
    loginPage: loginPage,
    loginStorePage: loginStorePage,
    logoutPage: logoutPage,
    forgetPasword1: forgetPasword1,
    forgetPasword2: forgetPasword2,
    forgetPasword3: forgetPasword3,
    forgetPasword1Store: forgetPasword1Store,
    forgetPasword2Store: forgetPasword2Store,
    forgetPasword3Store: forgetPasword3Store,
}