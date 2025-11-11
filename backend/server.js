import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { connectDB } from "./db.js";
import authRoutes from "./routes/auth.js";
import adminRoutes from "./routes/admin.js";
import trackRoutes from "./routes/track.js";
import playlistRoutes from "./routes/playlist.js";
import User from "./models/User.js";
import bcrypt from "bcryptjs";
import spotifyRoutes from "./routes/spotify.js";

dotenv.config();
connectDB();

const app = express();
app.use(cors({
  origin: ["http://127.0.0.1:5173", "http://localhost:5173"],
  credentials: true,
}));
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/tracks", trackRoutes);
app.use("/api/playlists", playlistRoutes);
app.use("/api/spotify", spotifyRoutes);

// ✅ Tạo admin mặc định
const createAdmin = async () => {
  const admin = await User.findOne({ email: "admin@gmail.com" });
  if (!admin) {
    const hashed = await bcrypt.hash("123456", 10);
    await User.create({
      name: "Admin",
      email: "admin@gmail.com",
      password: hashed,
      role: "admin",
    });
    console.log("✅ Admin created: admin@gmail.com / 123456");
  }
};
createAdmin();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
