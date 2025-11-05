import jwt from "jsonwebtoken";
import rateLimit from "express-rate-limit";

export function authMiddleware(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Access denied. No token." });
  }

  try {
    const user = jwt.verify(token, process.env.JWT_SECRET);
    req.user = user;
    next();
  } catch {
    res.status(401).json({ message: "Invalid or expired token." });
  }
}

const limiter = rateLimit({
  windowMs: 2 * 60 * 1000,
  max: 5,
  message: {
    status: 429,
    error: "Too many login attempts. Please wait 2 minutes, then try again.",
  },
});
export async function loginLimiter(req, res, next) {
  try {
    limiter(req, res, next);
  } catch (error) {
    console.error("Rate limiter error:", error);
    res.status(500).json({ error: "Internal rate limit error" });
  }
}
