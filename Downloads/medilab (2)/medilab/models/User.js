const mongoose = require("mongoose")

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Name is Mendatory"]
    },
    username: {
        type: String,
        required: [true, "Username is Mendatory"],
        unique: true
    },
    email: {
        type: String,
        required: [true, "Email Address is Mendatory"],
        unique: true
    },
    phone: {
        type: String,
        required: [true, "Phone Number is Mendatory"]
    },
    role: {
        type: String,
        default: "Admin"
    },
    pic: {
        type: String,
        default: ""
    },
    password: {
        type: String,
        required: [true, "Password is Mendatory"]
    },
    active: {
        type: Boolean,
        default: true
    },
    createdBy: {
        type: String,
        default: ""
    },
    otp: {
        type: Number,
        default: -123454321
    },
    updatedBy: [
        {
            user: {
                type: String,
                default: ""
            },
            time: {
                type: String,
                default: ""
            }
        }
    ]
}, { timestamps: true })

const User = new mongoose.model("User", UserSchema)

module.exports = User