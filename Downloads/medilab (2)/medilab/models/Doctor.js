const mongoose = require("mongoose")

const DoctorSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Doctor Name is Mendatory"]
    },
    pic: {
        type: String,
        required: [true, "Doctor Pic is Mendatory"]
    },
    department: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Department",
        default: ""
    },
    designation: {
        type: String,
        required: [true, "Doctor Designation is Mendatory"]
    },
    description: {
        type: String,
        required: [true, "Doctor Description is Mendatory"]
    },
    twitter: {
        type: String,
        default: ""
    },
    facebook: {
        type: String,
        default: ""
    },
    instagram: {
        type: String,
        default: ""
    },
    linkedin: {
        type: String,
        default: ""
    },
    youtube: {
        type: String,
        default: ""
    },
    sortOrder: {
        type: Number,
        default: 10
    },
    active: {
        type: Boolean,
        default: true
    },
    createdBy: {
        type: String,
        default: ""
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

const Doctor = new mongoose.model("Doctor", DoctorSchema)

module.exports = Doctor