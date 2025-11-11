import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";
import { texts } from "../constants/texts";
import api from "../lib/api";
import { useAuth } from "../context/auth";

const EditProfile = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const t = texts[language] || texts.vi;
  const { user, setUser } = useAuth();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [gender, setGender] = useState("Nam");
  const [dob, setDob] = useState({ day: "", month: "", year: "" });
  const [country, setCountry] = useState("Việt Nam");
  const [agreed, setAgreed] = useState(true);

  useEffect(() => {
    if (user) {
      setUsername(user.username || "");
      setEmail(user.email || "");
      setGender(user.gender || "Nam");
      setDob(user.dob || { day: "", month: "", year: "" });
      setCountry(user.country || "Việt Nam");
      setAgreed(user.agreed ?? true);
    }
  }, [user]);

const handleSave = async () => {
  try {
    const token = localStorage.getItem("token");
    const res = await api.put(
      "/api/auth/update",
      { username, email, gender, dob, country, agreed },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    alert("Cập nhật thành công!");
    setUser(res.data.user); // cập nhật lại thông tin trong context
    navigate("/profile");
  } catch (err) {
    console.error("Lỗi update:", err);
    alert("Lỗi khi cập nhật thông tin người dùng");
  }
};
  return (
    <div className="min-h-screen bg-black text-white pt-24 px-4 max-w-2xl mx-auto space-y-6">
      <button
        onClick={() => navigate("/profile")}
        className="text-sm text-green-400 hover:underline"
      >
        ← {t.backToProfile}
      </button>

      <h1 className="text-3xl font-bold">{t.editProfile}</h1>

      <div className="space-y-4">
        <div>
          <label className="block mb-1">{t.usernameLabel}</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full bg-[#121212] text-white px-4 py-2 rounded border border-gray-700"
          />
        </div>

        <div>
          <label className="block mb-1">{t.email}</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-[#121212] text-white px-4 py-2 rounded border border-gray-700"
          />
        </div>

        <div>
          <label className="block mb-1">{t.gender}</label>
          <select
            value={gender}
            onChange={(e) => setGender(e.target.value)}
            className="w-full bg-[#121212] text-white px-4 py-2 rounded border border-gray-700"
          >
            <option>Nam</option>
            <option>Nữ</option>
            <option>Khác</option>
          </select>
        </div>

        <div>
          <label className="block mb-1">{t.birthdate}</label>
          <div className="flex gap-2">
            <input
              type="number"
              placeholder={t.day || "Ngày"}
              value={dob.day}
              onChange={(e) => setDob({ ...dob, day: e.target.value })}
              className="w-1/3 bg-[#121212] text-white px-3 py-2 rounded border border-gray-700"
            />
            <input
              type="text"
              placeholder={t.month || "Tháng"}
              value={dob.month}
              onChange={(e) => setDob({ ...dob, month: e.target.value })}
              className="w-1/3 bg-[#121212] text-white px-3 py-2 rounded border border-gray-700"
            />
            <input
              type="number"
              placeholder={t.year || "Năm"}
              value={dob.year}
              onChange={(e) => setDob({ ...dob, year: e.target.value })}
              className="w-1/3 bg-[#121212] text-white px-3 py-2 rounded border border-gray-700"
            />
          </div>
        </div>

        <div>
          <label className="block mb-1">{t.country}</label>
          <input
            type="text"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            className="w-full bg-[#121212] text-white px-4 py-2 rounded border border-gray-700"
          />
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
          />
          <label>{t.shareData}</label>
        </div>
      </div>

      <div className="flex justify-end gap-4 mt-6">
        <button
          onClick={() => navigate("/profile")}
          className="text-gray-400 hover:underline"
        >
          {t.cancel}
        </button>
        <button
          onClick={handleSave}
          className="bg-green-500 hover:bg-green-400 text-black font-semibold px-6 py-2 rounded-full"
        >
          {t.saveProfile}
        </button>
      </div>
    </div>
  );
};

export default EditProfile;
