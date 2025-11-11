import React, { useEffect, useState } from "react";
import api from "../lib/api";

function AdminDashboard() {
  const [tracks, setTracks] = useState([]);
  const [spotifyToken, setSpotifyToken] = useState(localStorage.getItem("spotify_token"));

  // 🔹 Gọi danh sách bài hát từ backend
  const fetchTracks = async () => {
    try {
      const res = await api.get("/api/tracks");
      setTracks(res.data || []);
    } catch (err) {
      console.error("Lỗi tải bài hát:", err);
    }
  };

  useEffect(() => {
    fetchTracks();
  }, []);

  // 🔹 Nút KẾT NỐI SPOTIFY
  const handleConnectSpotify = () => {
    const clientId = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
    const redirectUri = import.meta.env.VITE_SPOTIFY_REDIRECT_URI;
    const scopes = import.meta.env.VITE_SPOTIFY_SCOPES;

    const authUrl = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=token&redirect_uri=${encodeURIComponent(
      redirectUri
    )}&scope=${encodeURIComponent(scopes)}&show_dialog=true`;

    window.location.href = authUrl;
  };

  // 🔹 Lấy access_token khi Spotify redirect về /callback
  useEffect(() => {
    const hash = window.location.hash;
    if (hash.includes("access_token")) {
      const token = new URLSearchParams(hash.replace("#", "")).get("access_token");
      if (token) {
        localStorage.setItem("spotify_token", token);
        setSpotifyToken(token);
        window.history.replaceState(null, "", window.location.pathname);
        alert("✅ Đã kết nối Spotify thành công!");
      } else {
        alert("❌ Không nhận được token từ Spotify!");
      }
    }
  }, []);

  // 🔹 Import nhạc từ Spotify về backend
  const handleImportSpotify = async () => {
    const token = localStorage.getItem("spotify_token");
    if (!token) {
      alert("⚠️ Vui lòng kết nối Spotify trước!");
      return;
    }

    try {
      const res = await api.get("/api/tracks"); // lấy danh sách VPOP thật từ backend
      setTracks(res.data || []);
      alert(`✅ Đã tải ${res.data?.length || 0} bài hát từ Spotify!`);
    } catch (err) {
      console.error("Lỗi import Spotify:", err);
      alert("❌ Lỗi khi tải nhạc từ Spotify!");
    }
  };

  return (
    <div className="p-8 min-h-screen bg-black text-white">
      <div className="max-w-5xl mx-auto bg-[#121212] rounded-xl p-6">
        <h1 className="text-3xl font-bold text-center mb-6 text-green-400">
          👑 Bảng quản trị
        </h1>

        <div className="flex gap-4 justify-center mb-6">
          <button
            className="px-4 py-2 bg-green-600 rounded hover:bg-green-700"
            onClick={fetchTracks}
          >
            🎵 Bài hát
          </button>

          <button
            className="px-4 py-2 bg-green-500 rounded hover:bg-green-600"
            onClick={spotifyToken ? handleImportSpotify : handleConnectSpotify}
          >
            {spotifyToken ? "📥 Lấy nhạc từ Spotify" : "🔑 Kết nối Spotify"}
          </button>
        </div>

        <h2 className="text-xl font-semibold mb-4">🎶 Danh sách bài hát</h2>

        {tracks.length === 0 ? (
          <p>Chưa có bài hát nào.</p>
        ) : (
          <table className="w-full text-left border-t border-gray-700">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="p-2">Tên</th>
                <th className="p-2">Nghệ sĩ</th>
                <th className="p-2">Album</th>
                <th className="p-2">Nghe thử</th>
              </tr>
            </thead>
            <tbody>
              {tracks.map((t, i) => (
                <tr key={i} className="border-b border-gray-800">
                  <td className="p-2">{t.name || "Không rõ"}</td>
                  <td className="p-2">
                    {t.artists && t.artists.length > 0
                      ? t.artists.map((a) => a.name).join(", ")
                      : "Không rõ"}
                  </td>
                  <td className="p-2">{t.album?.name || "Không rõ"}</td>
                  <td className="p-2">
                    {t.preview_url ? (
                      <audio controls src={t.preview_url} className="w-40" />
                    ) : (
                      <span>Không có</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default AdminDashboard;
