const mongoose = require("mongoose")

const GallerySchema = new mongoose.Schema({
    pic: {
        type: String,
        required: [true, "Gallery Pic is Mendatory"]
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

const Gallery = new mongoose.model("Gallery", GallerySchema)

module.exports = Gallery