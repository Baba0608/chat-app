require("dotenv").config();
const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const bodyParser = require("body-parser");

const sequelize = require("./utils/database");
const userRoutes = require("./routes/user");
const chatRoutes = require("./routes/chat");
const groupRoutes = require("./routes/group");
const fileRoutes = require("./routes/file");

// tables
const User = require("./models/users");
const PrivateFriend = require("./models/private-friend");
const Group = require("./models/groups");
const GroupMember = require("./models/group-members");
const GroupChat = require("./models/group-chat");

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());
app.use(express.static("public"));

// Routes

app.use("/user", userRoutes);
app.use("/chat", chatRoutes);
app.use("/group", groupRoutes);
app.use("/file", fileRoutes);
app.use((req, res) => {
  const routesArr = req.url.split("/");
  res.sendFile(`${routesArr[1]}`, { root: "views" });
});
// associations

User.hasMany(PrivateFriend);
PrivateFriend.belongsTo(User, {
  foreignKey: "friendId",
});

User.belongsToMany(Group, { through: GroupMember, foreignKey: "userId" });
Group.belongsToMany(User, { through: GroupMember, foreignKey: "groupId" });

User.hasMany(GroupChat);
GroupChat.belongsTo(User);

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

  socket.on("send-message", ({ message, FRIEND_ID }) => {
    const socketId = connectedUsers[FRIEND_ID];
    if (socketId) {
      socket.to(socketId).emit("private-message", {
        msg: message,
        senderUserId: connectedUsers[socket.id],
      });
    }
  });

  socket.on(
    "send-group-message",
    ({ message, SELECTED_GROUP_MEMBERS, GROUP_ID, USER_ID }) => {
      Object.keys(SELECTED_GROUP_MEMBERS).forEach((id) => {
        socket.to(connectedUsers[id]).emit("message-in-group", {
          msg: message,
          groupId: GROUP_ID,
          senderId: USER_ID,
          senderNumber: SELECTED_GROUP_MEMBERS[id][0],
        });
      });
    }
  );

  socket.on("first-message", ({ senderUserId, msg, USER_ID }) => {
    socket
      .to(connectedUsers[senderUserId])
      .emit("send-number", { msg, senderUserId: USER_ID });
  });

  socket.on(
    "sending-number",
    ({ msg, senderUserId, mobile, userId, privateId }) => {
      socket
        .to(connectedUsers[senderUserId])
        .emit("receiving-first-msg", { mobile, userId, privateId });
    }
  );

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
const PORT = process.env.PORT || 3000;

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
