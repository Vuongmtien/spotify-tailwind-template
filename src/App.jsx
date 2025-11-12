import React, { useState, useRef, useEffect } from "react";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import AdminDashboard from "./pages/AdminDashboard";
import Player from "./components/Player";
import Profile from "./components/Profile";
import EditProfile from "./components/EditProfile";
import Signup from "./components/Signup";
import Login from "./components/Login";
import Callback from "./pages/Callback";
import { useLanguage } from "./context/LanguageContext";
import { texts } from "./constants/texts";

function App() {
  const location = useLocation();
  const navigate = useNavigate();
  const { language } = useLanguage();
  const t = texts[language] || texts.vi;

  const [showSidebar, setShowSidebar] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [currentSong, setCurrentSong] = useState(null);
  const [spotifyToken, setSpotifyToken] = useState(localStorage.getItem("spotify_token"));
  const [trackUri, setTrackUri] = useState(null);

  const handlePlay = (song) => {
    // Nếu là nhạc Spotify
    if (song.url && song.url.includes("p.scdn.co")) {
      setCurrentSong(song);
      setTrackUri(song.uri || null);
    } else {
      setCurrentSong(song);
      setTrackUri(null);
    }
  };
  useEffect(() => {
  const hash = window.location.hash;
  if (hash.includes("access_token")) {
    const token = new URLSearchParams(hash.replace("#", "?")).get("access_token");
    if (token) {
      localStorage.setItem("spotify_token", token);
      setSpotifyToken(token);
      window.history.replaceState(null, "", window.location.pathname);
    }
  }
}, []);

  return (
    <div className="flex h-screen bg-black text-white">
      <Navbar toggleSidebar={() => setShowSidebar(!showSidebar)} />
      <div className="flex flex-1 overflow-hidden">
        {!["/login", "/signup"].includes(location.pathname) && (
          <Sidebar showSidebar={showSidebar} />
        )}

        <div className="flex-1 flex flex-col overflow-y-auto pb-28">
          <Routes>
            <Route
              path="/"
              element={
                <HomePage
                  user={user}
                  t={t}
                  loading={loading}
                  handlePlay={handlePlay}
                  navigate={navigate}
                />
              }
            />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/profile/edit" element={<EditProfile />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/callback" element={<Callback />} />
          </Routes>
        </div>
      </div>

      {/* Thanh phát nhạc */}
      {currentSong && (
        <div className="fixed bottom-0 left-0 right-0 z-50">
          {trackUri ? (
            <Player token={spotifyToken} trackUri={trackUri} />
          ) : (
            <div className="bg-[#181818] p-4 flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <img
                  src={currentSong.image || "/default.jpg"}
                  alt={currentSong.name}
                  className="w-14 h-14 rounded object-cover"
                />
                <div>
                  <h3 className="font-bold">{currentSong.name}</h3>
                  <p className="text-sm text-gray-400">{currentSong.artist}</p>
                </div>
              </div>
              <audio src={currentSong.url} autoPlay controls className="w-64" />
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default App;
