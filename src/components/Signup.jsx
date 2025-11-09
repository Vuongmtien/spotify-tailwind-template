import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/auth";

const Signup = () => {
  const navigate = useNavigate();
  const { signup } = useAuth();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignup = async () => {
    try {
      setLoading(true);
      await signup(username, email, password);
      alert("🎉 Đăng ký thành công! Bây giờ bạn có thể đăng nhập.");
      navigate("/login");
    } catch (err) {
      alert(err?.response?.data?.message || "Đăng ký thất bại!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white px-4">
      <div className="w-full max-w-sm bg-[#121212] p-8 rounded-xl border border-gray-700 space-y-4">
        <h1 className="text-2xl font-bold text-center">Đăng ký để bắt đầu nghe</h1>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Tên hiển thị"
          className="w-full p-3 rounded bg-gray-800 border border-gray-600 text-white placeholder-gray-400"
        />
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
          onClick={handleSignup}
          disabled={loading}
          className="w-full py-3 rounded-full bg-green-500 text-black font-semibold hover:bg-green-400 disabled:opacity-60"
        >
          {loading ? "Đang tạo tài khoản..." : "Đăng ký"}
        </button>
      </div>
    </div>
  );
};

export default Signup;
