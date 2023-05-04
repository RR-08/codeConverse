const express = require('express');
const http = require('http');
const path = require('path');
const { Server } = require('socket.io');
const { ExpressPeerServer } = require('peer');
const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ["GET","POST"]
  },
});

const peerServer = ExpressPeerServer(server, {
  debug: true
});

app.use('/peerjs', peerServer);
  // Set static folder
  app.use(express.static('client/build'));

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'public', 'index.html'));
  })
// }
const userSocketMap = {};
function getAllConnectedClients(roomId) {
  // Map
  return Array.from(io.sockets.adapter.rooms.get(roomId) || []).map(
      (socketId) => {
          return {
              socketId,
              username: userSocketMap[socketId],
          };
      }
  );
}
io.on('connection', (socket) => {
  console.log("Connected");
  let currUserId, currUserName, currRoom;

  socket.on("join-room", (roomId, id, username) => {
    userSocketMap[socket.id] = username;
    socket.join(roomId);
    socket.to(roomId).emit("user-connected", id, username);
    const clients = getAllConnectedClients(roomId);
        clients.forEach(({ socketId }) => {
            io.to(socketId).emit("joined", {
                clients,
                username,
                socketId: socket.id,
            });
        });
    currUserId = id;
    currUserName = username;
    currRoom = roomId;

    socket.on("set-info", (srcId, destId, username, streamInfo) => {
      socket.to(roomId).emit("get-info", srcId, destId, username, streamInfo);
    });

    socket.on("set-audio", (userId, isAudio) => {
      io.to(roomId).emit("get-audio", userId, isAudio);
    });

    socket.on("set-video", (userId, isVideo) => {
      io.to(roomId).emit("get-video", userId, isVideo);
    });

    socket.on("replace-stream", (userId, username) => {
      socket.to(roomId).emit("stream-replaced", userId, username);
    });

    socket.on("message-sent", (username, message) => {
      socket.to(roomId).emit("message", username, message);
    });
    
    socket.on("code-change", ({ roomId, code }) => {
      socket.in(roomId).emit("code-change", { code });
  });

  });

  socket.on('disconnect', () => {
    console.log("Disonnected");
    socket.to(currRoom).emit("user-disconnected", currUserId, currUserName);
  });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => console.log(`Server started on port ${PORT}`));