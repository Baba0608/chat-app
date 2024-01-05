require("dotenv").config();
const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const sequelize = require("./utils/database");
const userRoutes = require("./routes/user");
const chatRoutes = require("./routes/chat");

// tables
const Users = require("./models/users");
const Privatefriend = require("./models/private-friend");

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

app.use(express.json());
app.use(cors());
app.use(express.static("public"));

// Routes
app.use("/user", userRoutes);
app.use("/chat", chatRoutes);

// associations

Users.hasMany(Privatefriend);
Privatefriend.belongsTo(Users, {
  foreignKey: "friendId",
});

// ---------

let connectedUsers = {};
let userFriends = {};

io.on("connection", async (socket) => {
  socket.emit("connection-event", socket.id);

  socket.on("connected-user", (userId) => {
    connectedUsers[userId] = socket.id;
    connectedUsers[socket.id] = userId;
  });

  socket.on("friends-list", (result) => {
    userFriends[socket.id] = result;

    if (userFriends[socket.id]) {
      userFriends[socket.id].forEach(({ id }) => {
        if (id in connectedUsers) {
          socket
            .to(connectedUsers[id])
            .emit("user-online", connectedUsers[socket.id]);
        }
      });
    }
  });

  socket.on("activity-check", (id) => {
    if (id in connectedUsers) {
      socket.emit("activity-result", true);
    } else {
      socket.emit("activity-result", false);
    }
  });

  socket.on("send-message", ({ message, socketId }) => {
    socket.to(socketId).emit("private-message", {
      msg: message,
      senderUserId: connectedUsers[socket.id],
    });
  });

  socket.on("disconnect", () => {
    const userId = connectedUsers[socket.id];
    delete connectedUsers[socket.id];
    delete connectedUsers[userId];

    if (userFriends[socket.id]) {
      userFriends[socket.id].forEach(({ id }) => {
        socket.to(connectedUsers[id]).emit("user-offline", userId);
      });
    }

    delete userFriends[socket.id];
  });
});

// ---------------------------------
const PORT = process.env.PORT || 4000;

sequelize
  .sync()
  // .sync({ force: true })
  .then(() => {
    console.log(`SERVER RUNNING ON PORT NUMBER ${PORT}`);
    server.listen(PORT);
  })
  .catch((err) => {
    console.log(err);
  });

// app.listen(PORT);
