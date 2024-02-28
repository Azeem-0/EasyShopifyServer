const express = require("express");
const { makeAllMessagesSeen } = require("../controllers/userController");
const router = express.Router();
router.post('/makeAllMessagesSeen', makeAllMessagesSeen);
module.exports = router;
