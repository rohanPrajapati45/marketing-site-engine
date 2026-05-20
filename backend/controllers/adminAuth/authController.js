import adminModel from "../../models/adminAuth/adminModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";
import { generateOTP } from "../../config/otp.js";
import { Resend } from 'resend';
import { logActivity, logActivityDirect } from "../../utils/activityLogger.js";

// ── OTP-based Login Flow ──
export const sendLoginOtp = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({ message: "Email is required" });
        }
        const admin = await adminModel.findOne({ email });
        if (!admin) {
            // Return same message to avoid email enumeration
            return res.status(200).json({ message: "If the email is registered, an OTP has been sent" });
        }
        const otp = generateOTP();
        const otpExpiry = Date.now() + 5 * 60 * 1000;
        admin.otp = otp;
        admin.otpExpiry = otpExpiry;
        await admin.save();
        const resend = new Resend(process.env.RESEND_API_KEY);
        await resend.emails.send({
            from: 'onboarding@resend.dev',
            to: email,
            subject: 'Admin Login OTP',
            html: `<p>Your login OTP is <strong>${otp}</strong>. It is valid for 5 minutes.</p>`,
        });
        return res.status(200).json({ message: "If the email is registered, an OTP has been sent" });
    } catch (error) {
        return res.status(500).json({ message: "Failed to send login OTP", error: error.message });
    }
};

export const verifyLoginOtp = async (req, res) => {
    try {
        const { email, otp } = req.body;
        if (!email || !otp) {
            return res.status(400).json({ message: "Email and OTP are required" });
        }
        const admin = await adminModel.findOne({ email });
        if (!admin) {
            return res.status(400).json({ message: "Invalid email or OTP" });
        }
        if (admin.otp !== otp) {
            return res.status(400).json({ message: "Invalid email or OTP" });
        }
        if (Date.now() > admin.otpExpiry) {
            return res.status(400).json({ message: "OTP has expired" });
        }
        admin.otp = undefined;
        admin.otpExpiry = undefined;
        await admin.save();
        const token = jwt.sign({ id: admin._id, email: admin.email, isMainAdmin: admin.isMainAdmin }, process.env.JWT_SECRET, { expiresIn: "1d" });
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 24 * 60 * 60 * 1000,
        });
        await logActivityDirect({
            adminId: admin._id,
            adminEmail: admin.email,
            action: "auth.login",
            entityType: "admin",
            entityId: admin._id.toString(),
            summary: "Admin logged in",
        });
        return res.status(200).json({ message: "Login successful", admin: { email: admin.email, isMainAdmin: admin.isMainAdmin } });
    } catch (error) {
        return res.status(500).json({ message: "Failed to verify login OTP", error: error.message });
    }
};

// ── Get current admin (auth persistence) ──
export const getMe = async (req, res) => {
    try {
        const admin = await adminModel.findById(req.admin.id).select('-password -otp -otpExpiry');
        if (!admin) {
            return res.status(404).json({ message: "Admin not found" });
        }
        return res.status(200).json({ message: "Admin found", admin: { email: admin.email, isMainAdmin: admin.isMainAdmin } });
    } catch (error) {
        return res.status(500).json({ message: "Failed to get admin", error: error.message });
    }
};

export const listAdmins = async (req, res) => {
    try {
        if (!req.admin.isMainAdmin) {
            return res.status(403).json({ message: "Access denied" });
        }

        const admins = await adminModel
            .find({}, { email: 1, isMainAdmin: 1, createdAt: 1 })
            .sort({ createdAt: -1 });

        return res.status(200).json({ admins });
    } catch (error) {
        return res.status(500).json({ message: "Failed to load admins", error: error.message });
    }
};

export const deleteAdmin = async (req, res) => {
    try {
        if (!req.admin.isMainAdmin) {
            return res.status(403).json({ message: "Access denied" });
        }

        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ message: "Admin id is required" });
        }

        const target = await adminModel.findById(id);
        if (!target) {
            return res.status(404).json({ message: "Admin not found" });
        }

        if (target.isMainAdmin) {
            return res.status(400).json({ message: "Main admin cannot be deleted" });
        }

        await adminModel.deleteOne({ _id: target._id });

        await logActivity(req, {
            action: "admin.delete",
            entityType: "admin",
            entityId: target._id.toString(),
            summary: `Deleted admin ${target.email}`,
        });

        return res.status(200).json({ message: "Admin deleted" });
    } catch (error) {
        return res.status(500).json({ message: "Failed to delete admin", error: error.message });
    }
};

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
        await logActivity(req, {
            action: "admin.create",
            entityType: "admin",
            entityId: newAdmin._id.toString(),
            summary: `Created admin ${newAdmin.email}`,
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
        const token = jwt.sign({ id: admin._id, email: admin.email, isMainAdmin: admin.isMainAdmin }, process.env.JWT_SECRET, { expiresIn: "1d" });
        res.cookie("token", token, {
            httpOnly: true,
            secure : process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 24 * 60 * 60 * 1000,
        });
        await logActivityDirect({
            adminId: admin._id,
            adminEmail: admin.email,
            action: "auth.login",
            entityType: "admin",
            entityId: admin._id.toString(),
            summary: "Admin logged in",
        });
        res.status(200).json({ message: "Admin logged in successfully", admin: { email: admin.email, isMainAdmin: admin.isMainAdmin } });
    }
    catch(error){
        res.status(500).json({ message: "Failed to login admin", error: error.message });
    }
}

export const logoutAdmin = async (req, res) => {
    try{
        res.clearCookie("token", {
            httpOnly: true,
            secure : process.env.NODE_ENV === "production",
            sameSite: "strict",
        });
        await logActivity(req, {
            action: "auth.logout",
            entityType: "admin",
            entityId: req.admin?.id,
            summary: "Admin logged out",
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