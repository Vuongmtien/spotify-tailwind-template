import React from "react";

function PlaylistCard({ title, image, onPlay }) {
  const handleClick = (e) => {
    e.stopPropagation(); 

    const savedUser = localStorage.getItem("user");
    if (!savedUser) {
      window.dispatchEvent(new CustomEvent("show-login-popup"));
    } else {
      onPlay();
    }
  };

  return (
    <div className="relative group bg-[#181818] rounded-lg p-4 hover:bg-[#282828] transition duration-300 cursor-pointer shadow-md w-full hover:scale-[1.03]">
      <div className="relative">
        <img
          src={image}
          alt={title}
          className="rounded mb-3 w-full h-40 object-cover"
        />

        <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="relative group/play">
<button
  onClick={handleClick}
  className="bg-green-500 hover:bg-green-600 p-3 rounded-full shadow-md hover:scale-110 transition duration-200"
>
  <svg xmlns="http://www.w3.org/2000/svg" fill="white" viewBox="0 0 24 24" width="20" height="20">
    <path d="M8 5v14l11-7z" />
  </svg>
</button>
            <span className="absolute bottom-full mb-2 right-0 bg-gray-700 text-xs text-white px-2 py-1 rounded opacity-0 group-hover/play:opacity-100 transition-opacity duration-300">
              Play {title}
            </span>
          </div>
        </div>
      </div>
      <h3 className="text-white font-semibold truncate">{title}</h3>
    </div>
  );
}

export default PlaylistCard;
