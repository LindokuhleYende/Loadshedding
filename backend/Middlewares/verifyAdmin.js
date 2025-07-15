const jwt = require("jsonwebtoken");

const verifyAdmin = (req, res, next) => {
    const authHeader = req.headers.authorization;
    console.log("Auth Header:", authHeader); // 👈 Log this

    if (!authHeader) return res.status(401).json({ message: "Missing token" });

    const token = authHeader.split(" ")[1];
    if (!token) return res.status(401).json({ message: "Unauthorized: No token" });

    try {
        const decoded = jwt.verify(token, process.env.TOKEN_KEY);
        if (!decoded.isAdmin) return res.status(403).json({ message: "Access denied: Not admin" });

        req.user = decoded;
        next();
    } catch (err) {
        console.error("JWT Error:", err.message); // 👈 Log error reason
        res.status(401).json({ message: "Invalid token" });
    }
};


module.exports = verifyAdmin;
