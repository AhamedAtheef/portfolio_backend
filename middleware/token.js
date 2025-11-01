import jwt from "jsonwebtoken";

export async function genarateToken(userId, res) {
    const token = jwt.sign({ userId }, process.env.JWT_SECRET);

    res.cookie("token", token, {
        httpOnly: true,
        secure: true,       // ✅ Render uses HTTPS
        sameSite: "none",   // ✅ allow cross-origin cookies (localhost ↔ render)
    });

    return token;
}