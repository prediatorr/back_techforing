import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import jobRoutes from "./routes/jobsRoutes.js";
import authRoutes from "./routes/authRoutes.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(
  cors({
    origin: "https://techforing-front.vercel.app",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());

// MongoDB Connection
const connectDB = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error("MONGODB_URI is not defined in the environment variables.");
    }

    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("Connected to MongoDB");

    // Start the server only after a successful DB connection
    app.listen(port, () => {
      console.log(`Server running on port: ${port}`);
    });
  } catch (err) {
    console.error("MongoDB connection error:", err.message);
    process.exit(1);
  }
};

connectDB();

// Routes
app.get("/", (req, res) => {
  res.send("Express server running on Vercel");
});

app.use("/api/jobs", jobRoutes);
app.use("/api/auth", authRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Internal Server Error" });
});
