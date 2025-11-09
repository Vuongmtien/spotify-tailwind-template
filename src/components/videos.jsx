import React, { useState } from "react";

const videoList = [
  { id: "dQw4w9WgXcQ", title: "Rick Astley - Never Gonna Give You Up", category: "US-UK" },
  { id: "3JZ_D3ELwOQ", title: "Adele - Hello", category: "US-UK" },
  { id: "hT_nvWreIhg", title: "Charlie Puth - We Don’t Talk Anymore", category: "US-UK" },
  { id: "fRh_vgS2dFE", title: "Justin Bieber - Sorry", category: "US-UK" },
  { id: "RgKAFK5djSk", title: "Wiz Khalifa - See You Again", category: "US-UK" },

  { id: "knW7-x7Y7RE", title: "Sơn Tùng M-TP - Hãy Trao Cho Anh", category: "Việt Nam" },
  { id: "32sYGCOYJUM", title: "Sơn Tùng M-TP - Chạy Ngay Đi", category: "Việt Nam" },
  { id: "Ws-QlpSltr8", title: "Đen Vâu - Trốn Tìm ft. MTV band", category: "Việt Nam" },
  { id: "gJHSDZfJrRY", title: "Hoàng Thùy Linh - See Tình", category: "Việt Nam" },
  { id: "8x2NjwwHUbQ", title: "Jack - Hồng Nhan", category: "Việt Nam" },
  { id: "iE52-XXnQqs", title: "AMEE x B RAY - Anh Nhà Ở Đâu Thế", category: "Việt Nam" },
  { id: "UVbv-PJXm14", title: "Đen Vâu - Mang Tiền Về Cho Mẹ ft. Nguyên Thảo", category: "Việt Nam" },
  ];


function Videos() {
  const [currentVideo, setCurrentVideo] = useState(videoList[0].id);
  const [filter, setFilter] = useState("All");

  const filteredVideos =
    filter === "All"
      ? videoList
      : videoList.filter((video) => video.category === filter);

  return (
    <div className="p-8 text-white min-h-screen bg-gradient-to-b from-gray-900 to-black">
      <h1 className="text-3xl font-bold mb-6">🎬 Video Music</h1>

      <div className="w-full max-w-4xl aspect-video mx-auto mb-10">
        <iframe
          width="100%"
          height="100%"
          src={`https://www.youtube.com/embed/${currentVideo}`}
          title="YouTube video player"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      </div>

      <div className="flex gap-3 mb-6">
        {["All", "US-UK", "Việt Nam"].map((cat) => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`px-4 py-1 rounded-full text-sm font-semibold transition ${
              filter === cat
                ? "bg-green-500 text-white"
                : "bg-gray-700 hover:bg-gray-600"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredVideos.map((video) => (
          <div
            key={video.id}
            className="bg-[#181818] rounded-lg overflow-hidden hover:scale-105 transition cursor-pointer"
            onClick={() => setCurrentVideo(video.id)}
          >
            <img
              src={`https://img.youtube.com/vi/${video.id}/hqdefault.jpg`}
              alt={video.title}
              className="w-full h-48 object-cover"
            />
            <div className="p-3">
              <p className="text-sm font-semibold truncate">{video.title}</p>
              <span className="text-xs text-gray-400">{video.category}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Videos;
