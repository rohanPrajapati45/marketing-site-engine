import adminModel from "../../models/adminAuth/adminModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";
import { generateOTP } from "../../config/otp.js";
import { Resend } from 'resend';

export const registerAdmin = async (req, res) => {
    try{
        if (!req.admin.isMainAdmin) {
            return res.status(403).json({ message: "Access denied" });
        }
        const { email, password } = req.body;
        const exists = await adminModel.findOne({ email });
        if (exists) {
            return res.status(400).json({ message: "Admin already exists" });
        }

        const newAdmin = await adminModel.create({
            email,
            password: await bcrypt.hash(password, 10),
            isMainAdmin: false,
        });
        res.status(201).json({ message: "Admin registered successfully", admin: newAdmin.email });
    }
    catch(error){
        res.status(500).json({ message: "Failed to register admin", error: error.message });
    }
};

export const loginAdmin = async (req, res) => {
    try{
        const { email, password } = req.body;
        if(!email || !password){
            return res.status(400).json({ message: "Email and password are required" });
        }
        const admin = await adminModel.findOne({ email });
        if (!admin) {
            return res.status(404).json({ message: "incorrect email or password" });
        }
        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) {
            return res.status(400).json({ message: "incorrect email or password" });
        }
        const token = jwt.sign({ id: admin._id, isMainAdmin: admin.isMainAdmin }, process.env.JWT_SECRET, { expiresIn: "1d" });
        res.cookie("token", token, {
            httpOnly: true,
            secure : process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 24 * 60 * 60 * 1000,
        });
        res.status(200).json({ message: "Admin logged in successfully"});
    }
    catch(error){
        res.status(500).json({ message: "Failed to login admin", error: error.message });
    }
}

export const logoutAdmin = (req, res) => {
    try{
        res.clearCookie("token", {
            httpOnly: true,
            secure : process.env.NODE_ENV === "production",
            sameSite: "strict",
        });
        res.status(200).json({ message: "Admin logged out successfully" });
    }
    catch(error){
        res.status(500).json({ message: "Failed to logout admin", error: error.message });
    }
}

export const forgotPassword = async (req, res) => {
    try{
        const { email } = req.body;
        const admin = await adminModel.findOne({ email });
        if (!admin) {
            return res.status(404).json({ message: "if it's a validdd email then otp is Send to that mail" });
        }
        // Generate OTP and send email logic here
        const otp = generateOTP();
        const otpExpiry = Date.now() + 5 * 60 * 1000; 
        admin.otp = otp;
        admin.otpExpiry = otpExpiry;
        await admin.save();
        const resend = new Resend(process.env.RESEND_API_KEY);
        const data = await resend.emails.send({
            from: 'onboarding@resend.dev',
            to: 'ayushprajapati15806@gmail.com',
            subject: 'Reset Password OTP',
            html: `<p>Your OTP for resetting password is <strong>${otp}</strong>. It is valid for 5 minutes.</p>`,
        });
        console.log(data)
        return res.status(200).json({ message: "if it's a valid email then otp is Send to that mail" }); 
    }
    catch(error){
        res.status(500).json({ message: "Failed to process forgot password", error: error.message });
    }
};


export const verifyOTP = async (req, res) => {
    try {
        const { email, otp} = req.body;
        const admin = await adminModel.findOne({ email });
        if (!admin) {
            return res.status(404).json({ message: "Admin not found" });
        }
        if (admin.otp !== otp) {
            return res.status(400).json({ message: "Invalid OTP" });
        }
        if (Date.now() > admin.otpExpiry) {
            return res.status(400).json({ message: "OTP has expired" });
        }
        admin.otp = undefined;
        admin.otpExpiry = undefined;
        await admin.save();
        res.status(200).json({ message: "OTP verified successfully" });
    }
    catch (error) {
        res.status(500).json({ message: "Failed to verify OTP", error: error.message });
    }
};

export const resetPassword = async (req, res) => {
    try {
        const { email, newPassword } = req.body;
        const admin = await adminModel.findOne({ email });
        if (!admin) {
            return res.status(404).json({ message: "Admin not found" });
        }
        admin.password = await bcrypt.hash(newPassword, 10);
        await admin.save();
        res.status(200).json({ message: "Password reset successfully" });
    }
    catch (error) {
        res.status(500).json({ message: "Failed to reset password", error: error.message });
    }
};