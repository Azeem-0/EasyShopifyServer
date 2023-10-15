require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const Redis = require("ioredis");
const compression = require('compression');
const authApi = require("./apis/authApi");
const updatesRoute = require("./apis/updatesApi");
const productApi = require("./apis/productApi");
const port = process.env.PORT || 3001;
const app = express();

// CONNECTING TO MONGODB

mongoose.connect(process.env.DB).then(() => {
  console.log("Connected To DataBase");
});


// MIDDLE WARES

app.use(cors());
app.use(express.json());
app.use(compression());


//Routes

app.use("/", updatesRoute);
app.use("/auth", authApi);
app.use("/dashboard/product", productApi);

// LISTENING TO PORT

app.listen(port, () => {
  console.log(`Listening to port ${port}`);
});
