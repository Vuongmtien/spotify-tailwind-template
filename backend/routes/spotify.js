import express from "express";
import Track from "../models/Track.js";

const router = express.Router();

// Import nhạc từ Spotify API
router.post("/import", async (req, res) => {
  try {
    const { token, keyword } = req.body; // token từ FE, keyword như 'vpop'

    if (!token) {
      return res.status(400).json({ message: "Thiếu token Spotify" });
    }

    const response = await fetch(
      `https://api.spotify.com/v1/search?q=${encodeURIComponent(
        keyword || "vpop"
      )}&type=track&market=VN&limit=10`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    const data = await response.json();
    if (!data.tracks) {
      return res.status(500).json({ message: "Không lấy được dữ liệu từ Spotify" });
    }

    // Lưu từng bài hát vào DB
    const newTracks = [];
    for (const item of data.tracks.items) {
      const exists = await Track.findOne({ spotifyId: item.id });
      if (exists) continue;

      const track = await Track.create({
        name: item.name,
        artist: item.artists.map((a) => a.name).join(", "),
        image: item.album.images[0]?.url,
        audio: item.preview_url,
        spotifyId: item.id,
      });

      newTracks.push(track);
    }

    res.json({ message: "Import thành công", count: newTracks.length, data: newTracks });
  } catch (err) {
    console.error("Lỗi import Spotify:", err);
    res.status(500).json({ message: "Lỗi server khi import nhạc" });
  }
});

export default router;
