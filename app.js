require("dotenv").config();
const express = require("express");
const cors = require("cors");

const sequelize = require("./utils/database");
const userRoutes = require("./routes/user");
const chatRoutes = require("./routes/chat");

// tables
const Users = require("./models/users");
const Chats = require("./models/chats");

const app = express();

app.use(express.json());
app.use(cors());
app.use(express.static("public"));

// Routes
app.use("/user", userRoutes);
app.use("/chat", chatRoutes);

// associations
Users.hasMany(Chats);
Chats.belongsTo(Users);

const PORT = process.env.PORT || 4000;

sequelize
  .sync()
  // .sync({ force: true })
  .then(() => {
    console.log(`SERVER RUNNING ON PORT NUMBER ${PORT}`);
    app.listen(PORT);
  })
  .catch((err) => {
    console.log(err);
  });

// app.listen(PORT);
