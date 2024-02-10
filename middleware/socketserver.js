const { Server } = require("socket.io");

const initSocketServer = () => {
  const io = new Server(3000, {
    cors: ["http://localhost:5173"],
  });

  io.on("connection", (socket) => {
    console.log(socket.id);
    socket.on("online-status", (status) => {
      socket.emit("online", status);
    });
  });

  return io;
};

module.exports = initSocketServer;
