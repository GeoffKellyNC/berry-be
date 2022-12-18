const express = require("express")
const musicController = require("../controllers/musicController")
const router = express.Router();




router
    .route("/getAllMusic")
    .post(musicController.getAllMusic)

module.exports = router;