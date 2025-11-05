import express from "express";
const router = express.Router();
import { login, register } from "../controllers/authController.js";
import { loginLimiter } from "../middleware/authMiddleware.js";

router.post("/register", register);
router.post("/login", loginLimiter, login);

export default router;
