import jwt from "jsonwebtoken";
import data from "../models/User.js";
import bcrypt from "bcrypt";

function generateToken(dataId) {
  return jwt.sign({ id: dataId }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });
}

export async function register(req, res, next) {
  try {
    const { name, email, password } = req.body;

    // Check if user already exists
    const existingdata = await data.findOne({ email });
    if (existingdata) {
      return res.status(400).json({ message: "Email already in use" });
    }

    // Hash password using bcrypt
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    const newdata = new data({
      name,
      email,
      password: hashedPassword,
    });

    await newdata.save();

    res.status(201).json({ message: "User successfully registered" });
  } catch (err) {
    console.error("Register Error:", err.message);
    next(err);
  }
}

export async function login(req, res, next) {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await data.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Compare password using bcrypt
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid password" });
    }

    // Generate token
    const token = generateToken(user._id);

    res.json({ token });
  } catch (err) {
    console.error("Login Error:", err.message);
    next(err);
  }
}

export async function getMe(req, res, next) {
  try {
    const user = await data.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "data not found" });
    }
    res.json(user);
  } catch (err) {
    console.error("getMe Error:", err.message);
    next(err);
  }
}


