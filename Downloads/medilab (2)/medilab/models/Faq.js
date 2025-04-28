const mongoose = require("mongoose")

const FaqSchema = new mongoose.Schema({
    question: {
        type: String,
        required: [true, "Faq Question is Mendatory"]
    },
    answer: {
        type: String,
        required: [true, "Faq Answer is Mendatory"]
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

const Faq = new mongoose.model("Faq", FaqSchema)

module.exports = Faq