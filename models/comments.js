const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CommentsSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "User" },
  text: { type: String, required: true },
  likes: Number,
  dislikes: Number,
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Comments", CommentsSchema);
