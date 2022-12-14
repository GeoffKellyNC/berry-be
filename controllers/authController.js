require('dotenv').config()
const Auth = require('../models/Auth')
const Twitch = require('../models/Twitch')
const User = require('../models/User')
const BerryBot = require('../models/BerryBot')
const {stringify, parse} = require('flatted');

const DEBUG = process.env.DEBUG_MODE;


/**
 * @returns 
 * @description: Controller when logging in
 */

exports.login = async (req, res) => {
    try {
        const { code } = req.body.data;

        const { 
                access_token, 
                expires_in, 
                refresh_token } = await Twitch.getAccessToken(code)

        const { 
                id, 
                login, 
                display_name,
                email, 
                profile_image_url } = await Twitch.getUserData(access_token)


        const user = new User(
                login,
                email,
                access_token,
                display_name, 
                id,
                profile_image_url
            );
        
        const userExists = await user.checkUserExists(email);

        if (!userExists) {
            await user.saveUserToDb();
        }

        const userUxId = await User.getUserUxId(login);


        const userAuthObj = {
            client_id: process.env.TWITCH_CLIENT_ID,
            client_secret: process.env.TWITCH_CLIENT_SECRET,
            refresh_token,
            unx_id : userUxId,
            expires_in,
            access_token,
        };

        await Twitch.setConfig(userAuthObj)
        const jwtToken = await Auth.createJWT(userUxId)


        await Twitch.setBotTarget(login, userUxId)

        const newBotClient = await BerryBot.connect(display_name)


        res.status(200).json({
            jwtToken,
            userData: {
                unx_id: userUxId,
                twitch_id: id,
                twitch_login: login,
                twitch_display: display_name,
                twitch_email: email,
                twitch_image: profile_image_url
            },
            access_token,
            newBotClient: stringify(newBotClient)
        })

        return

    } catch (error) {
        res.status(500).json({message: 'Server Login Error', error})
        console.log('authController.login() Error: ', error)
    }

}

exports.logout = async (req, res) => {
    try {
        const { target, chatClient } = req.body.data

        res.status(200).json({message: 'Logged Out'})
        
    } catch (error) {
        console.log('authController.logout() Error: ', error)
    }
}

exports.verifyUserAccess = async (req, res) => {
    try {
        const { 
            access_token, 
            userName, 
            unx_id, 
            token, 
            twitchId
        } = req.body.data

        const isTwitchAccessVerified = await Twitch.verifyTwitchAccessToken(access_token, userName, twitchId)

        const isJWTVerified = await Auth.verifyUserJWT(token, unx_id)

        if (!isTwitchAccessVerified || !isJWTVerified){
            res.status(401).json({message: 'Access Error'})
            return
        }

        res.status(200).json({isTwitchAccessVerified})

        



    } catch (error) {
        console.log('authController Verify User Access Error: ', error)
    }
}