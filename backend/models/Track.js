import mongoose from "mongoose";

const trackSchema = new mongoose.Schema({
  name: { type: String, required: true },
  artist: String,
  image: String,
  audio: String,
  spotifyId: { type: String, unique: true },
});

export default mongoose.model("Track", trackSchema);