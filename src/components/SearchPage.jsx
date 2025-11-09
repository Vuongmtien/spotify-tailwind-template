import React from "react";
import { playlists } from "../data";
import PlaylistCard from "./PlaylistCard";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";
import { texts } from "../constants/texts";

function SearchPage({ onPlay }) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const query = searchParams.get("query") || "";

  const results = playlists.filter((p) =>
    p.title.toLowerCase().includes(query.toLowerCase())
  );

  const { language } = useLanguage();
  const t = texts[language] || texts.vi;

  return (
    <div className="flex-1 p-8 text-white">
      <h2 className="text-2xl font-semibold mb-6">
        🔍 {t.searchResultTitle}: <span className="text-green-400">{query}</span>
      </h2>

      {results.length === 0 ? (
        <p className="text-gray-400">{t.searchNotFound}</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {results.map((item, index) => (
            <PlaylistCard
              key={index}
              title={item.title}
              image={item.image}
              artist={item.artist}
              audio={item.audio}
              onPlay={() => onPlay(item)}
              onClick={() => navigate(`/playlist/${item.title}`)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default SearchPage;
