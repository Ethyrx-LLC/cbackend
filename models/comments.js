const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CommentsSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  text: { type: String, required: true },
  listing: { type: Schema.Types.ObjectId, ref: "Listing" },
  likes: Number,
  dislikes: Number,
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Comments", CommentsSchema);
