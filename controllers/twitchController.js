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

exports.getTwitchChatSettings = async (req, res) => {
    try {
        const userData = req.body.data



        const userJwt  = req.headers.authorization

        const verified = await Auth.verifyUserJWT(userJwt, userData.unx_id)

        if(!verified){
            res.status(401).json({ message: 'Not Authorized'})
            return
        }

        const { client_id, accessToken } = await Twitch.getUserConfigData(userData.unx_id)

        const chatSettings = await Twitch.getTwitchChatSettings(userData.twitch_id, accessToken, client_id)


        if(chatSettings.data[0].length < 1){
            res.status(500).json({ message: 'Error getting chat settings'})
            return
        }

        res.status(200).json(chatSettings.data[0])
         


    } catch (error) {
        console.log('twitchController getChatSettings Error: ', error)
    }
}

exports.getAutoModSettings = async (req, res) => {
    try{
        const { userData } = req.body

        const userJwt  = req.headers.authorization

       const verified = await Auth.verifyUserJWT(userJwt, userData.unx_id)

       if(!verified){
        res.status(401).json({ message: 'Not Authorized'})
        return
       }

       const { client_id, accessToken } = await Twitch.getUserConfigData(userData.unx_id)

       const autoModSettings = await Twitch.getAutoModSettings(userData, client_id, accessToken)

       res.status(200).json(autoModSettings)
       
       return

    } catch (error) {
        res.status(200).json(error)
        console.log("🚀 ~ file: twitchController.js:75 ~ exports.getAutoModSettings= ~ error", error)
        return
        
    }

}

exports.getChatMods = async (req, res) => {
    try {

        const user_jwt = req.headers.authorization
        const unx_id = req.headers.unx_id
        const userData  = req.body.data

        const verified = await Auth.verifyUserJWT(user_jwt, unx_id)

        if(!verified){
            res.status(401).json({ message: 'Not Authorized'})
            return
           }

           const { client_id, accessToken } = await Twitch.getUserConfigData(unx_id)

           const chatMods = await Twitch.getChatMods(client_id, accessToken, userData)
           
        //    console.log("🚀 ~ file: twitchController.js:117 ~ exports.getChatMods= ~ chatMods", chatMods) //!REMOVE
        


        
    } catch (error) {
        console.log("🚀 ~ file: twitchController.js:108 ~ exports.getChatMods= ~ error", error)
         
    }
}

exports.getCurrentStreamData = async (req,res) => {
    try {
        const user_jwt = req.headers.authorization
        const unx_id = req.headers.unx_id
        const userData  = req.body.data

        const verified = await Auth.verifyUserJWT(user_jwt, unx_id)

        if(!verified){
            res.status(401).json({ message: 'Not Authorized'})
            return
           }

           const { client_id, accessToken } = await Twitch.getUserConfigData(unx_id)

           const streamData = await Twitch.getCurrentStreamData(client_id, accessToken, userData) 


           res.status(200).json(streamData) 


    } catch (error) {
        console.log("🚀 ~ file: twitchController.js:134 ~ exports.getCurrentStreamData= ~ error", error)
        
    }
}