const express = require("express");
const twitchController = require('../controllers/twitchController')

const router = express.Router()



router
    .route('/getChatMods')
    .post(twitchController.getChatMods)


router
    .route('/runAd')
    .post(twitchController.runTwitchAd);

router
    .route('/twitchChatSettings')
    .post(twitchController.getTwitchChatSettings)

router 
    .route('/autoModSettings')
    .post(twitchController.getAutoModSettings)

router
    .route('/currentStreamData')
    .post(twitchController.getCurrentStreamData)



module.exports = router;

