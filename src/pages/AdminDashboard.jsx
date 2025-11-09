import React, { useEffect, useState } from "react";
import api from "../lib/api";
import { useAuth } from "../context/auth";
import AdminSongs from "./AdminSongs";
import AdminPlaylists from "./AdminPlaylists";

export default function AdminDashboard() {
  const { user, loading } = useAuth();
  const [users, setUsers] = useState([]);
  const [tab, setTab] = useState("users");
  const [loadingUsers, setLoadingUsers] = useState(false);

  // 🟩 Lấy danh sách user khi admin mở tab "Người dùng"
  useEffect(() => {
    if (user?.role === "admin" && tab === "users") {
      fetchUsers();
    }
  }, [user, tab]);

  const fetchUsers = async () => {
    try {
      setLoadingUsers(true);
      const token = localStorage.getItem("token");
      const { data } = await api.get("/api/admin/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(data);
    } catch (err) {
      console.error("❌ Lỗi khi tải danh sách user:", err);
      alert("Không thể tải danh sách người dùng!");
    } finally {
      setLoadingUsers(false);
    }
  };

  const deleteUser = async (id) => {
    if (!window.confirm("Bạn có chắc muốn xóa người dùng này không?")) return;
    try {
      const token = localStorage.getItem("token");
      await api.delete(`/api/admin/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchUsers();
    } catch (err) {
      console.error("❌ Lỗi khi xóa user:", err);
      alert("Không thể xóa người dùng!");
    }
  };

  const makeAdmin = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await api.patch(`/api/admin/users/${id}/make-admin`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchUsers();
    } catch (err) {
      console.error("❌ Lỗi khi cấp quyền admin:", err);
      alert("Không thể cấp quyền admin!");
    }
  };

  // 🟡 Loading tổng khi chưa có user
  if (loading) return <p className="text-center text-white mt-10">Đang tải...</p>;
  if (!user) return <p className="text-center text-white mt-10">Vui lòng đăng nhập!</p>;
  if (user.role !== "admin")
    return (
      <p className="text-center text-red-400 mt-10 text-xl">
        🚫 Bạn không có quyền truy cập trang này
      </p>
    );

  return (
    <div className="p-8 min-h-screen bg-black text-white">
      <div className="max-w-6xl mx-auto bg-[#121212] rounded-2xl shadow-lg border border-gray-800 p-8 fade-in">
        <h1 className="text-4xl font-bold mb-8 text-green-400 text-center">
          👑 Bảng điều khiển Quản trị
        </h1>

        {/* ⚙️ Thanh chuyển tab */}
        <div className="flex justify-center gap-4 mb-8">
          {[
            { id: "users", label: "👤 Người dùng" },
            { id: "songs", label: "🎵 Bài hát" },
            { id: "playlists", label: "🎧 Playlist" },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`px-4 py-2 rounded-lg font-semibold transition ${
                tab === t.id
                  ? "bg-green-600 text-black"
                  : "bg-gray-700 text-white hover:bg-gray-600"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* 👥 Danh sách người dùng */}
        {tab === "users" && (
          <>
            {loadingUsers ? (
              <p className="text-center text-gray-400">Đang tải danh sách người dùng...</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-sm md:text-base">
                  <thead>
                    <tr className="bg-[#181818] text-gray-300 uppercase text-xs md:text-sm">
                      <th className="px-4 py-3 text-left">Tên người dùng</th>
                      <th className="px-4 py-3 text-left">Email</th>
                      <th className="px-4 py-3 text-center">Vai trò</th>
                      <th className="px-4 py-3 text-center">Hành động</th>
                    </tr>
                  </thead>

                  <tbody>
                    {users.length === 0 ? (
                      <tr>
                        <td colSpan="4" className="text-center text-gray-400 py-6">
                          Không có người dùng nào.
                        </td>
                      </tr>
                    ) : (
                      users.map((u, i) => (
                        <tr
                          key={u._id}
                          className={`${
                            i % 2 === 0 ? "bg-[#1e1e1e]" : "bg-[#151515]"
                          } hover:bg-[#222] transition`}
                        >
                          <td className="px-4 py-3 rounded-l-lg">{u.username}</td>
                          <td className="px-4 py-3">{u.email}</td>
                          <td className="px-4 py-3 text-center">
                            {u.role === "admin" ? (
                              <span className="bg-green-700/40 text-green-400 px-3 py-1 rounded-full text-xs font-semibold">
                                Admin
                              </span>
                            ) : (
                              <span className="bg-gray-700/60 text-gray-300 px-3 py-1 rounded-full text-xs font-semibold">
                                User
                              </span>
                            )}
                          </td>
                          <td className="px-4 py-3 text-center rounded-r-lg space-x-2">
                            <button
                              onClick={() => deleteUser(u._id)}
                              className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-lg font-semibold text-xs"
                            >
                              Xóa
                            </button>
                            {u.role !== "admin" && (
                              <button
                                onClick={() => makeAdmin(u._id)}
                                className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-lg font-semibold text-xs"
                              >
                                Cấp quyền Admin
                              </button>
                            )}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}

        {/* 🎵 Quản lý bài hát */}
        {tab === "songs" && <AdminSongs />}

        {/* 🎧 Quản lý playlist */}
        {tab === "playlists" && <AdminPlaylists />}
      </div>
    </div>
  );
}
