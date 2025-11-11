import React, { useState, useEffect, useRef } from "react";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import PlaylistCard from "./components/PlaylistCard";
import PlaylistDetail from "./components/PlaylistDetail";
import { playlists } from "./data";
import SearchPage from "./components/SearchPage";
import Navbar from "./components/Navbar";
import PodcastsPage from "./components/PodcastsPage";
import PremiumPage from "./components/PremiumPage";
import SupportPage from "./components/SupportPage";
import DownloadSection from "./components/DownloadSection";
import Signup from "./components/Signup";
import Login from "./components/Login";
import { useLanguage } from "./context/LanguageContext";
import { texts } from "./constants/texts";
import Profile from "./components/Profile";
import PlanManagement from "./components/PlanManagement";
import EditProfile from "./components/EditProfile";
import RecoverPlaylist from "./components/RecoverPlaylist";
import PodcastRankings from "./components/PodcastRanking";
import ArtistDetail from "./components/ArtistDetail";
import Videos from "./components/videos";
import HomePage from "./pages/HomePage";
import api from "./lib/api";
import AdminDashboard from "./pages/AdminDashboard";
import Callback from "./pages/Callback";
function App() {
  const location = useLocation();
  const navigate = useNavigate();
  const { language } = useLanguage();
  const t = texts[language] || texts.vi;

  const hideSidebarRoutes = [
    "/premium",
    "/download",
    "/signup",
    "/support",
    "/login",
    "/profile",
    "/account/plan",
    "/profile/edit",
    "/playlist/recover",
  ];

  const [showSidebar, setShowSidebar] = useState(false);
  const [showLoginPopup, setShowLoginPopup] = useState(false);
  const [user, setUser] = useState(null);
  const [checkingSession, setCheckingSession] = useState(true);
  const [loading, setLoading] = useState(true);

  const [currentSong, setCurrentSong] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [favorites, setFavorites] = useState([]);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const closeSidebar = () => setShowSidebar(false);
    window.addEventListener("close-sidebar", closeSidebar);
    return () => window.removeEventListener("close-sidebar", closeSidebar);
  }, []);

  useEffect(() => {
    const handler = () => setShowLoginPopup(true);
    window.addEventListener("show-login-popup", handler);
    return () => window.removeEventListener("show-login-popup", handler);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const updateProgress = () => {
      const percent = (audio.currentTime / audio.duration) * 100;
      setProgress(isNaN(percent) ? 0 : percent);
    };
    audio.addEventListener("timeupdate", updateProgress);
    return () => audio.removeEventListener("timeupdate", updateProgress);
  }, [currentSong]);

  // ✅ Kiểm tra session user (chỉ gọi nếu có token)
  useEffect(() => {
    let mounted = true;
    const token = localStorage.getItem("token");

    if (!token) {
      if (mounted) {
        setUser(null);
        setCheckingSession(false);
      }
      return;
    }

    (async () => {
      try {
        if (mounted) setUser(r.data);
      } catch (err) {
        if (mounted) setUser(null);
      } finally {
        if (mounted) setCheckingSession(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  const filteredPlaylists = playlists;

  const handlePlay = (playlist) => {
    const index = playlists.findIndex((p) => p.title === playlist.title);
    setCurrentIndex(index);
    setCurrentSong(playlist);
    setIsPlaying(true);
    setTimeout(() => audioRef.current?.play(), 0);
    if (!history.find((h) => h.title === playlist.title)) {
      setHistory((prev) => [...prev, playlist]);
    }
  };

  const formatTime = (seconds) => {
    if (!seconds || isNaN(seconds)) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60).toString().padStart(2, "0");
    return `${mins}:${secs}`;
  };

  return (
    <div className="flex h-screen bg-black text-white">
      <Navbar toggleSidebar={() => setShowSidebar(!showSidebar)} />

      <div className="flex flex-1 overflow-hidden">
        {!hideSidebarRoutes.includes(location.pathname) && (
          <Sidebar showSidebar={showSidebar} />
        )}

        <div className="flex-1 flex flex-col overflow-y-auto">
          <Routes>
            <Route
              path="/"
              element={
                user?.role === "admin" ? (
                  <div className="flex flex-col">
                    <HomePage
                      user={user}
                      t={t}
                      loading={loading}
                      handlePlay={handlePlay}
                      navigate={navigate}
                      showLoginPopup={showLoginPopup}
                      setShowLoginPopup={setShowLoginPopup}
                      filteredPlaylists={filteredPlaylists}
                    />
                    <AdminDashboard />
                  </div>
                ) : (
                  <HomePage
                    user={user}
                    t={t}
                    loading={loading}
                    handlePlay={handlePlay}
                    navigate={navigate}
                    showLoginPopup={showLoginPopup}
                    setShowLoginPopup={setShowLoginPopup}
                    filteredPlaylists={filteredPlaylists}
                  />
                )
              }
            />
            <Route path="/playlist/recover" element={<RecoverPlaylist />} />
            <Route path="/podcasts/rankings" element={<PodcastRankings />} />
            <Route path="/artist/:artistName" element={<ArtistDetail />} />
            <Route path="/videos" element={<Videos />} />
            <Route path="/account/plan" element={<PlanManagement />} />
            <Route path="/library" element={<div>Library Page</div>} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/profile/edit" element={<EditProfile />} />
            <Route path="/login" element={<Login />} />
            <Route path="/podcasts" element={<PodcastsPage />} />
            <Route path="/support" element={<SupportPage />} />
            <Route path="/premium" element={<PremiumPage />} />
            <Route path="/download" element={<DownloadSection />} />
            <Route path="/signup" element={<Signup />} />
            <Route
              path="/favorites"
              element={
                <div className="flex-1 p-8 pt-24 text-white">
                  <h2 className="text-2xl font-semibold mb-4">{t.favorites}</h2>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {favorites.map((item, index) => (
                      <PlaylistCard
                        key={index}
                        title={item.title}
                        image={item.image}
                        artist={item.artist}
                        audio={item.audio}
                        onPlay={() => handlePlay(item)}
                        onClick={() => navigate(`/playlist/${item.title}`)}
                      />
                    ))}
                  </div>
                </div>
              }
            />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/callback" element={<Callback />} />


            <Route
              path="/playlist/:title"
              element={<PlaylistDetail onPlay={handlePlay} />}
            />
            <Route path="/search" element={<SearchPage onPlay={handlePlay} />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}

export default App;
