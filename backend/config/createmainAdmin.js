import adminModel from "../models/adminAuth/adminModel.js";
import bcrypt from "bcrypt";

export const createMainAdmin = async () => {
    const exists = await adminModel.findOne({ email: process.env.MAIN_ADMIN_EMAIL });
    if (exists) {
        console.log("Main admin already exists");
        return;
    }
    try{
        const mainAdmin = await adminModel.create({
            email: process.env.MAIN_ADMIN_EMAIL,
            password: await bcrypt.hash(process.env.MAIN_ADMIN_PASSWORD, 10),
            isMainAdmin: true,
        });
        console.log("Main admin created successfully", mainAdmin.email);
        return;
    }
    catch(error){
        console.error("Failed to create main admin", error.message);
        return;
    }
}