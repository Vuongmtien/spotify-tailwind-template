import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Search, Home } from "lucide-react";
import { playlists } from "../data";
import { useLanguage } from "../context/LanguageContext";
import { texts } from "../constants/texts";
import { trendingSongs } from "../components/homeData";
import { useAuth } from "../context/auth";
const Navbar = ({ toggleSidebar }) => {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const { language } = useLanguage();
  const t = texts[language] || texts.vi;

  const { user, logout } = useAuth();

  const allSongs = [...playlists, ...trendingSongs];
  const results = query
    ? allSongs.filter((p) =>
        p.title.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  const handleSearchClick = (title) => {
    navigate(`/playlist/${title}`);
    setQuery("");
  };

  const handleLogout = async () => {
    try {
      await logout(); 
      navigate("/");
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <header className="bg-gradient-to-b from-gray-800 to-black text-white fixed top-0 left-0 right-0 z-[999] flex items-center justify-between px-4 py-3 shadow-md h-16">
      <div className="flex items-center gap-3">
        <button onClick={toggleSidebar} className="md:hidden text-white text-2xl">
          ☰
        </button>

        <img
          src="/logo.png"
          alt="Logo"
          className="h-8 w-8 object-contain cursor-pointer"
          onClick={() => navigate("/")}
        />

        <Home
          size={26}
          className="cursor-pointer hover:text-green-400"
          onClick={() => navigate("/")}
        />
      </div>

      <div className="relative w-full max-w-md">
        <input
          type="text"
          placeholder={t.searchPlaceholder}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full bg-[#121212] text-white pl-10 pr-4 py-2 rounded-full border border-gray-600 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
        />
        <Search className="absolute top-2 left-3 text-gray-400" size={18} />

        {query && (
          <div className="absolute top-full mt-2 bg-black border border-gray-700 rounded-lg w-full z-50 max-h-64 overflow-y-auto shadow-lg">
            {results.length === 0 ? (
              <p className="text-sm text-gray-400 p-3">{t.noSearchResult}</p>
            ) : (
              results.map((item, index) => (
                <div
                  key={index}
                  className="p-3 hover:bg-gray-800 cursor-pointer text-sm border-b border-gray-700"
                  onClick={() => {
                    if (!user) {
                      window.dispatchEvent(new CustomEvent("show-login-popup"));
                    } else {
                      const audio = new Audio(item.audio);
                      audio.play();
                      handleSearchClick(item.title);
                    }
                    setQuery("");
                  }}
                >
                  🎵 {item.title} – {item.artist}
                </div>
              ))
            )}
          </div>
        )}
      </div>

      <div className="flex gap-4 items-center text-sm">
        <Link to="/premium" className="hover:underline cursor-pointer">
          {t.premium}
        </Link>
        <span onClick={() => navigate("/support")} className="hover:underline cursor-pointer">
          {t.support}
        </span>
        <span onClick={() => navigate("/download")} className="hover:underline cursor-pointer">
          {t.download}
        </span>
        <span className="hidden lg:inline">|</span>
        <span className="hover:underline cursor-pointer hidden lg:inline">
          {t.installApp}
        </span>

        {user ? (
          <div className="flex items-center gap-2">
            <span
              className="font-semibold text-green-400 cursor-pointer hover:underline"
              onClick={() => navigate("/profile")}
              title={user.email}
            >
              👤 {user.username || "User"}
            </span>
            <button onClick={handleLogout} className="text-xs underline hover:text-red-400">
              Đăng xuất
            </button>
          </div>
        ) : (
          <>
            <span className="hover:underline cursor-pointer" onClick={() => navigate("/signup")}>
              {t.signup}
            </span>
            <button
              onClick={() => navigate("/login")}
              className="bg-white text-black px-4 py-1 rounded-full hover:opacity-90"
            >
              {t.login}
            </button>
          </>
        )}
      </div>
    </header>
  );
};

export default Navbar;
