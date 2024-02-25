const { Server } = require("socket.io")

// Array to store information about online users
let onlineUsers = []
//const sockets = {}

// Function to initialize the Socket.IO server
const initSocketServer = () => {
    // Create a new Socket.IO server instance
    const io = new Server(3001, {
        cors: [
            process.env.NODE_ENV === "development"
                ? "http://localhost:5173"
                : process.env.FRONTEND_URL,
        ],
    })

    // Event handler for a new socket connection
    io.on("connection", (socket) => {
        // Event handler for "online-status" event
        socket.on("online-status", (status) => {
            // Broadcast "online" event to all connected sockets
            io.emit("online", status)
        })

        // Event handler for "new-user-add" event
        socket.on("new-user-add", (userID) => {
            if (!onlineUsers.some((user) => user.userId === userID)) {
                // If user is not added before, add to onlineUsers array
                onlineUsers.push({ userId: userID, socketId: socket.id })
                console.log("new user is here!", onlineUsers)
            }

            // Send all active users to the new user
            if (userID !== null) {
                io.emit("get-users", onlineUsers)
            }
        })

        // Event handler for "disconnect" event
        socket.on("disconnect-socket", () => {
            // Remove the disconnected user from onlineUsers array
            onlineUsers = onlineUsers.filter(
                (user) => user.socketId !== socket.id
            )
            console.log("user disconnected", onlineUsers)

            // Send updated list of online users to all users
            io.emit("get-users", onlineUsers)
        })

        // Event handler for "offline" event
        socket.on("offline", () => {
            // Remove the user from active users when they go offline
            onlineUsers = onlineUsers.filter(
                (user) => user.socketId !== socket.id
            )
            console.log("user is offline", onlineUsers)

            // Send updated list of online users to all users
            io.emit("get-users", onlineUsers)
        })

        socket.on("send-message", (data) => {
            console.log(data)
            const receiver = onlineUsers.find(
                (receiver) => receiver.userId === data.receiverId
            )

            if (receiver !== undefined) {
                io.to(receiver.socketId).emit("message-received", {
                    chatId: data.chatId,
                    chatMessage: data.message,
                    sender: data.sender,
                })
            }
        })
    })

    // Return the configured Socket.IO server instance
    return io
}

// Export the initSocketServer function
module.exports = initSocketServer
