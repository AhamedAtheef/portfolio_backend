import { genarateToken } from "../middleware/token.js";
import USER from "../models/user.js";

export async function signup(req, res) {
    const { name, email, role, isAdmin } = req.body;
    try {
        const exsitingemail = await USER.findOne({ email });
        if (exsitingemail) {
            return res.status(400).json({ message: "Email already exsits" })
        }
        const user = await USER.create({ name, email, role, isAdmin });
        const token = await genarateToken(user._id, res);
        res.status(201).json({ user });
    } catch (error) {
        res.status(500).json({ message: error.message });
        console.log(error);
    }

}

export async function login(req, res) {
    const email = req.body.email;
    try {
        const user = await USER.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }
        const token = await genarateToken(user._id, res);
        res.status(200).json({
            success: true,
            isAdmin: user.isAdmin,
            user,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: "internal server error" });
    }

}

export async function checkAuth(req, res) {
    try {
        res.status(200).json({ success: true, message: "User is authenticated", user: req.user });
    } catch (error) {
        res.status(500).json({ success: false, message: "internal server error" });
    }
}

export async function adminvalidation(req, res) {
    try {

        if (!req.user || !req.user._id) {
            return res
                .status(401)
                .json({ success: false, message: "Unauthorized - No user data" });
        }

        const user = await USER.findById(req.user._id)

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }


       if(user.isAdmin){
        return res.status(200).json({
            success: true,
            message: "Admin validation successful",
            isAdmin: user.isAdmin,
        });
       }else{
        return res.status(401).json({
            success: false,
            message: "Unauthorized - User is not an admin",
        });
       }
    } catch (error) {
        console.error("Admin validation error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message,
        });
    }
}

