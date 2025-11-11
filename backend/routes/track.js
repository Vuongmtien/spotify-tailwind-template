import express from "express";
import fetch from "node-fetch";

const router = express.Router();

// Hàm lấy access token của Spotify
async function getSpotifyToken() {
  const response = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization:
        "Basic " +
        Buffer.from(
          `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`
        ).toString("base64"),
    },
    body: "grant_type=client_credentials",
  });

  const data = await response.json();
  return data.access_token;
}

// API chính lấy nhạc VPOP
router.get("/", async (req, res) => {
  try {
    const token = await getSpotifyToken();
    const response = await fetch(
      "https://api.spotify.com/v1/search?q=vpop&type=track&market=VN&limit=10",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const data = await response.json();
    res.json(data.tracks.items);
  } catch (err) {
    console.error("Lỗi Spotify API:", err);
    res.status(500).json({ message: "Không lấy được nhạc từ Spotify" });
  }
});

export default router;
