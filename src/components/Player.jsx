import React, { useEffect, useState } from "react";

const Player = ({ token, trackUri }) => {
  const [player, setPlayer] = useState(null);
  const [deviceId, setDeviceId] = useState(null);
  const [currentTrack, setCurrentTrack] = useState(null);
  const [isPaused, setIsPaused] = useState(true);

  useEffect(() => {
    if (!token) {
      console.warn("⚠️ Chưa có Spotify token — vui lòng đăng nhập lại!");
      return;
    }

    // ✅ Định nghĩa callback trước khi load script
    window.onSpotifyWebPlaybackSDKReady = () => {
      const spotifyPlayer = new window.Spotify.Player({
        name: "Tiem Spotify Player 🎵",
        getOAuthToken: (cb) => cb(token),
        volume: 0.7,
      });

      setPlayer(spotifyPlayer);

      spotifyPlayer.addListener("ready", ({ device_id }) => {
        console.log("✅ Spotify Player ready with ID:", device_id);
        setDeviceId(device_id);
      });

      spotifyPlayer.addListener("not_ready", ({ device_id }) => {
        console.warn("❌ Spotify Player disconnected:", device_id);
      });

      spotifyPlayer.addListener("player_state_changed", (state) => {
        if (!state) return;
        setIsPaused(state.paused);
        setCurrentTrack(state.track_window.current_track);
      });

      spotifyPlayer.connect();
    };

    // ✅ Chỉ load script 1 lần duy nhất
    if (!document.getElementById("spotify-player-script")) {
      const script = document.createElement("script");
      script.id = "spotify-player-script";
      script.src = "https://sdk.scdn.co/spotify-player.js";
      script.async = true;
      document.body.appendChild(script);
    }

    return () => {
      if (player) player.disconnect();
    };
  }, [token]);

  // ✅ Phát bài khi có track URI
  useEffect(() => {
    if (deviceId && trackUri && token) {
      fetch(`https://api.spotify.com/v1/me/player/play?device_id=${deviceId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ uris: [trackUri] }),
      }).catch((err) => console.error("❌ Không thể phát nhạc:", err));
    }
  }, [deviceId, trackUri, token]);

  return (
    <div className="bg-[#181818] text-white p-4 flex items-center justify-between border-t border-gray-800 fixed bottom-0 left-0 right-0 z-50">
      {currentTrack && (
        <div className="flex items-center space-x-4">
          <img
            src={currentTrack.album.images[0].url}
            alt="Album"
            className="w-12 h-12 rounded"
          />
          <div>
            <h3 className="font-bold">{currentTrack.name}</h3>
            <p className="text-sm text-gray-400">
              {currentTrack.artists.map((a) => a.name).join(", ")}
            </p>
          </div>
        </div>
      )}
      {player && (
        <button
          onClick={() => player.togglePlay()}
          className="bg-green-500 hover:bg-green-600 px-4 py-2 rounded-lg"
        >
          {isPaused ? "▶️ Phát" : "⏸ Dừng"}
        </button>
      )}
    </div>
  );
};

export default Player;
