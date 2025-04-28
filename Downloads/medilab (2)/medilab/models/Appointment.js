const mongoose = require("mongoose")

const AppointmentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Name is Mendatory"]
    },
    email: {
        type: String,
        required: [true, "Email Address is Mendatory"]
    },
    phone: {
        type: String,
        required: [true, "Phone Number is Mendatory"]
    },
    date: {
        type: String,
        required: [true, "Date is Mendatory"]
    },
    department: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Department",
        required: [true, "Department is Mendatory"]
    },
    doctor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Doctor",
        required: [true, "Doctor is Mendatory"]
    },
    message: {
        type: String,
        required: [true, "Message is Mendatory"]
    },
    active: {
        type: Boolean,
        default: true
    }
}, { timestamps: true })

const Appointment = new mongoose.model("Appointment", AppointmentSchema)

module.exports = Appointment