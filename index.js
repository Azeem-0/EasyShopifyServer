require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const compression = require('compression');
const authApi = require("./apis/authApi");
const updatesRoute = require("./apis/updatesApi");
const productApi = require("./apis/productApi");
const userApi = require("./apis/userApi");
const userModel = require("./models/userModel");
const { Server } = require("socket.io");
const { updateUsersProduct } = require("./controllers/ProductsController");
const { searchUsers, getMessages } = require('./controllers/userController');
const productModel = require("./models/productModel");
const { updateUsersProduct } = require("./controllers/ProductsController");
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


app.use("/", updatesRoute);
app.use("/auth", authApi);
app.use("/dashboard/product", productApi);
app.use("/user", userApi);

// LISTENING TO PORT

const expressServer = app.listen(port, () => {
  console.log(`Listening to port ${port}`);
});


const io = new Server(expressServer, {
  cors: process.env.FRONT_END_URL,
  methods: ["Get", "Post", "Delete", "Patch"]
})


io.on('connection', (socket) => {

  socket.on('search-user', async (data) => {
    const currUser = data.email;
    const reqUser = data.userSearch;
    const users = await searchUsers(currUser, reqUser);
    socket.emit('on-search-user', users);
  });

  socket.on('get-messages', async (data) => {
    const messages = await getMessages(data);
    socket.emit('on-get-messages', messages);
  });

  socket.on('send-product', async (data) => {
    const result = await updateUsersProduct(data.email, data.name, data.sendingProduct);
    socket.emit('successfully-send-product', result);
  });

  console.log(socket.id);
  socket.on('send-product', async (data) => {
    await updateUsersProduct(data.email, data.name, data.sendingProduct);
  })

})
