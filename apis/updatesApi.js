require("dotenv").config();
const express = require("express");
const router = express.Router();
const { changeName, changePassword, changePhNumber, changeWallet } = require("../controllers/updateController");


router.post("/updateName", changeName);

router.post("/updatePassword", changePassword);

router.post("/updatePhNumber", changePhNumber);

router.post("/updateWallet", changeWallet);

module.exports = router;