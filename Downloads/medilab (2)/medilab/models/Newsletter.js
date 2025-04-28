const mongoose = require("mongoose")

const NewsletterSchema = new mongoose.Schema({
    email: {
        type: String,
        unique:true,
        required: [true, "Newsletter Name is Mendatory"]
    },
    active: {
        type: Boolean,
        default: true
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

const Newsletter = new mongoose.model("Newsletter", NewsletterSchema)

module.exports = Newsletter