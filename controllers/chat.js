const User = require("../models/user")
const Message = require("../models/messages")
const Chat = require("../models/chat")
const asyncHandler = require("express-async-handler")

// RECEIVE A MESSAGE
// SHOW ALL CONVERSATIONS
exports.list_chats = asyncHandler(async (req, res) => {
    const chats = await Chat.find().exec()

    res.status(200).json({ success: true, chats })
})

// START A NEW CONVERSATION
// SEND A MESSAGE
