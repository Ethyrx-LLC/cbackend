const { Server } = require("socket.io")

// Array to store information about online users
let onlineUsers = []

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

        socket.on("send-message", (poster, sender, receiver, message) => {
            // Since we have a sender and receiver which are constant on the database, we have to kind of reverse the
            //process of choosing whom to send the notification to.
            // We define sendTo for readability, probably not required by rewriting this whole section
            let sendTo = ""
            if (poster._id === sender) sendTo = receiver
            else if (poster._id === receiver) sendTo = sender

            // // Let's combine the console logs altogether
            // // const DATA = { poster, sender, receiver, message }
            // // console.log(`DATA: ${JSON.stringify(DATA)}`)

            // Make sure poster is not the person we're supposed to send a notification to
            if (poster._id !== sendTo) {
                // Check if receiver is online
                const onlineUser = onlineUsers.find(
                    (user) => user.userId === sendTo
                )
                // // console.log("Online: " + JSON.stringify(onlineUser))
                // The receiver is online, here we send the socket event to the receiver.
                if (onlineUser) {
                    // // console.log("Socket sent to user " + sendTo)
                    // // TODO: Maybe send the poster User, so frontend can display notifications nicely?
                    io.to(onlineUser.socketId).emit("message-received", {
                        sender: {
                            username: poster.username,
                            emoji: poster.emoji,
                        },
                        message,
                    })
                }
            } else if (poster !== sender) {
                console.log(
                    "Poster is the same as the receiver, we did not send the socket event."
                )
            }
        })
    })

    // Return the configured Socket.IO server instance
    return io
}

// Export the initSocketServer function
module.exports = initSocketServer
