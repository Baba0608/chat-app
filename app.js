require("dotenv").config();
const express = require("express");
const cors = require("cors");

const sequelize = require("./utils/database");
const userRoutes = require("./routes/user");

const app = express();

app.use(express.json());
app.use(cors());
app.use(express.static("public"));

// Routes
app.use("/user", userRoutes);

const PORT = process.env.PORT || 4000;

sequelize
  .sync()
  //.sync({force: true})
  .then(() => {
    console.log(`SERVER RUNNING ON PORT NUMBER ${PORT}`);
    app.listen(PORT);
  })
  .catch((err) => {
    console.log(err);
  });

// app.listen(PORT);
