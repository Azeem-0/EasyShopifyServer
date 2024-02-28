const express = require("express");
const { makeAllMessagesSeen, reactToMessage } = require("../controllers/userController");
const router = express.Router();
router.post('/makeAllMessagesSeen', makeAllMessagesSeen);
router.post('/reactToMessage', reactToMessage);
module.exports = router;
