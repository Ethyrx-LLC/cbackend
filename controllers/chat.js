const User = require("../models/user")
/* const Message = require("../models/messages") */
const Chat = require("../models/chat")
const asyncHandler = require("express-async-handler")

// RECEIVE A MESSAGE
// SHOW ALL CONVERSATIONS
exports.list_chats = asyncHandler(async (req, res) => {
    const chats = await Chat.find().exec()

    res.status(200).json({ success: true, chats })
})

// START A NEW CONVERSATION
exports.new_chat = asyncHandler(async (req, res) => {
    const sender = await User.findById(req.user).exec()
    const receiver = await User.findById(req.params.id).exec()
    const chat = new Chat({
        sender: sender,
        receiver: receiver,
    })

    chat.save()
    res.status(200).json({ success: true, chat })
})
// SEND A MESSAGE
