const mongoose = require("mongoose")
const Schema = mongoose.Schema

const MessageSchema = new Schema({
    sender: { type: Schema.Types.ObjectId, ref: "User", required: true },
    message: { type: String },
    createdAt: { type: Date, default: Date.now },
})

module.exports = mongoose.model("Messages", MessageSchema)
