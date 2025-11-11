import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Callback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const hash = window.location.hash;
    if (hash.includes("access_token")) {
      const token = new URLSearchParams(hash.replace("#", "")).get("access_token");
      localStorage.setItem("spotify_token", token);
      alert("✅ Đã kết nối Spotify thành công!");
      navigate("/admin"); // quay lại admin
    } else {
      alert("❌ Không nhận được token từ Spotify!");
      navigate("/admin");
    }
  }, [navigate]);

  return (
    <div className="text-white p-10 text-center">
      <p>Đang xử lý kết nối Spotify...</p>
    </div>
  );
};

export default Callback;
