const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ListingSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "User" },
  title: { type: String, required: true },
  content: { type: String, required: true },
  category: { type: Schema.Types.ObjectId, ref: "Category" },
  likes: Number,
  comments: [{ type: Schema.Types.ObjectId, ref: "Comments" }],

  urgency: Number,
  views: Number,
  createdAt: { type: Date, index: true },
});

ListingSchema.virtual("url").get(function () {
  return "/" + this._id;
});

ListingSchema.index({ createdAt: -1 });

module.exports = mongoose.model("Listing", ListingSchema);
