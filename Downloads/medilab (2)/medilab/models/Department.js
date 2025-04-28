const mongoose = require("mongoose")

const DepartmentSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, "Department Title is Mendatory"],
        unique: true
    },
    cover: {
        type: String,
        required: [true, "Department Cover Pic is Mendatory"]
    },
    description: {
        type: String,
        required: [true, "Department Long Description is Mendatory"]
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

const Department = new mongoose.model("Department", DepartmentSchema)

module.exports = Department