const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { DateTime } = require("luxon");

const ListingSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "User" },
  title: { type: String, required: true },
  content: { type: String, required: true },
  category: { type: Schema.Types.ObjectId, ref: "Category" },
  likes: Number,
  comments: [
    {
      user: { type: Schema.Types.ObjectId, ref: "User" },
      text: { type: String, required: true },
      likes: Number,
      dislikes: Number,
      createdAt: { type: Date, default: Date.now },
    },
  ],
  urgency: Number,
  views: Number,
  createdAt: { type: Date, default: Date.now },
});

ListingSchema.virtual("url").get(function () {
  return "/" + this._id;
});

module.exports = mongoose.model("Listing", ListingSchema);
