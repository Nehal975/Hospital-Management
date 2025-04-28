const mongoose = require("mongoose")

const TestimonialSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Testimonial Name is Mendatory"]
    },
    pic: {
        type: String,
        required: [true, "Testimonial Pic is Mendatory"]
    },
    message: {
        type: String,
        required: [true, "Testimonial Message is Mendatory"]
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

const Testimonial = new mongoose.model("Testimonial", TestimonialSchema)

module.exports = Testimonial