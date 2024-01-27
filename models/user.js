const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  username: String,
  email: String,
  password: String,
  emoji: String,
  listing_likes: [{ type: Schema.Types.ObjectId, ref: "Listing" }],
  comment_likes: [{ type: Schema.Types.ObjectId, ref: "Comments" }],
  comment_dislikes: [{ type: Schema.Types.ObjectId, ref: "Comments" }],
  listings: [{ type: Schema.Types.ObjectId, ref: "Listing" }],
  comments: [{ type: Schema.Types.ObjectId, ref: "Comments" }],
});

module.exports = mongoose.model("User", UserSchema);
