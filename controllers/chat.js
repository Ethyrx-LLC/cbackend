const User = require("../models/user")
const Message = require("../models/messages")
const Chat = require("../models/chat")
const asyncHandler = require("express-async-handler")

// RECEIVE A MESSAGE
exports.all_messages = asyncHandler(async (req, res) => {
    const chat = await Chat.findById(req.params.id)
        .lean()
        .populate({
            path: "messages",
            populate: {
                path: "sender",
                select: "username emoji",
            },
        })
        .populate({
            path: "participants",
            select: "username emoji",
        })
        .exec()

    res.status(200).json({
        chat: chat,
    })
})
// SHOW ALL CONVERSATIONS
exports.list_chats = asyncHandler(async (req, res) => {
    const userChats = await User.findById(req.user)
        .lean()
        .populate({
            path: "chats",
            select: "participants",
            populate: [
                {
                    path: "participants",
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
    const chatExists = await Chat.findOne({ participants: [sender, receiver] })

    if (chatExists === null) {
        const chat = new Chat({
            participants: [sender, receiver],
        })
        sender.chats.push(chat)
        receiver.chats.push(chat)
        await Promise.all([sender.save(), receiver.save(), chat.save()])

        res.status(200).json({ success: true, chat })
    } else {
        const chat = chatExists
        res.status(200).json({ success: true, chat })
    }
})

// SEND A MESSAGE
exports.send_message = asyncHandler(async (req, res) => {
    const chat = await Chat.findById(req.params.id).exec()
    const sender = await User.findById(req.user).exec()
    const receiver = chat.participants.filter(
        (user) => user._id.toString() !== req.user.id
    )[0]
    const message = new Message({
        sender: sender,
        receiver: receiver,
        message: req.body.message,
        createdAt: Date.now(),
    })

    chat.messages.push(message)
    message.save()
    chat.save()
    res.json({ success: true, chat })
})
