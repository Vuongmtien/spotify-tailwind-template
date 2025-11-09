import React from "react";
import { useParams } from "react-router-dom";
import { artistData } from "../data/artistData";

const ArtistDetail = () => {
  const { artistName } = useParams();
  const artist = artistData[artistName];

  if (!artist) return <div className="text-white p-8 pt-24">Artist not found</div>;

  return (
    <div className="text-white pt-0">
      <div
        className="w-full h-96 bg-cover bg-center flex items-end px-8 pb-10"
        style={{
          backgroundImage: `url(${artist.banner})`,
          backgroundPosition: "center 20%",
        }}
      >
        <div>
          <h1 className="text-6xl font-bold">{artist.name}</h1>
          <p className="text-gray-300 mt-2">
            {artist.monthlyListeners} người nghe hằng tháng
          </p>
        </div>
      </div>

      <div className="flex items-center gap-4 px-8 py-6">
        <button className="w-14 h-14 rounded-full bg-green-500 flex items-center justify-center hover:scale-105 transition">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="white"
            viewBox="0 0 24 24"
            width="24"
            height="24"
          >
            <path d="M5 3l14 9-14 9V3z" />
          </svg>
        </button>

        <img
          src={artist.avatar}
          alt="Artist Avatar"
          className="w-12 h-12 rounded-md border border-white"
        />

        <button className="px-4 py-2 border border-white rounded-full font-semibold hover:bg-white hover:text-black transition">
          Đang theo dõi
        </button>

        <button className="text-white text-3xl ml-2">⋯</button>
      </div>

      <div className="px-8">
        <h2 className="text-2xl font-bold mb-4">Phổ biến</h2>
        <div className="space-y-4">
          {artist.popularSongs.map((song, idx) => (
            <div
              key={idx}
              className="flex justify-between border-b border-gray-700 pb-2"
            >
              <span>
                {idx + 1}. {song.title}
              </span>
              <div className="text-gray-400 flex gap-8">
                <span>{song.plays}</span>
                <span>{song.duration}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="px-8 mt-12">
        <h2 className="text-2xl font-bold mb-4">Danh sách đĩa nhạc</h2>

        <div className="flex gap-3 mb-6">
          <button className="bg-white text-black px-4 py-1 rounded-full font-semibold">Bản phát hành nổi tiếng</button>
          <button className="bg-gray-800 px-4 py-1 rounded-full">Album</button>
          <button className="bg-gray-800 px-4 py-1 rounded-full">Đĩa đơn và Đĩa mở rộng (EP)</button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
          {artist.albums.map((album, idx) => (
            <div key={idx} className="text-sm">
              <img
                src={album.cover}
                alt={album.title}
                className="rounded mb-2 w-full object-cover aspect-square"
              />
              <div className="text-white font-semibold leading-tight">{album.title}</div>
              <div className="text-gray-400 text-xs mt-1">{album.year} • {album.type}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="px-8 mt-16">
        <h2 className="text-2xl font-bold mb-4">Giới thiệu</h2>
        <div className="relative w-full h-[400px] rounded overflow-hidden">
          <img
            src={artist.aboutImage}
            alt="about"
            className="w-full h-full object-cover"
          />
          <div className="absolute bottom-0 left-0 w-full p-6 bg-gradient-to-t from-black/80 to-transparent text-white">
            <p className="font-bold mb-1">{artist.monthlyListeners} người nghe hằng tháng</p>
            <p className="text-sm leading-relaxed">{artist.bio}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArtistDetail;
