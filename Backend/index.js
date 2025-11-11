import express from "express";
import cors from "cors";
import "dotenv/config";
import { connectDB } from "./config/db.js";
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/users.js";
import errorHandler from "./middleware/errorHandler.js";
const app = express();
connectDB();

const FRONTEND_URL = process.env.FRONTEND_URL;
const PORT = process.env.PORT || 5000;
app.use(express.json());

const corsOptions = {
  origin: FRONTEND_URL,
  methods: ["GET", "PUT", "POST", "DELETE"],
  credentials: true,
};

app.use(cors(corsOptions));

app.get("/health", (req, res) => res.status(200).send("OK"));
app.get("/", (req, res) =>
  res.status(200).send("Backend deployed successfully on AWS.completed CI/CD integration.Manish")
);

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Your server is running at port ${PORT}`);
});