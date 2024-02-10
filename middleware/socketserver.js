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
      console.log(`CURRENT USER IS ${userID}`);
    });
  });

  return io;
};

module.exports = initSocketServer;
