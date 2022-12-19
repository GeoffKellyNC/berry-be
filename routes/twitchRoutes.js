const express = require("express");
const twitchController = require('../controllers/twitchController')

const router = express.Router()



router
    .route('/runAd')
    .post(twitchController.runTwitchAd);

router
    .route('/twitchChatSettings')
    .post(twitchController.getTwitchChatSettings)

router 
    .route('/autoModSettings')
    .post(twitchController.getAutoModSettings)

module.exports = router;

