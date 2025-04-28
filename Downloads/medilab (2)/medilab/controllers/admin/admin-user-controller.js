const fs = require("fs")
const User = require("../../models/User")
const passwordValidator = require("password-validator")
const bcrypt = require("bcrypt")


const { getDepartment } = require("../main/index")

var schema = new passwordValidator();
schema
    .is().min(8)                                    // Minimum length 8
    .is().max(100)                                  // Maximum length 100
    .has().uppercase(1)                             // Must have at least 1 uppercase letter
    .has().lowercase(1)                             // Must have at least 1 lowercase letter
    .has().digits(1)                                // Must have at least 1 digits
    .has().not().spaces()                           // Should not have spaces
    .is().not().oneOf(['Passw0rd', 'Password123']); // Blacklist these values
async function indexPage(req, res) {
    try {
        let data = await User.find().sort({ "_id": -1 })
        res.render("admin/user/index", {
            title: `${process.env.SITE_NAME} - Admin Page`,
            currentUrl: '/admin',
            data: data,
            session: req.session
        })
    } catch (error) {
        console.log(error)
    }
}

async function createPage(req, res) {
    res.render("admin/user/create", {
        title: `${process.env.SITE_NAME} - Admin Page`,
        currentUrl: '/admin',
        errorMessage: {},
        data: {},
        departments: await getDepartment(),
        session: req.session
    })
}

async function storePage(req, res) {
    try {
        var data = new User(req.body)
        if (req.body.password === req.body.cpassword) {
            if (schema.validate(req.body.password)) {
                bcrypt.hash(req.body.password, 12, async (error, hash) => {
                    data.createdBy = req.session.name
                    data.password = hash
                    await data.save()
                    res.redirect("/admin/user")
                })
            }
            else
                res.render("admin/user/create", {
                    title: `${process.env.SITE_NAME} - Admin Page`,
                    currentUrl: '/admin',
                    errorMessage: { password: "Invalid Password. Password Must Contains Alteast 1 Upper Case Character, 1 Lower Case Character, 1 Digit and Length Must be 8-100 Character" },
                    data: data,
                    departments: await getDepartment(),
                    session: req.session
                })
        }
        else {
            res.render("admin/user/create", {
                title: `${process.env.SITE_NAME} - Admin Page`,
                currentUrl: '/admin',
                errorMessage: { password: "Password and Confirm Password Doesn't Matched" },
                data: data,
                departments: await getDepartment(),
                session: req.session
            })
        }
    } catch (error) {
        let errorMessage = {}
        error?.keyValue?.username ? errorMessage.username = "Username Already Taken" : null
        error?.keyValue?.email ? errorMessage.title = "Email Address Already Taken" : null
        error?.errors?.name ? errorMessage.name = error.errors.name.message : null
        error?.errors?.username ? errorMessage.username = error.errors.username.message : null
        error?.errors?.email ? errorMessage.email = error.errors.email.message : null
        error?.errors?.phone ? errorMessage.phone = error.errors.phone.message : null
        error?.errors?.password ? errorMessage.password = error.errors.password.message : null

        // console.log(data)
        res.render("admin/user/create", {
            title: `${process.env.SITE_NAME} - Admin Page`,
            currentUrl: '/admin',
            errorMessage: errorMessage,
            data: data,
            departments: await getDepartment(),
            session: req.session
        })
    }
}

async function deletePage(req, res) {
    try {
        let data = await User.findOne({ _id: req.params._id })
        if (data) {
            try {
                fs.unlinkSync(data.pic)
            } catch (error) { }
            await data.deleteOne()
        }
        res.redirect("/admin/user")
    } catch (error) {
        console.log(error)
        res.redirect("/admin/user")
    }
}

async function editPage(req, res) {
    try {
        let data = await User.findOne({ _id: req.params._id })
        if (data) {
            res.render("admin/user/edit", {
                title: `${process.env.SITE_NAME} - Admin Page`,
                currentUrl: '/admin',
                data: data,
                errorMessage: {},
                departments: await getDepartment(),
                session: req.session
            })
        }
        else
            res.redirect("/admin/user")
    } catch (error) {
        console.log(error)
        res.redirect("/admin/user")
    }
}

async function updatePage(req, res) {
    try {
        var data = await User.findOne({ _id: req.params._id })
        if (data) {
            data.name = req.body.name
            data.username = req.body.username
            data.email = req.body.email
            data.phone = req.body.phone
            data.role = req.body.role
            data.active = req.body.active

            data.updatedBy.push({
                user: req.session.name,
                time: new Date()
            })
            await data.save()
        }
        res.redirect("/admin/user")
    } catch (error) {
        let errorMessage = {}
        error?.keyValue?.username ? errorMessage.username = "Username Already Taken" : null
        error?.keyValue?.email ? errorMessage.title = "Email Address Already Taken" : null
        error?.errors?.name ? errorMessage.name = error.errors.name.message : null
        error?.errors?.username ? errorMessage.username = error.errors.username.message : null
        error?.errors?.email ? errorMessage.email = error.errors.email.message : null
        error?.errors?.phone ? errorMessage.phone = error.errors.phone.message : null
        error?.errors?.password ? errorMessage.password = error.errors.password.message : null


        res.render("admin/user/edit", {
            title: `${process.env.SITE_NAME} - Admin Page`,
            currentUrl: '/admin',
            errorMessage: errorMessage,
            data: data,
            departments: await getDepartment(),
            session: req.session
        })
    }
}

async function editProfilePage(req, res) {
    try {
        let data = await User.findOne({ _id: req.session.userid })
        if (data) {
            res.render("admin/user/update-profile", {
                title: `${process.env.SITE_NAME} - Admin Page`,
                currentUrl: '/admin/update-profile',
                data: data,
                errorMessage: {},
                session: req.session
            })
        }
        else
            res.redirect("/admin")
    } catch (error) {
        console.log(error)
        res.redirect("/admin")
    }
}

async function updateProfilePage(req, res) {
    try {
        var data = await User.findOne({ _id: req.session.userid })
        if (data) {
            data.name = req.body.name
            data.username = req.body.username
            data.email = req.body.email
            data.phone = req.body.phone

            if (await data.save() && req.file) {
                try {
                    fs.unlinkSync(data.pic)
                } catch (error) { }
                data.pic = req.file.path
            }
            await data.save()
        }
        res.redirect("/admin")
    } catch (error) {
        console.log(error)

        try {
            if (req.file)
                fs.unlinkSync(req.file.path)
        } catch (error) {
            console.log(error)
        }


        let errorMessage = {}
        error?.keyValue?.username ? errorMessage.username = "Username Already Taken" : null
        error?.keyValue?.email ? errorMessage.title = "Email Address Already Taken" : null
        error?.errors?.name ? errorMessage.name = error.errors.name.message : null
        error?.errors?.username ? errorMessage.username = error.errors.username.message : null
        error?.errors?.email ? errorMessage.email = error.errors.email.message : null
        error?.errors?.phone ? errorMessage.phone = error.errors.phone.message : null


        res.render("admin/user/update-profile", {
            title: `${process.env.SITE_NAME} - Admin Page`,
            currentUrl: '/admin/update-profile',
            errorMessage: errorMessage,
            data: data,
            session: req.session
        })
    }
}

module.exports = {
    indexPage: indexPage,
    createPage: createPage,
    storePage: storePage,
    deletePage: deletePage,
    editPage: editPage,
    updatePage: updatePage,
    editProfilePage: editProfilePage,
    updateProfilePage: updateProfilePage
}