const express = require("express");
const appUserControllers = require("../controllers/authController");
const router = express.Router();


router
    .route("/login")
    .post(appUserControllers.login);


module.exports = router;