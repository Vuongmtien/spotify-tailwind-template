import React, { useEffect, useState } from "react";
import PlaylistCard from "../components/PlaylistCard";
import { popularArtists } from "../components/homeData";
import api from "../lib/api";

function HomePage({
  user,
  t,
  loading,
  handlePlay,
  navigate,
  showLoginPopup,
  setShowLoginPopup,
}) {
  const [songs, setSongs] = useState([]);
  const [playlists, setPlaylists] = useState([]);

  // 🟢 Lấy danh sách bài hát thật từ backend
  useEffect(() => {
    const fetchSongs = async () => {
      try {
        const res = await api.get("/tracks");

        let list = [];
        if (Array.isArray(res.data)) list = res.data;
        else if (Array.isArray(res.data.items)) list = res.data.items;
        else if (Array.isArray(res.data.tracks)) list = res.data.tracks;
        else if (Array.isArray(res.data.data)) list = res.data.data;

        console.log("🎧 Dữ liệu bài hát:", list);
        setSongs(list);
      } catch (err) {
        console.error("❌ Lỗi khi tải danh sách bài hát:", err);
        setSongs([]);
      }
    };

    fetchSongs();
  }, []);

  // 🎶 Lấy danh sách playlist thật từ backend
  useEffect(() => {
    const fetchPlaylists = async () => {
      try {
        const res = await api.get("/playlists");

        let list = [];
        if (Array.isArray(res.data)) list = res.data;
        else if (Array.isArray(res.data.playlists)) list = res.data.playlists;
        else if (Array.isArray(res.data.data)) list = res.data.data;
        else if (Array.isArray(res.data.items)) list = res.data.items;

        console.log("📀 Dữ liệu playlist:", list);
        setPlaylists(list);
      } catch (err) {
        console.error("❌ Lỗi khi tải danh sách playlist:", err);
        setPlaylists([]);
      }
    };

    fetchPlaylists();
  }, []);

  return (
    <div className="flex-1 p-8 pt-24 bg-gradient-to-b from-gray-800 to-black overflow-y-auto min-h-screen pb-28">
      {/* 🎵 Bài hát thịnh hành (dữ liệu thật) */}
      <h2 className="text-3xl font-bold mb-6">{t.trendingSongs}</h2>
      {songs.length === 0 ? (
        <p className="text-gray-400 mb-12">Chưa có bài hát nào được thêm.</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 mb-12">
          {songs.map((song, index) => (
            <div
              key={song._id || index}
              className="relative bg-[#181818] p-4 rounded-lg hover:bg-[#282828] transition group"
            >
              <img
                src={
                  song.image ||
                  "https://i.scdn.co/image/ab67616d0000b273000000000000000000000000"
                }
                alt={song.title}
                className="w-full h-40 object-cover rounded"
              />
              <h4 className="mt-2 font-semibold truncate">{song.title}</h4>
              <p className="text-gray-400 text-sm truncate">{song.artist}</p>

              <button
                onClick={() => {
                  if (!user) setShowLoginPopup(true);
                  else handlePlay(song);
                }}
                className="absolute bottom-4 right-4 bg-green-500 hover:bg-green-600 rounded-full p-3 shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-200"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="white"
                  viewBox="0 0 24 24"
                  width="20"
                  height="20"
                >
                  <path d="M8 5v14l11-7z" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}

      {/* 🎤 Nghệ sĩ nổi bật */}
      <h2 className="text-3xl font-bold mb-6">{t.popularArtists}</h2>
      <div className="flex gap-6 mb-12">
        {popularArtists.map((artist, index) => (
          <div
            key={index}
            className="text-center cursor-pointer hover:scale-105 transition"
            onClick={() => navigate(`/artist/${artist.name}`)}
          >
            <img
              src={artist.image}
              alt={artist.name}
              className="w-28 h-28 md:w-32 md:h-32 rounded-full object-cover mx-auto border-2 border-gray-700"
            />
            <p className="mt-2 text-white">{artist.name}</p>
          </div>
        ))}
      </div>

      {/* 📀 Playlists thật từ backend */}
      <h2 className="text-3xl font-semibold mb-4">{t.playlistsForYou}</h2>
      {playlists.length === 0 ? (
        <p className="text-gray-400 mb-8">Chưa có playlist nào được tạo.</p>
      ) : (
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {playlists.map((item, index) => (
            <PlaylistCard
              key={item._id || index}
              title={item.name || item.title}
              image={
                item.image ||
                "https://i.scdn.co/image/ab67616d0000b273000000000000000000000000"
              }
              artist={
                item.songs && item.songs.length > 0
                  ? `${item.songs.length} bài hát`
                  : "Chưa có bài hát"
              }
              onPlay={() => {
                if (item.songs && item.songs.length > 0) {
                  handlePlay(item.songs[0]); // phát bài đầu tiên trong playlist
                }
              }}
              onClick={() => navigate(`/playlist/${item._id}`)}
            />
          ))}
        </div>
      )}

      {/* 🔒 Popup đăng nhập */}
      {showLoginPopup && (
        <div className="fixed top-1/3 left-1/2 -translate-x-1/2 bg-blue-500 text-black p-6 rounded-xl shadow-lg w-96 z-50">
          <h2 className="text-xl font-bold mb-2">Đăng nhập để tiếp tục</h2>
          <p className="text-sm mb-4">Bạn cần đăng nhập để nghe bài hát.</p>
          <div className="flex justify-end gap-3">
            <button
              className="px-4 py-1 rounded-full font-bold hover:underline"
              onClick={() => setShowLoginPopup(false)}
            >
              Để sau
            </button>
            <button
              className="bg-white text-black font-bold px-4 py-1 rounded-full"
              onClick={() => {
                setShowLoginPopup(false);
                navigate("/login");
              }}
            >
              Đăng nhập
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default HomePage;
