import React, { useEffect, useState } from "react";
import PlaylistCard from "../components/PlaylistCard";
import { popularArtists } from "../components/homeData";
import api from "../lib/api";

function HomePage({ user, t, handlePlay, navigate }) {
  const [songs, setSongs] = useState([]);
  const [playlists, setPlaylists] = useState([]);
  const spotifyToken = localStorage.getItem("spotify_token");


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
      }
    };
    fetchSongs();
  }, []);

  const handlePlaySong = (song) => {
  // Nếu chưa đăng nhập Spotify
  if (!spotifyToken) {
    alert("🔒 Vui lòng đăng nhập Spotify để nghe nhạc!");
    return;
  }

  const playableSong = {
    name: song.name,
    artist: song.artists?.map((a) => a.name).join(", "),
    url: song.preview_url,
    image: song.album?.images?.[0]?.url,
    uri: song.uri,
  };

  handlePlay(playableSong);
};

  return (
    <div className="flex-1 p-8 pt-24 bg-gradient-to-b from-gray-800 to-black overflow-y-auto min-h-screen pb-28">
      <h2 className="text-3xl font-bold mb-6">{t.trendingSongs}</h2>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 mb-12">
        {songs.map((song, index) => (
          <div
            key={index}
            className="relative bg-[#181818] p-4 rounded-lg hover:bg-[#282828] transition group"
          >
            <img
              src={song.album?.images?.[0]?.url || "/default.jpg"}
              alt={song.name}
              className="w-full h-40 object-cover rounded"
            />
            <h4 className="mt-2 font-semibold truncate">{song.name}</h4>
            <p className="text-gray-400 text-sm truncate">
              {song.artists?.map((a) => a.name).join(", ") || "Không rõ"}
            </p>
            <button
              onClick={() => handlePlaySong(song)}
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
    </div>
  );
}

export default HomePage;
