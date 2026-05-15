import mongoose from "mongoose";

const adminSchema = new mongoose.Schema({
    email : {
        type: String,
        email: true,
        required: true,
        unique: true,
    },
    password : {
        type: String,
        required: true,
    }, 
    isMainAdmin : {
        type: Boolean,
        default: false,
    },
    otp : {
        type: String,
    },
    otpExpiry : {
        type: Date,
    }
}, {timestamps: true});

export default mongoose.model("adminModel", adminSchema);
    