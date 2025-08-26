import jwt from "jsonwebtoken";

export default function secureRoute(req, res, next) {
  try {
    const token = req.cookies?.jwt;
    if (!token) return res.status(401).json({ error: "Unauthorized" });

    const decoded = jwt.verify(token, process.env.JWT_TOKEN);
    req.userId = decoded.userId;
    next();
  } catch (e) {
    console.error("secureRoute error:", e.message);
    res.status(401).json({ error: "Invalid or expired token" });
  }
}