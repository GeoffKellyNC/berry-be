const express = require("express");
const authController = require("../controllers/authController");
const router = express.Router();


router
    .route("/login")
    .post(authController.login);

router
    .route("/logout")
    .post(authController.logout);

router
    .route("/verifyAccess")
    .post(authController.verifyUserAccess);

router
    .route("/ping")
    .get(authController.pingServer)


module.exports = router;