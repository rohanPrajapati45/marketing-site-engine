import adminModel from "../../models/adminAuth/adminModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";

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