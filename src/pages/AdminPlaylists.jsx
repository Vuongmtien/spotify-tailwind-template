import React, { useEffect, useState } from "react";
import api from "../lib/api";

export default function AdminPlaylists() {
  const [playlists, setPlaylists] = useState([]);

  const fetchPlaylists = async () => {
    try {
      const { data } = await api.get("/api/playlists");
      setPlaylists(data);
    } catch (err) {
      console.error("Lỗi tải playlists:", err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Xóa playlist này?")) {
      await api.delete(`/api/playlists/${id}`);
      fetchPlaylists();
    }
  };

  useEffect(() => {
    fetchPlaylists();
  }, []);

  return (
    <div className="bg-[#121212] p-6 text-white rounded-lg border border-gray-700">
      <h2 className="text-xl font-bold mb-4 text-green-400">🎧 Quản lý Playlist</h2>
      <table className="w-full text-left text-sm">
        <thead className="bg-[#181818] text-gray-300 uppercase">
          <tr>
            <th className="px-3 py-2">Tên Playlist</th>
            <th className="px-3 py-2">Số bài hát</th>
            <th className="px-3 py-2 text-center">Hành động</th>
          </tr>
        </thead>
        <tbody>
          {playlists.map((p) => (
            <tr key={p._id} className="border-b border-gray-700">
              <td className="px-3 py-2">{p.name}</td>
              <td className="px-3 py-2 text-center">{p.tracks?.length || 0}</td>
              <td className="px-3 py-2 text-center">
                <button
                  onClick={() => handleDelete(p._id)}
                  className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded text-xs"
                >
                  🗑️ Xóa
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
