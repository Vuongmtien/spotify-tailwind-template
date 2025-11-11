import React, { useEffect, useState } from "react";
import PlaylistCard from "../components/PlaylistCard";
import { popularArtists } from "../components/homeData";
import api from "../lib/api";

function HomePage({ user, t, handlePlay, navigate, showLoginPopup, setShowLoginPopup }) {
  const [songs, setSongs] = useState([]);
  const [playlists, setPlaylists] = useState([]);

  // 🟢 Lấy danh sách bài hát thật từ Spotify API (backend)
  useEffect(() => {
    const fetchSongs = async () => {
      try {
        const res = await api.get("/api/tracks");
        if (Array.isArray(res.data)) {
          setSongs(res.data);
        } else if (res.data?.tracks?.items) {
          setSongs(res.data.tracks.items);
        } else {
          setSongs([]);
        }
      } catch (err) {
        console.error("❌ Lỗi tải danh sách bài hát:", err);
        setSongs([]);
      }
    };
    fetchSongs();
  }, []);

  // 🟣 Lấy danh sách playlist
  useEffect(() => {
    const fetchPlaylists = async () => {
      try {
        const res = await api.get("/playlists");
        setPlaylists(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error("❌ Lỗi tải playlist:", err);
        setPlaylists([]);
      }
    };
    fetchPlaylists();
  }, []);

  // 🟩 Khi người dùng bấm play
  const handlePlaySong = (song) => {
    if (!user) {
      setShowLoginPopup(true);
      return;
    }

    // Nếu là dữ liệu Spotify
    if (song.preview_url) {
      const playableSong = {
        name: song.name,
        artist: song.artists?.map((a) => a.name).join(", "),
        url: song.preview_url,
        image: song.album?.images?.[0]?.url,
      };
      handlePlay(playableSong);
    } else {
      handlePlay(song);
    }
  };

  return (
    <div className="flex-1 p-8 pt-24 bg-gradient-to-b from-gray-800 to-black overflow-y-auto min-h-screen pb-28">
      {/* 🎵 Bài hát thịnh hành */}
      <h2 className="text-3xl font-bold mb-6">{t.trendingSongs}</h2>
      {songs.length === 0 ? (
        <p className="text-gray-400 mb-12">Chưa có bài hát nào được thêm.</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 mb-12">
          {songs.map((song, index) => (
            <div
              key={song.id || index}
              className="relative bg-[#181818] p-4 rounded-lg hover:bg-[#282828] transition group"
            >
              <img
                src={song.album?.images?.[0]?.url || song.image || "/default.jpg"}
                alt={song.name}
                className="w-full h-40 object-cover rounded"
              />
              <h4 className="mt-2 font-semibold truncate">{song.name}</h4>
              <p className="text-gray-400 text-sm truncate">
                {song.artists?.map((a) => a.name).join(", ") || "Không rõ"}
              </p>

              {/* Nút play */}
              <button
                onClick={() => handlePlaySong(song)}
                className="absolute bottom-4 right-4 bg-green-500 hover:bg-green-600 rounded-full p-3 shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-200"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="white" viewBox="0 0 24 24" width="20" height="20">
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

      {/* 📀 Playlist gợi ý */}
      <h2 className="text-3xl font-semibold mb-4">{t.playlistsForYou}</h2>
      {playlists.length === 0 ? (
        <p className="text-gray-400 mb-8">Chưa có playlist nào được tạo.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {playlists.map((item, index) => (
            <PlaylistCard
              key={item._id || index}
              title={item.name}
              image={item.image}
              artist={`${item.songs?.length || 0} bài hát`}
              onPlay={() => handlePlay(item.songs?.[0])}
              onClick={() => navigate(`/playlist/${item._id}`)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default HomePage;
