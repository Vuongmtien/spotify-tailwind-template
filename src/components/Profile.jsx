import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";
import { texts } from "../constants/texts";
import api from "../lib/api"; // axios setup sẵn

const Profile = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const { language } = useLanguage();
  const t = texts[language] || texts.vi;

  // 🟢 Lấy thông tin user từ backend
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setLoading(false);
          return;
        }

        const { data } = await api.get("/api/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProfile(data);
      } catch (err) {
        console.error("❌ Lỗi khi lấy profile:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const actions = [
    { label: t.managePlan || "Quản lý gói Premium", icon: "🎧", path: "/account/plan" },
    { label: t.editProfile || "Chỉnh sửa hồ sơ", icon: "✏️", path: "/profile/edit" },
    { label: t.recoverPlaylist || "Khôi phục playlist", icon: "🔁", path: "/playlist/recover" },
  ];

  const filteredActions = actions.filter((item) =>
    item.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <p>Đang tải...</p>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center">
        <p>Không tìm thấy thông tin người dùng!</p>
        <button
          onClick={() => navigate("/login")}
          className="mt-4 bg-green-500 text-black px-4 py-2 rounded-full font-bold hover:bg-green-400"
        >
          Đăng nhập lại
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white pt-24 px-4 pb-12 space-y-8 max-w-3xl mx-auto">
      {/* Header user info */}
      <div className="bg-gradient-to-r from-purple-700 to-pink-500 rounded-xl p-6 flex flex-col md:flex-row items-center gap-6">
        <img src="/logo.png" alt="Premium" className="w-24 h-24 rounded-md" />
        <div className="flex-1">
          <h2 className="text-xl md:text-2xl font-bold mb-2">
            👋 Xin chào, {profile?.username}
          </h2>
          <p className="text-sm mb-1 text-gray-100">{profile?.email}</p>
          <p className="text-sm text-gray-300 italic">
            Quyền hạn: {profile?.role === "admin" ? "Admin" : "Người dùng"}
          </p>
          <button
            onClick={() => navigate("/premium")}
            className="mt-3 bg-white text-black font-bold px-4 py-2 rounded-full hover:opacity-90"
          >
            {t.promoBtn || "Nâng cấp Premium"}
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-xl">
        <input
          type="text"
          placeholder={t.searchPlaceholder || "Tìm kiếm cài đặt..."}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-[#181818] text-white px-12 py-3 rounded-md border border-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
        />
        <span className="absolute left-4 top-3.5 text-gray-400">🔍</span>
      </div>

      {/* Plan info */}
      <div className="bg-[#1f1f1f] p-5 rounded-lg flex justify-between items-center">
        <div>
          <h3 className="text-gray-400 text-sm">{t.yourPlan || "Gói của bạn"}</h3>
          <h2 className="text-xl font-bold">TieM Free</h2>
        </div>
        <img src="/logo.png" alt="Spotify" className="w-6 h-6" />
      </div>

      {/* Actions */}
      <div>
        <h2 className="text-lg font-bold mb-3">{t.account || "Tài khoản"}</h2>
        <div className="bg-[#1f1f1f] rounded-lg divide-y divide-gray-700">
          {filteredActions.length > 0 ? (
            filteredActions.map((item, index) => (
              <div
                key={index}
                className="flex justify-between items-center p-4 hover:bg-[#2a2a2a] cursor-pointer"
                onClick={() => navigate(item.path)}
              >
                <div className="flex items-center gap-3">
                  <span>{item.icon}</span>
                  <span>{item.label}</span>
                </div>
                <span>➡️</span>
              </div>
            ))
          ) : (
            <p className="text-sm text-gray-400 p-4">
              {t.noResult || "Không tìm thấy kết quả"}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
