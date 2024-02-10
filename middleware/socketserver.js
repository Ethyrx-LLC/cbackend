const { Server } = require("socket.io");
let onlineUsers = [];
const initSocketServer = () => {
  const io = new Server(3001, {
    cors: ["http://localhost:5173"],
  });

  io.on("connection", (socket) => {
    console.log(socket.id);
    socket.on("online-status", (status) => {
      io.emit("online", status);
    });

    socket.on("new-user-add", (userID) => {
      if (!onlineUsers.some((user) => user.userId === userID)) {
        // if user is not added before
        onlineUsers.push({ userId: userID, socketId: socket.id });
        console.log("new user is here!", onlineUsers);
      }
      // send all active users to new user
      if (userID !== null) {
        io.emit("get-users", onlineUsers);
      }
    });
    socket.on("disconnect", () => {
      onlineUsers = onlineUsers.filter((user) => user.socketId !== socket.id);
      console.log("user disconnected", onlineUsers);
      // send all online users to all users
      io.emit("get-users", onlineUsers);
    });

    socket.on("offline", () => {
      // remove user from active users
      onlineUsers = onlineUsers.filter((user) => user.socketId !== socket.id);
      console.log("user is offline", onlineUsers);
      // send all online users to all users
      io.emit("get-users", onlineUsers);
    });
  });

  return io;
};

module.exports = initSocketServer;
