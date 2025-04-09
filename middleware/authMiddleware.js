const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;
    console.log("🔐 Auth Header:", authHeader);

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "No token provided!" });
    }

    const token = authHeader.split(" ")[1];
    console.log("🔑 Token Extracted:", token);
    console.log("🔑 JWT_SECRET:", process.env.JWT_SECRET);

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log("✅ Decoded Token:", decoded);
        req.user = decoded;
        next();
    } catch (err) {
        console.error("❌ Token verification failed:", err.message);
        return res.status(401).json({ message: "Invalid or expired token!" });
    }
};

module.exports = authMiddleware;
