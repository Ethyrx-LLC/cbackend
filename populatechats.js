require("dotenv").config()

const mongoose = require("mongoose")
const Chat = require("./models/chat") // Update the path accordingly
const User = require("./models/user") // Update the path accordingly

const mongoDB = process.env.MONGO_URI

main().catch((err) => console.log(err))

async function main() {
    console.log("Debug: About to connect")
    await mongoose.connect(mongoDB)
    console.log("Debug: Should be connected?")
    await createChats()
    console.log("Debug: Closing mongoose")
    mongoose.connection.close()
}

async function chatCreate(senderId, receiverId) {
    const sender = await User.findById(senderId)
    const receiver = await User.findById(receiverId)

    if (!sender || !receiver) {
        console.log(
            `Error: Sender or receiver not found for IDs ${senderId}, ${receiverId}`
        )
        return
    }

    const chat = new Chat({
        sender: senderId,
        receiver: receiverId,
    })

    await chat.save()
    console.log(
        `Added chat between ${sender.username} and ${receiver.username}`
    )

    // Push the chat ID into the "chats" array for both sender and receiver
    sender.chats.push(chat._id)
    receiver.chats.push(chat._id)

    await Promise.all([sender.save(), receiver.save()])
    console.log(`Updated users with chat IDs`)
}

async function createChats() {
    console.log("Adding Chats")

    const senderId = "65ab8ece801ccc839c0166a1" // Sender user ID
    const receiverId = "65ae622bc21f8c25e206c683" // Receiver user ID

    await chatCreate(senderId, receiverId)
    // Add more chat creations as needed
}
