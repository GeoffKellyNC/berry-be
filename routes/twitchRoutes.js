const express = require("express");
const twitchController = require('../controllers/authController')

const router = express.Router()



router
    .route('/runAd')
    .post(twitchController.runTwitchAd)

