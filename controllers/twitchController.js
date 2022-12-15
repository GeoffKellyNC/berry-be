require('dotenv').config()
const Twitch = require('../models/Twitch')
const Auth = require('../models/Auth')



exports.runTwitchAd = async (req,res) => {
    try {
        const { userJwtToken, twitch_id, duration, unx_id } = req.data

        const verified = await Auth.verifyUserJWT(userJwtToken, unx_id)

        if(!verified){
            res.status(401).json({ message: 'Not Authorized'})
            return
        }

        const { client_id, access_token } = await Twitch.getUserConfigData

        const adRes = await Twitch.runTwitchAd(access_token, twitch_id, duration, client_id)

        if (adRes.response.data.status === 400) {
            return res.status(200).json({ message: adRes.response.data });
          }
          res.status(200).json({ message: adRes.response.data });






    } catch (error) {
        console.log('twitchController runTwitchAd Error: ', error)
    }
}