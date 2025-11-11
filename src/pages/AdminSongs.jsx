import React, { useState, useEffect } from "react";
import api from "../lib/api";

export default function AdminSongs() {
  const [songs, setSongs] = useState([]);
  const [newSong, setNewSong] = useState({ title: "", artist: "", url: "", cover: "" });
  const [editing, setEditing] = useState(null);

  const fetchSongs = async () => {
    try {
      const { data } = await api.get("/api/tracks");
      setSongs(data);
    } catch (err) {
      console.error("Lỗi tải track:", err);
    }
  };

  const handleAdd = async () => {
    if (!newSong.title || !newSong.url) return alert("Nhập tên và URL!");
    try {
      await api.post("/api/tracks", newSong);
      setNewSong({ title: "", artist: "", url: "", cover: "" });
      fetchSongs();
    } catch {
      alert("Không thể thêm bài hát!");
    }
  };

  const handleUpdate = async () => {
    try {
      await api.put(`/api/tracks/${editing._id}`, editing);
      setEditing(null);
      fetchSongs();
    } catch {
      alert("Không thể cập nhật!");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Xóa bài hát này?")) {
      await api.delete(`/api/tracks/${id}`);
      fetchSongs();
    }
  };

  useEffect(() => {
    fetchSongs();
  }, []);

  return (
    <div className="bg-[#121212] text-white p-6 rounded-lg border border-gray-700">
      <h2 className="text-xl font-bold mb-4 text-green-400">🎵 Quản lý bài hát</h2>
      <div className="flex flex-wrap gap-2 mb-4">
        {["title", "artist", "url", "cover"].map((k) => (
          <input
            key={k}
            value={newSong[k]}
            onChange={(e) => setNewSong({ ...newSong, [k]: e.target.value })}
            placeholder={k}
            className="bg-gray-800 p-2 rounded text-sm placeholder-gray-400"
          />
        ))}
        <button
          onClick={handleAdd}
          className="bg-green-500 text-black px-3 py-1 rounded font-semibold"
        >
          ➕ Thêm
        </button>
      </div>

      <table className="w-full text-left text-sm">
        <thead className="bg-[#181818] text-gray-300 uppercase">
          <tr>
            <th className="px-3 py-2">Tên</th>
            <th className="px-3 py-2">Nghệ sĩ</th>
            <th className="px-3 py-2">Audio</th>
            <th className="px-3 py-2 text-center">Hành động</th>
          </tr>
        </thead>
        <tbody>
          {songs.map((s) => (
            <tr key={s._id} className="border-b border-gray-700">
              <td className="px-3 py-2">{s.title}</td>
              <td className="px-3 py-2">{s.artist}</td>
              <td className="px-3 py-2 truncate">{s.url}</td>
              <td className="px-3 py-2 text-center space-x-2">
                <button
                  onClick={() => setEditing(s)}
                  className="bg-yellow-500 hover:bg-yellow-600 text-black px-2 py-1 rounded text-xs"
                >
                  ✏️
                </button>
                <button
                  onClick={() => handleDelete(s._id)}
                  className="bg-red-600 hover:bg-red-700 px-2 py-1 rounded text-xs"
                >
                  🗑️
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {editing && (
        <div className="mt-4 bg-gray-800 p-4 rounded-lg">
          <h3 className="font-semibold mb-2">Chỉnh sửa bài hát</h3>
          {["title", "artist", "url", "cover"].map((k) => (
            <input
              key={k}
              value={editing[k]}
              onChange={(e) => setEditing({ ...editing, [k]: e.target.value })}
              placeholder={k}
              className="bg-gray-700 p-2 rounded w-full mb-2 text-sm placeholder-gray-400"
            />
          ))}
          <button onClick={handleUpdate} className="bg-green-500 text-black px-3 py-1 rounded">
            💾 Lưu
          </button>
          <button onClick={() => setEditing(null)} className="ml-2 bg-gray-600 px-3 py-1 rounded">
            Hủy
          </button>
        </div>
      )}
    </div>
  );
}
