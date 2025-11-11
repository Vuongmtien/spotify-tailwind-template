import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { verifyToken } from "../middlewares/auth.js";

const router = express.Router();

// ✅ Đăng ký
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password)
      return res.status(400).json({ message: "Vui lòng nhập đầy đủ thông tin" });

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "Email đã được đăng ký" });

    const hashed = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      name,
      email,
      password: hashed,
      role: "user",
    });

    return res.status(201).json({ message: "Đăng ký thành công", user: newUser });
  } catch (err) {
    console.error("❌ Register error:", err);
    return res.status(500).json({ message: "Lỗi server khi đăng ký" });
  }
});

// ✅ Đăng nhập
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ message: "Không tìm thấy tài khoản" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Sai mật khẩu" });

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.status(200).json({
      message: "Đăng nhập thành công",
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    });
  } catch (err) {
    console.error("❌ Login error:", err);
    return res.status(500).json({ message: "Lỗi server khi đăng nhập" });
  }
});
router.get("/me", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Lỗi khi tải thông tin tài khoản" });
  }
});
router.put("/update", verifyToken, async (req, res) => {
  try {
    const { username, email, gender, dob, country, agreed } = req.body;
    const updated = await User.findByIdAndUpdate(
      req.user.id,
      {
        username,
        email,
        gender,
        dob,
        country,
        agreed,
      },
      { new: true }
    ).select("-password");

    if (!updated) return res.status(404).json({ message: "Không tìm thấy tài khoản" });

    res.json({ message: "Cập nhật thành công", user: updated });
  } catch (err) {
    console.error("❌ Update error:", err);
    res.status(500).json({ message: "Lỗi server khi cập nhật thông tin" });
  }
});
export default router;
