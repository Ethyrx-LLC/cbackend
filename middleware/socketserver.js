const { Server } = require("socket.io");
let onlineUsers = [];
const initSocketServer = () => {
  const io = new Server(3001, {
    cors: ["http://localhost:5173"],
  });

  io.on("connection", (socket) => {
    socket.on("new-user-add", (userID) => {
      if (!onlineUsers.some((user) => user.userId === userID)) {
        // if user is not added before
        onlineUsers.push({ userId: userID, socketId: socket.id });
        console.log("new user is here!", onlineUsers);
      }
      // send all active users to new user
      io.emit("get-users", onlineUsers);
    });
  });

  return io;
};

module.exports = initSocketServer;
