import React from "react";

const LibraryPrompt = ({ onClose }) => {
  return (
    <div className="absolute top-16 left-20 bg-blue-400 text-black p-4 rounded-xl shadow-lg w-80">
      <div className="absolute -left-2 top-6 w-0 h-0 border-t-8 border-b-8 border-r-8 border-t-transparent border-b-transparent border-r-blue-400"></div>
      <h2 className="text-lg font-bold mb-1">Tạo danh sách phát</h2>
      <p className="mb-4 text-sm">Đăng nhập để tạo và chia sẻ playlist.</p>
      <div className="flex justify-end space-x-2">
        <button
          onClick={onClose}
          className="px-4 py-1 rounded-full font-bold hover:underline"
        >
          Để sau
        </button>
        <button className="bg-white text-black font-bold px-4 py-1 rounded-full">
          Đăng nhập
        </button>
      </div>
    </div>
  );
};

export default LibraryPrompt;
