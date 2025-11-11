import express from "express";
import Playlist from "../models/Playlist.js";

const router = express.Router();

// ✅ Lấy danh sách playlist
router.get("/", async (req, res) => {
  try {
    const playlists = await Playlist.find();
    res.json(playlists);
  } catch (err) {
    res.status(500).json({ message: "Lỗi khi tải danh sách playlist" });
  }
});

export default router;
