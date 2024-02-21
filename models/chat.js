const mongoose = require("mongoose")
const Schema = mongoose.Schema

const ChatSchema = new Schema({
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
    messages: [
        { type: Schema.Types.ObjectId, ref: "Messages", required: true },
    ],
})

module.exports = mongoose.model("Chat", ChatSchema)
