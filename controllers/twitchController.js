require('dotenv').config()
const Twitch = require('../models/Twitch')
const Auth = require('../models/Auth')



exports.runTwitchAd = async (req,res) => {
    try {
        const { twitch_id, duration, unx_id } = req.body.data

        const userJwtToken = req.headers.authorization

        const verified = await Auth.verifyUserJWT(userJwtToken, unx_id)

        if(!verified){
            res.status(401).json({ message: 'Not Authorized'})
            return
        }

        const { client_id, accessToken } = await Twitch.getUserConfigData(unx_id)


        const adRes = await Twitch.runTwitchAd(accessToken, twitch_id, duration, client_id)


        if (adRes.status === 400) {
            return res.status(201).json({ message: adRes.message });
          }
          res.status(200).json({ message: adRes.response.data });


    } catch (error) {
        console.log('twitchController runTwitchAd Error: ', error)
    }
}