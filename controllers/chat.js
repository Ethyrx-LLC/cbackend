const User = require("../models/user")
const Message = require("../models/messages")
const Chat = require("../models/chat")
const asyncHandler = require("express-async-handler")
const env = process.env.NODE_ENV || "development"
const redis = require("redis")
let redisClient
;(async () => {
    env === "development"
        ? (redisClient = redis.createClient())
        : (redisClient = redis.createClient({ url: process.env.REDIS }))

    redisClient.on("error", (error) => console.error(`Error : ${error}`))

    env === "development" ? "" : await redisClient.connect()
})()
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
    const chat = new Chat({
        participants: [sender, receiver],
    })
    const existingChat = await Chat.findOne({
        participants: [sender, receiver],
    })
    if (existingChat) {
        return res.status(200).json({ success: true, chat: existingChat })
    }
    sender.chats.push(chat)
    receiver.chats.push(chat)
    await Promise.all([
        sender.save(),
        receiver.save(),
        chat.save(),
        env === "development" ? "" : redisClient.DEL("chats"),
    ])
    res.status(200).json({ success: true, chat })
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
    env === "development" ? "" : await redisClient.DEL("chats")
    chat.save()
    res.json({ success: true, chat })
})
