const User = require("../models/user")
const Message = require("../models/messages")
const Chat = require("../models/chat")
const asyncHandler = require("express-async-handler")

// RECEIVE A MESSAGE
exports.all_messages = asyncHandler(async (req, res) => {
    const chat = await Chat.findById(req.params.id)
        .populate({
            path: "messages",
            populate: {
                path: "sender",
                select: "username emoji",
            },
        })
        .populate({
            path: "sender receiver",
            select: "username emoji",
        })
        .lean()
        .exec()

    console.log(req.params.id)

    res.status(200).json({
        chat: chat,
    })
})
// SHOW ALL CONVERSATIONS
exports.list_chats = asyncHandler(async (req, res) => {
    const userChats = await User.findById(req.user)
        .populate({
            path: "chats",
            select: "sender receiver",
            populate: [
                {
                    path: "sender receiver",
                    select: "username emoji",
                },
            ],
        })
        .exec()
    res.status(200).json({ success: true, chats: userChats.chats })
})

// START A NEW CONVERSATION
exports.new_chat = asyncHandler(async (req, res) => {
    const sender = await User.findById(req.user).exec()
    const receiver = await User.findById(req.params.id).exec()
    const chat = new Chat({
        sender: sender,
        receiver: receiver,
    })

    sender.chats.push(chat)
    receiver.chats.push(chat)
    chat.save()
    sender.save()
    receiver.save()
    res.status(200).json({ success: true, chat })
})
// SEND A MESSAGE
exports.send_message = asyncHandler(async (req, res) => {
    const chat = await Chat.findById(req.params.id).exec()
    const sender = await User.findById(req.user).exec()

    if (chat.sender !== req.user) {
        res.status(401).json({ success: false })
    }
    const message = new Message({
        sender: sender,
        message: req.body.message,
        createdAt: Date.now(),
    })

    chat.messages.push(message)
    message.save()
    chat.save()
    res.json({ success: true, chat })
})
