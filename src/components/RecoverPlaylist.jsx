import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { trendingSongs } from "../components/homeData";
import { useLanguage } from "../context/LanguageContext";
import { texts } from "../constants/texts";

const RecoverPlaylist = () => {
  const navigate = useNavigate();
  const favorites = JSON.parse(localStorage.getItem("favorites")) || [];

  const { language } = useLanguage();
  const t = texts[language] || texts.vi;

  const [deleted, setDeleted] = useState(
    trendingSongs.filter(
      (song) => !favorites.some((f) => f.title === song.title)
    )
  );

  const handleRestore = (song) => {
    const updatedFavorites = [...favorites, song];
    localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
    setDeleted(deleted.filter((s) => s.title !== song.title));
  };

  return (
    <div className="min-h-screen bg-black text-white pt-24 px-6 max-w-4xl mx-auto space-y-6">
      <button
        onClick={() => navigate("/profile")}
        className="text-sm text-green-400 hover:underline"
      >
        ← {t.backToProfile}
      </button>

      <h1 className="text-2xl font-bold mb-4">{t.recoverPlaylist}</h1>

      {deleted.length === 0 ? (
        <p className="text-gray-400">{t.noDeleted}</p>
      ) : (
        <div className="space-y-4">
          {deleted.map((song, index) => (
            <div
              key={index}
              className="flex items-center justify-between bg-[#181818] p-4 rounded-lg shadow"
            >
              <div className="flex items-center gap-4">
                <img
                  src={song.image}
                  alt={song.title}
                  className="w-16 h-16 rounded object-cover"
                />
                <div>
                  <h2 className="font-semibold">{song.title}</h2>
                  <p className="text-sm text-gray-400">{song.artist}</p>
                </div>
              </div>
              <button
                onClick={() => handleRestore(song)}
                className="bg-green-500 hover:bg-green-400 text-black px-4 py-1 rounded-full"
              >
                {t.restore}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RecoverPlaylist;
