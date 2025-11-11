import React, { createContext, useContext, useState, useEffect } from "react";
import api from "../lib/api.js";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // ✅ Đăng nhập
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

  // ✅ Đăng ký
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
    }
  };

  // ✅ Tự động khôi phục user khi reload trang
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) setUser(JSON.parse(savedUser));
    setLoading(false);
  }, []);

  return (
  <AuthContext.Provider value={{ user, setUser, loading, login, signup, logout }}>
    {!loading && children}
  </AuthContext.Provider>
);
}

export function useAuth() {
  return useContext(AuthContext);
}
