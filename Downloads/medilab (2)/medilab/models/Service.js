const mongoose = require("mongoose")

const ServiceSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, "Service Title is Mendatory"],
        unique: true
    },
    seoUrl: {
        type: String,
        required: [true, "Service SEO Url is Mendatory"],
        unique: true
    },
    icon: {
        type: String,
        required: [true, "Service Icon is Mendatory"]
    },
    cover: {
        type: String,
        required: [true, "Service Cover Pic is Mendatory"]
    },
    shortDescription: {
        type: String,
        required: [true, "Service Short Description is Mendatory"]
    },
    longDescription: {
        type: String,
        required: [true, "Service Long Description is Mendatory"]
    },
    metaTitle: {
        type: String,
        default: ""
    },
    metaDescription: {
        type: String,
        default: ""
    },
    metaKeywords: {
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

const Service = new mongoose.model("Service", ServiceSchema)

module.exports = Service