require("dotenv").config();
const express = require("express");
const router = express.Router();
const { changeName, changePassword, changePhNumber, changeWallet, checkoutPage } = require("../controllers/updateController");


router.post("/updateName", changeName);

router.post("/updatePassword", changePassword);

router.post("/updatePhNumber", changePhNumber);

router.post("/updateWallet", changeWallet);

router.post('/checkoutPage', checkoutPage);

module.exports = router;