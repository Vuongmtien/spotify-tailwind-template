import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Callback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const hash = window.location.hash;
    const token = new URLSearchParams(hash.substring(1)).get("access_token");

    if (token) {
      // ✅ Lưu token vào localStorage
      localStorage.setItem("spotify_token", token);
      alert("✅ Đã kết nối Spotify thành công!");
      navigate("/"); // quay lại trang chủ (hoặc /admin nếu anh muốn)
    } else {
      alert("❌ Không nhận được token từ Spotify!");
      navigate("/");
    }
  }, [navigate]);

  return (
    <div className="text-white p-10 text-center">
      <p>Đang xử lý kết nối Spotify...</p>
    </div>
  );
};

export default Callback;
