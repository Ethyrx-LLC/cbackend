const User = require("../models/user")
const Message = require("../models/messages")
const Chat = require("../models/chat")
const asyncHandler = require("express-async-handler")
const env = process.env.NODE_ENV || "development"
const redis = require("redis")
let redisClient
;(async () => {
    redisClient = redis.createClient({ url: process.env.REDIS })

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
            path: "sender receiver",
            select: "username emoji",
        })
        .exec()

    // https://stackoverflow.com/questions/11637353/comparing-mongoose-id-and-strings
    // This is our check to prevent other users being able to view other peoples' conversations
    // if (
    //     chat.sender._id &&
    //     !req.user._id.equals(chat.sender._id) &&
    //     chat.receiver._id &&
    //     !req.user._id.equals(chat.receiver._id)
    // ) {
    //     return res.status(401).json({ success: false })
    // }

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
            select: "sender receiver",
            populate: [
                {
                    path: "sender receiver",
                    select: "username emoji",
                },
            ],
        })
        .exec()
    env === "development"
        ? ""
        : await redisClient.SET("chats", JSON.stringify(userChats), {
              EX: 3600,
              NX: true,
          })
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
    const existingChat = await Chat.findOne({
        sender: sender._id,
        receiver: receiver._id,
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

    // https://stackoverflow.com/questions/11637353/comparing-mongoose-id-and-strings
    // This is our check to prevent other users being able to post into other conversations
    // if (
    //     chat.sender._id &&
    //     !req.user._id.equals(chat.sender._id) &&
    //     chat.receiver._id &&
    //     !req.user._id.equals(chat.receiver._id)
    // ) {
    //     return res.status(401).json({ success: false })
    // }

    const message = new Message({
        sender: sender,
        message: req.body.message,
        createdAt: Date.now(),
    })

    chat.messages.push(message)
    message.save()
    env === "development" ? "" : await redisClient.DEL("chats")
    chat.save()
    res.json({ success: true, chat })
})
