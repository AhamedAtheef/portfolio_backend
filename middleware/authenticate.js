import jwt from "jsonwebtoken";
import USER from "../models/user.js";

export const isAuthenticated = async (req, res, next) => {
    try {
        const token = req.cookies.token;

        if (!token) {
            return res.status(401).json({ success: false, message: "Unauthorized — No token" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (!decoded) {
            return res.status(401).json({ success: false, message: "Unauthorized - user not found" });
        }
        const user = await USER.findById(decoded.userId);
        if (!user) {
            return res.status(401).json({ success: false, message: "Unauthorized — User not found" });
        }

        req.user = user;
        next();
    } catch (error) {
        return res.status(500).json({ success: false, message: "internal server error" });
    }
};