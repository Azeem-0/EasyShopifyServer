require("dotenv").config();
const userModel = require("../models/userModel");
const bcrypt = require("bcrypt");
const { access } = require("fs");
const jwt = require("jsonwebtoken");

async function getRegistration(req, res) {
  let { name, email, phNumber, password, address, profileUrl } = req.body.authInfo;
  !profileUrl ? profileUrl = 'https://img.freepik.com/free-vector/businessman-character-avatar-isolated_24877-60111.jpg?w=740& t=st=1694273374~exp=1694273974~hmac=9b65d53a65ee3f425191fc478cdf4e7edf46ebc24cfb8fb488d20a142b9542d0' : null;
  const user = await userModel.findOne({ email: email });
  if (user) {
    res.json({ message: "Already registered! Please try to log in ", status: true });
  }
  else {
    try {
      bcrypt.hash(password, 5).then((hashedPassword) => {
        const newUser = new userModel({
          name: name,
          email: email.toLowerCase(),
          phNumber: phNumber,
          password: hashedPassword,
          address: address,
          wallet: 500,
          profileImage: profileUrl,
          ordersPrice: 0
        });
        newUser.save();
      });
      res.json({
        message: "Successfully Registered!",
        status: true,
        user: false,
      });
    } catch (error) {
      console.log(error.message);
      res.json({ message: "Something went wrong. Please refresh the page and try again.", status: false });
    }
  }
}

async function getLogin(req, res) {
  const { email, password } = req.body.authInfo;
  try {
    const user = await userModel.findOne({ email: email.toLowerCase() });
    if (!user) {
      res.json({
        message: "There is no account registered! Please Register",
        status: true,
      });
    } else {
      const result = await bcrypt.compare(password, user.password);
      if (!result) {
        res.json({ message: "Incorrect Password", status: false, user: false });
      } else {
        const accessToken = jwt.sign(
          {
            id: user._id,
            email: user.email,
            name: user.name,
          },
          process.env.SECRET,
          { expiresIn: "3h" }
        );
        res.json({
          message: "Successfully logged in",
          status: true,
          user: accessToken,
        });
      }
    }
  } catch (error) {
    console.log(error.message);
    res.json({ message: "Something went wrong. Please refresh the page and try again.", status: false, user: false });
  }
}

async function getOauthLogin(req, res) {
  const { credential } = req.body.credentialResponse;
  const decodedToken = jwt.decode(credential);
  const user = await userModel.findOne({ email: decodedToken.email });
  var newUser = user;
  if (!user) {
    newUser = {
      _id: decodedToken.iat,
      email: decodedToken.email,
      name: decodedToken.name,
      address: 'vzm',
      profileImage: decodedToken.picture,
      wallet: 500,
      ordersPrice: 0,
      orders: [],
      cart: []
    }
  }
  const accessToken = jwt.sign(
    {
      id: newUser._id,
      email: newUser.email,
      name: newUser.name,
    },
    process.env.SECRET,
    { expiresIn: "3h" }
  );
  res.json({
    message: "Successfully logged in",
    status: true,
    user: accessToken,
  });
}

async function authorize(req, res) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      res.json({ message: "Missing Token", status: false });
    }
    else {
      const token = authHeader.split(" ")[1];
      const decodedToken = jwt.decode(token, process.env.SECRET);
      if (decodedToken) {
        const expiryTimestamp = decodedToken.exp;
        const currentTimestamp = Math.floor(Date.now() / 1000);
        if (expiryTimestamp && currentTimestamp > expiryTimestamp) {
          res.json({ message: "Token Expired!", status: false });
        } else {
          res.json({ message: "Token valid", status: true });
        }
      } else {
        res.json({ message: "Token Invalid", status: false });
      }
    }
  }
  catch (err) {
    res.json({ message: "Something went wrong. Please refresh the page and try again.", status: false })
  }
}

module.exports = { getRegistration, getLogin, authorize, getOauthLogin };
