const express = require("express");
const { getRegistration, getLogin, authorize, getOauthLogin } = require("../controllers/authController");
const router = express.Router();

router.post("/login", getLogin);
router.post('/oauth/login', getOauthLogin);
router.post("/register", getRegistration);
router.post("/authorize", authorize);

module.exports = router;