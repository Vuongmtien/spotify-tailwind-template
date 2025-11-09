import React, { useState, useEffect } from "react";
import api from "../lib/api"; // axios instance (đã có baseURL)

export default function AdminSongs() {
  const [songs, setSongs] = useState([]);
  const [newSong, setNewSong] = useState({
    title: "",
    artist: "",
    image: "",
    audio: "",
  });
  const [editingSong, setEditingSong] = useState(null);

  // 🟢 Lấy danh sách bài hát khi load trang
  useEffect(() => {
    fetchSongs();
  }, []);

const fetchSongs = async () => {
  try {
    const res = await api.get("/api/tracks");

    let list = [];

    // 🔥 Nhận biết đúng cấu trúc hiện tại
    if (Array.isArray(res.data)) {
      list = res.data;
    } else if (Array.isArray(res.data.tracks)) {
      list = res.data.tracks;
    } else if (Array.isArray(res.data.data)) {
      list = res.data.data;
    } else if (Array.isArray(res.data.items)) {
      list = res.data.items; // ✅ chính là cấu trúc thật của backend anh
    } else {
      console.warn("⚠️ API /tracks trả về object lạ:", res.data);
      list = Object.values(res.data).flat(); // ép lấy mảng con nếu có
    }

    console.log("✅ Danh sách bài hát đã load:", list);
    setSongs(list);
  } catch (err) {
    console.error("❌ Lỗi khi tải danh sách bài hát:", err);
    setSongs([]);
  }
};


  // 🟣 Thêm bài hát mới
  const handleAdd = async () => {
    if (!newSong.title || !newSong.audio) {
      alert("Vui lòng nhập tên bài hát và link audio!");
      return;
    }
    try {
      await api.post("/api/tracks", newSong);
      setNewSong({ title: "", artist: "", image: "", audio: "" });
      await fetchSongs();
    } catch (err) {
      alert("Không thể thêm bài hát!");
    }
  };

  // 🟡 Cập nhật bài hát
  const handleUpdate = async () => {
    try {
      await api.put(`/api/tracks/${editingSong._id}`, editingSong);
      setEditingSong(null);
      fetchSongs();
    } catch (err) {
      alert("Không thể cập nhật bài hát!");
    }
  };

  // 🔴 Xóa bài hát
  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc muốn xóa bài hát này không?")) return;
    try {
      await api.delete(`/api/tracks/${id}`);
      fetchSongs();
    } catch (err) {
      alert("Không thể xóa bài hát!");
    }
  };

  return (
    <div className="p-8 bg-[#121212] text-white rounded-xl border border-gray-700">
      <h2 className="text-2xl font-bold text-green-400 mb-4">🎵 Quản lý bài hát</h2>

      {/* Form thêm mới */}
      <div className="flex flex-wrap gap-2 mb-6">
        {["title", "artist", "image", "audio"].map((key) => (
          <input
            key={key}
            value={newSong[key]}
            onChange={(e) => setNewSong({ ...newSong, [key]: e.target.value })}
            placeholder={key}
            className="bg-gray-800 p-2 rounded w-[180px] text-white placeholder-gray-400"
          />
        ))}
        <button
          onClick={handleAdd}
          className="bg-green-500 text-black px-4 py-2 rounded font-semibold hover:bg-green-400"
        >
          ➕ Thêm
        </button>
      </div>

      {/* Danh sách bài hát */}
      <table className="w-full text-left text-sm border-collapse">
        <thead className="bg-[#181818] text-gray-300 uppercase">
          <tr>
            <th className="px-3 py-2">Tên bài</th>
            <th className="px-3 py-2">Nghệ sĩ</th>
            <th className="px-3 py-2">Ảnh</th>
            <th className="px-3 py-2">Audio</th>
            <th className="px-3 py-2 text-center">Hành động</th>
          </tr>
        </thead>
        <tbody>
          {songs.map((s) => (
            <tr key={s._id} className="border-b border-gray-700">
              <td className="px-3 py-2">{s.title}</td>
              <td className="px-3 py-2">{s.artist}</td>
              <td className="px-3 py-2">
                {s.image && <img src={s.image} alt="" className="w-12 h-12 object-cover rounded" />}
              </td>
              <td className="px-3 py-2 truncate max-w-[150px]">{s.audio}</td>
              <td className="px-3 py-2 text-center space-x-2">
                <button
                  onClick={() => setEditingSong(s)}
                  className="bg-yellow-500 hover:bg-yellow-600 text-black px-2 py-1 rounded"
                >
                  ✏️ Sửa
                </button>
                <button
                  onClick={() => handleDelete(s._id)}
                  className="bg-red-600 hover:bg-red-700 px-2 py-1 rounded"
                >
                  🗑️ Xóa
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Form chỉnh sửa */}
      {editingSong && (
        <div className="mt-6 p-4 bg-gray-800 rounded-lg">
          <h3 className="font-bold mb-2">✏️ Chỉnh sửa bài hát</h3>
          {["title", "artist", "image", "audio"].map((key) => (
            <input
              key={key}
              value={editingSong[key]}
              onChange={(e) => setEditingSong({ ...editingSong, [key]: e.target.value })}
              placeholder={key}
              className="bg-gray-700 p-2 rounded w-full mb-2 text-white placeholder-gray-400"
            />
          ))}
          <div className="flex gap-2">
            <button
              onClick={handleUpdate}
              className="bg-green-500 text-black px-3 py-1 rounded font-semibold"
            >
              💾 Lưu
            </button>
            <button
              onClick={() => setEditingSong(null)}
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
