const express = require("express");
const { createServer } = require("node:http");
const cors = require("cors");

const app = express();
app.use(cors());

const server = createServer(app);
const io = require("socket.io")(server, {
  cors: {
    // origin: "https://socket-io-r7qg.onrender.com",
    origin: "http://localhost:3000",
  },
});

app.get("/", (req, res) => {
  res.send("Hello world");
});

app.get("/checkRoom/:roomId", (req, res) => {
  const roomId = req.params.roomId;
  if (io.sockets.adapter.rooms.get(roomId)) {
    res.json({ exists: true });
  } else {
    res.json({ exists: false });
  }
});

io.on("connection", (socket) => {
  socket.on("createRoom", (roomId) => {
    if (io.sockets.adapter.rooms.get(roomId)) {
      socket.emit("error", "Try again.");
    } else {
      socket.join(roomId);
    }
  });

  socket.on("enterRoom", (roomId) => {
    if (io.sockets.adapter.rooms.get(roomId)) {
      socket.join(roomId);
      io.to(roomId).emit("newMember",socket.id);
    } else {
      socket.emit("error", "Room not found.");
    }
  });

  socket.on("messageToRoom", (data) => {
    io.to(data.roomId).emit("messageToClient", data);
  });

  socket.on("leaveRoom", (roomId) => {
    socket.leave(roomId);
    io.to(roomId).emit("leftRoom",socket.id);
  });
});

server.listen(5000, () => {
  console.log("server running at http://localhost:5000");
});
