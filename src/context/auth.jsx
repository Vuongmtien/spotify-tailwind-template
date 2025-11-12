import React, { createContext, useContext, useState, useEffect } from "react";
import api from "../lib/api.js";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Các scope Spotify cần để phát nhạc
  const scopes = [
    "user-read-private",
    "user-read-email",
    "streaming",
    "user-read-playback-state",
    "user-modify-playback-state",
    "user-read-currently-playing",
  ];

  const clientId = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
  const redirectUri = import.meta.env.VITE_SPOTIFY_REDIRECT_URI;

  // ✅ Lấy token Spotify từ URL sau khi đăng nhập
  useEffect(() => {
    const hash = window.location.hash;
    if (hash) {
      const token = new URLSearchParams(hash.replace("#", "?")).get("access_token");
      if (token) {
        localStorage.setItem("spotify_token", token);
        window.location.hash = "";
      }
    }
  }, []);

  // ✅ Đăng nhập Spotify (dành cho người nghe nhạc)
  const loginSpotify = () => {
    const authUrl = `https://accounts.spotify.com/authorize?response_type=token&client_id=${clientId}&scope=${scopes.join(
      "%20"
    )}&redirect_uri=${redirectUri}`;
    window.location.href = authUrl;
  };

  // ✅ Đăng nhập tài khoản web (admin / user)
  const login = async (email, password) => {
    try {
      const { data } = await api.post("/api/auth/login", { email, password });
      setUser(data.user);
      localStorage.setItem("user", JSON.stringify(data.user));
      localStorage.setItem("token", data.token);
      return data.user;
    } catch (err) {
      throw err.response?.data?.message || "Đăng nhập thất bại!";
    }
  };

  // ✅ Đăng ký tài khoản web
  const signup = async (name, email, password) => {
    try {
      const { data } = await api.post("/api/auth/register", { name, email, password });
      return data;
    } catch (err) {
      throw err.response?.data?.message || "Đăng ký thất bại!";
    }
  };

  // ✅ Đăng xuất
  const logout = async () => {
    try {
      await api.post("/api/auth/logout", {}, { withCredentials: true });
    } catch (err) {
      console.error("Lỗi khi logout:", err);
    } finally {
      setUser(null);
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      localStorage.removeItem("spotify_token");
    }
  };

  // ✅ Tự động khôi phục user khi reload trang
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) setUser(JSON.parse(savedUser));
    setLoading(false);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        loading,
        login,
        signup,
        logout,
        loginSpotify, // ✅ thêm hàm này để đăng nhập Spotify
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
