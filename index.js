require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const Redis = require("ioredis");
const compression = require('compression');
const authApi = require("./apis/authApi");
const updatesRoute = require("./apis/updatesApi");
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const productApi = require("./apis/productApi");
const userApi = require("./apis/userApi");
const userModel = require("./models/userModel");
const { Server } = require("socket.io");
const { updateUsersProduct } = require("./controllers/ProductsController");
const { searchUsers, getMessages } = require('./controllers/userController');
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
// passport.use(new GoogleStrategy({
//   clientID: "461594728459-oh7qnijrbl8n6j706t4p830mvgvb3jqi.apps.googleusercontent.com",
//   clientSecret: "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",
//   callbackURL: "http://localhost:3001/auth/google/ecommerce"
// },
//   async function (accessToken, refreshToken, profile, cb) {
//     console.log(profile);
//     const user = await userModel.findOne({ email: profile.emails[0].value })
//     if (user) {
//       return cb(user);
//     }
//     else {
//       const newUser = new userModel({
//         email: profile._json.email,
//         name: profile._json.name,
//         profileImage: profile._json.picture,
//         wallet: 500,
//         ordersPrice: 0,
//         password: 'Googles Login',
//         phNumber: 7995772042
//       })
//       newUser.save();
//       return cb(newUser);
//     }
//   }
// ));


//Routes

// app.get('/auth/google',
//   passport.authenticate('google', { scope: ['profile', 'email'] }));

// app.get('/auth/google/ecommerce',
//   passport.authenticate('google', { failureRedirect: '/login' }),
//   function (req, res) {
//     const user = req.body;
//     console.log(user);
//   });


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

})
