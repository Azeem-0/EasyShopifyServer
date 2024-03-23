require("dotenv").config();
const express = require("express");
const router = express.Router();
const { changeName, changePassword, changePhNumber, changeWallet, checkoutPage, updateProfile } = require("../controllers/updateController");


router.post("/updateName", changeName);

router.post("/updatePassword", changePassword);

router.post("/updatePhNumber", changePhNumber);

router.post("/updateWallet", changeWallet);

router.post('/checkoutPage', checkoutPage);

router.post('/updateProfile', updateProfile);

module.exports = router;