import React, { useState, useEffect } from "react";
import api from "../lib/api";

export default function AdminPlaylists() {
  const [playlists, setPlaylists] = useState([]);
  const [songs, setSongs] = useState([]);
  const [newPlaylist, setNewPlaylist] = useState({
    name: "",
    description: "",
    songs: [],
  });
  const [editingPlaylist, setEditingPlaylist] = useState(null);

  useEffect(() => {
    fetchPlaylists();
    fetchSongs();
  }, []);

  // 🟢 Lấy danh sách playlist từ backend thật
  const fetchPlaylists = async () => {
    try {
      const res = await api.get("/api/playlists");
      setPlaylists(res.data || []);
    } catch (err) {
      console.error("❌ Lỗi khi tải playlists:", err);
      setPlaylists([]);
    }
  };

  // 🟢 Lấy danh sách bài hát để chọn khi tạo playlist
  const fetchSongs = async () => {
    try {
      const res = await api.get("/api/tracks");
      setSongs(res.data || []);
    } catch (err) {
      console.error("❌ Lỗi khi tải danh sách bài hát:", err);
      setSongs([]);
    }
  };

  // 🟢 Thêm playlist mới (yêu cầu quyền admin)
  const handleAdd = async () => {
    if (!newPlaylist.name) {
      alert("Vui lòng nhập tên playlist!");
      return;
    }
    try {
      const token = localStorage.getItem("token");
      await api.post("/api/playlists", newPlaylist, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("✅ Thêm playlist thành công!");
      setNewPlaylist({ name: "", description: "", songs: [] });
      fetchPlaylists();
    } catch (err) {
      console.error("❌ Không thể thêm playlist:", err);
      alert("Không thể thêm playlist!");
    }
  };

  // 🟢 Xóa playlist
  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc muốn xóa playlist này không?")) return;
    try {
      const token = localStorage.getItem("token");
      await api.delete(`/api/playlists/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("🗑️ Đã xóa playlist thành công!");
      fetchPlaylists();
    } catch (err) {
      console.error("❌ Không thể xóa playlist:", err);
      alert("Không thể xóa playlist!");
    }
  };

  // 🟢 Cập nhật playlist
  const handleUpdate = async () => {
    if (!editingPlaylist.name) {
      alert("Tên playlist không được để trống!");
      return;
    }
    try {
      const token = localStorage.getItem("token");
      await api.put(`/api/playlists/${editingPlaylist._id}`, editingPlaylist, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("💾 Cập nhật playlist thành công!");
      setEditingPlaylist(null);
      fetchPlaylists();
    } catch (err) {
      console.error("❌ Không thể cập nhật playlist:", err);
      alert("Không thể cập nhật playlist!");
    }
  };

  // 🟢 Chọn / Bỏ chọn bài hát trong playlist
  const toggleSongSelection = (playlistState, songId, setter) => {
    const isSelected = playlistState.songs.includes(songId);
    if (isSelected) {
      setter({
        ...playlistState,
        songs: playlistState.songs.filter((id) => id !== songId),
      });
    } else {
      setter({ ...playlistState, songs: [...playlistState.songs, songId] });
    }
  };

  return (
    <div className="p-8 bg-[#121212] text-white rounded-xl border border-gray-700">
      <h2 className="text-2xl font-bold text-green-400 mb-4">
        🎧 Quản lý Playlist
      </h2>

      {/* Form thêm playlist */}
      <div className="flex flex-wrap gap-2 mb-6">
        <input
          value={newPlaylist.name}
          onChange={(e) =>
            setNewPlaylist({ ...newPlaylist, name: e.target.value })
          }
          placeholder="Tên playlist"
          className="bg-gray-800 p-2 rounded w-[180px] text-white placeholder-gray-400"
        />
        <input
          value={newPlaylist.description}
          onChange={(e) =>
            setNewPlaylist({ ...newPlaylist, description: e.target.value })
          }
          placeholder="Mô tả playlist (tùy chọn)"
          className="bg-gray-800 p-2 rounded w-[300px] text-white placeholder-gray-400"
        />
        <button
          onClick={handleAdd}
          className="bg-green-500 text-black px-4 py-2 rounded font-semibold hover:bg-green-400"
        >
          ➕ Thêm playlist
        </button>
      </div>

      {/* Danh sách bài hát để chọn */}
      <div className="bg-[#1e1e1e] p-4 rounded-lg mb-6 max-h-[250px] overflow-y-auto">
        <p className="font-semibold mb-2 text-sm">🎵 Chọn bài hát cho playlist:</p>
        <div className="flex flex-wrap gap-2">
          {songs.map((song) => (
            <button
              key={song._id}
              onClick={() =>
                toggleSongSelection(newPlaylist, song._id, setNewPlaylist)
              }
              className={`px-3 py-1 rounded text-sm ${
                newPlaylist.songs.includes(song._id)
                  ? "bg-green-600 text-black"
                  : "bg-gray-700 text-white hover:bg-gray-600"
              }`}
            >
              {song.title}
            </button>
          ))}
        </div>
      </div>

      {/* Danh sách playlist */}
      <table className="w-full text-left text-sm border-collapse">
        <thead className="bg-[#181818] text-gray-300 uppercase">
          <tr>
            <th className="px-3 py-2">Tên Playlist</th>
            <th className="px-3 py-2">Số bài hát</th>
            <th className="px-3 py-2 text-center">Hành động</th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(playlists) &&
            playlists.map((p) => (
              <tr key={p._id} className="border-b border-gray-700">
                <td className="px-3 py-2">{p.name}</td>
                <td className="px-3 py-2">{p.songs?.length || 0}</td>
                <td className="px-3 py-2 text-center space-x-2">
                  <button
                    onClick={() => setEditingPlaylist(p)}
                    className="bg-yellow-500 hover:bg-yellow-600 text-black px-2 py-1 rounded"
                  >
                    ✏️ Sửa
                  </button>
                  <button
                    onClick={() => handleDelete(p._id)}
                    className="bg-red-600 hover:bg-red-700 px-2 py-1 rounded"
                  >
                    🗑️ Xóa
                  </button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>

      {/* Form chỉnh sửa playlist */}
      {editingPlaylist && (
        <div className="mt-6 p-4 bg-gray-800 rounded-lg">
          <h3 className="font-bold mb-2">✏️ Chỉnh sửa Playlist</h3>
          <input
            value={editingPlaylist.name}
            onChange={(e) =>
              setEditingPlaylist({ ...editingPlaylist, name: e.target.value })
            }
            placeholder="Tên playlist"
            className="bg-gray-700 p-2 rounded w-full mb-2 text-white placeholder-gray-400"
          />
          <input
            value={editingPlaylist.description || ""}
            onChange={(e) =>
              setEditingPlaylist({
                ...editingPlaylist,
                description: e.target.value,
              })
            }
            placeholder="Mô tả playlist"
            className="bg-gray-700 p-2 rounded w-full mb-2 text-white placeholder-gray-400"
          />

          <div className="bg-[#1e1e1e] p-4 rounded-lg mb-4 max-h-[250px] overflow-y-auto">
            <p className="font-semibold mb-2 text-sm">🎵 Bài hát trong playlist:</p>
            <div className="flex flex-wrap gap-2">
              {songs.map((song) => (
                <button
                  key={song._id}
                  onClick={() =>
                    toggleSongSelection(
                      editingPlaylist,
                      song._id,
                      setEditingPlaylist
                    )
                  }
                  className={`px-3 py-1 rounded text-sm ${
                    editingPlaylist.songs.includes(song._id)
                      ? "bg-green-600 text-black"
                      : "bg-gray-700 text-white hover:bg-gray-600"
                  }`}
                >
                  {song.title}
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleUpdate}
              className="bg-green-500 text-black px-3 py-1 rounded font-semibold"
            >
              💾 Lưu
            </button>
            <button
              onClick={() => setEditingPlaylist(null)}
              className="bg-gray-500 px-3 py-1 rounded text-white"
            >
              Hủy
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
