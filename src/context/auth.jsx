import React, { createContext, useContext, useState, useEffect } from "react";
import api from "../lib/api.js";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // ✅ Đăng nhập
  const login = async (email, password) => {
    try {
      await api.post(
        "/api/auth/login",
        { email, password },
        { withCredentials: true }
      );

      setUser(userData);
      localStorage.setItem("user", JSON.stringify(userData));
      localStorage.setItem("userRole", userData.role);
      return userData;
    } catch (err) {
      throw err.response?.data?.message || "Đăng nhập thất bại!";
    }
  };

  // ✅ Đăng ký
  const signup = async (username, email, password) => {
    try {
      const { data } = await api.post(
        "/api/auth/register",
        { username, email, password },
        { withCredentials: true }
      );
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
      localStorage.removeItem("userRole");
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
