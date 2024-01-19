const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  username: String,
  email: String,
  password: String,
  admin: Boolean,
  listings: { type: Schema.Types.ObjectId, ref: "Listing" },
});

module.exports = mongoose.model("User", UserSchema);
