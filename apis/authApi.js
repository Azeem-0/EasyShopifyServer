const express = require("express");
const { getRegistration, getLogin, authorize } = require("../controllers/authController");
const router = express.Router();

router.post("/login", getLogin);
router.post("/register", getRegistration);
router.post("/authorize", authorize);

module.exports = router;