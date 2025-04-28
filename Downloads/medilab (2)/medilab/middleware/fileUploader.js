const multer = require("multer")

function createUploader(folder) {
    const storage = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, 'public/uploads/' + folder)
        },
        filename: function (req, file, cb) {
            cb(null, Date.now() + file.originalname)
        }
    })
    return multer({ storage: storage })
}

module.exports = {
    serviceUploader: createUploader("service"),
    departmentUploader: createUploader("department"),
    doctorUploader: createUploader("doctor"),
    galleryUploader: createUploader("gallery"),
    testimonialUploader: createUploader("testimonial"),
    userUploader: createUploader("user"),
}
