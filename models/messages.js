const mongoose = require("mongoose")
const Schema = mongoose.Schema

const MessageSchema = new Schema({
    sender: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true,
    },
    receiver: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true,
    },
    message: { type: String, required: true },
    createdAt: { type: Date, default: Date.now, index: true },
})

module.exports = mongoose.model("Messages", MessageSchema)
