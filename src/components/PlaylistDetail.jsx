import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { playlists } from "../data";

function PlaylistDetail({ onPlay }) {
  const { title } = useParams();
  const navigate = useNavigate();

  const playlist = playlists.find((p) => p.title === title);

  if (!playlist) return (
    <div className="text-white p-8">
      <p className="text-red-500">Playlist not found</p>
      <button
        onClick={() => navigate("/")}
        className="mt-4 bg-gray-700 px-4 py-2 rounded hover:bg-gray-600"
      >
        ← Go Back
      </button>
    </div>
  );

  return (
    <div className="text-white p-8">
      <button
        onClick={() => navigate("/")}
        className="mb-6 text-sm bg-gray-700 px-4 py-2 rounded hover:bg-gray-600"
      >
        ← Back
      </button>

      <div className="flex flex-col md:flex-row items-center gap-8">
        <img
          src={playlist.image}
          alt={playlist.title}
          className="w-64 rounded-lg shadow-lg"
        />

        <div>
          <h1 className="text-4xl font-bold mb-2">{playlist.title}</h1>
          <p className="text-gray-400 mb-6 text-lg">Artist: {playlist.artist}</p>

          <button
            onClick={() => onPlay(playlist)}
            className="bg-green-500 hover:bg-green-600 px-6 py-3 rounded text-lg font-semibold transition"
          >
            ▶ Play
          </button>
        </div>
      </div>
    </div>
  );
}

export default PlaylistDetail;
