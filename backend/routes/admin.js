import express from "express";
import User from "../models/User.js";
import Track from "../models/Track.js";
import Playlist from "../models/Playlist.js";
import { verifyToken } from "../middlewares/auth.js";
import { verifyAdmin } from "../middlewares/isAdmin.js";

const router = express.Router();

// 🟢 Lấy danh sách tất cả user
router.get("/users", verifyToken, verifyAdmin, async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Lỗi khi tải danh sách user" });
  }
});

// 🟢 Lấy danh sách bài hát
router.get("/tracks", verifyToken, verifyAdmin, async (req, res) => {
  try {
    const tracks = await Track.find();
    res.json(tracks);
  } catch (err) {
    res.status(500).json({ message: "Lỗi khi tải danh sách bài hát" });
  }
});

// 🟢 Lấy danh sách playlist
router.get("/playlists", verifyToken, verifyAdmin, async (req, res) => {
  try {
    const playlists = await Playlist.find();
    res.json(playlists);
  } catch (err) {
    res.status(500).json({ message: "Lỗi khi tải danh sách playlist" });
  }
});

// 🟠 Xoá user
router.delete("/users/:id", verifyToken, verifyAdmin, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "Xoá user thành công" });
  } catch (err) {
    res.status(500).json({ message: "Lỗi khi xoá user" });
  }
});

// 🟠 Xoá track
router.delete("/tracks/:id", verifyToken, verifyAdmin, async (req, res) => {
  try {
    await Track.findByIdAndDelete(req.params.id);
    res.json({ message: "Xoá track thành công" });
  } catch (err) {
    res.status(500).json({ message: "Lỗi khi xoá track" });
  }
});

// 🟠 Xoá playlist
router.delete("/playlists/:id", verifyToken, verifyAdmin, async (req, res) => {
  try {
    await Playlist.findByIdAndDelete(req.params.id);
    res.json({ message: "Xoá playlist thành công" });
  } catch (err) {
    res.status(500).json({ message: "Lỗi khi xoá playlist" });
  }
});

export default router;
