import mongoose from "mongoose";

const playlistSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    cover: String,
    tracks: [{ type: mongoose.Schema.Types.ObjectId, ref: "Track" }],
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

export default mongoose.model("Playlist", playlistSchema);
