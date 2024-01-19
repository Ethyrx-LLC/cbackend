const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const listings = require("./listing");

const CategorySchema = new Schema({
  title: String,
  listings: [listings.Schema],
});

module.exports = mongoose.model("Category", CategorySchema);
