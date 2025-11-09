// (Giữ nguyên UI, chỉ fix gọi login)
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/auth";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    try {
      setLoading(true);
      const user = await login(email, password);
alert(`🎉 Đăng nhập thành công! Xin chào ${user.username}`);

if (user.role === "admin") {
  navigate("/admin"); // ✅ chuyển đến trang quản trị
} else {
  navigate("/"); // ✅ user thường về trang chủ
}
    } catch (err) {
      alert(err?.response?.data?.message || "Đăng nhập thất bại!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white px-4">
      <div className="w-full max-w-sm bg-[#121212] p-8 rounded-xl border border-gray-700 space-y-4">
        <h1 className="text-2xl font-bold text-center">Đăng nhập vào Spotify</h1>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          className="w-full p-3 rounded bg-gray-800 border border-gray-600 text-white placeholder-gray-400"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Mật khẩu"
          className="w-full p-3 rounded bg-gray-800 border border-gray-600 text-white placeholder-gray-400"
        />
        <button
          onClick={handleLogin}
          disabled={loading}
          className="w-full py-3 rounded-full bg-green-500 text-black font-semibold hover:bg-green-400 disabled:opacity-60"
        >
          {loading ? "Đang đăng nhập..." : "Đăng nhập"}
        </button>
        <p className="text-center text-sm mt-2">
          Bạn chưa có tài khoản?{" "}
          <Link to="/signup" className="text-green-400 hover:underline">
            Đăng ký Spotify
          </Link>
        </p>
      </div>
    </div>
  );
}
