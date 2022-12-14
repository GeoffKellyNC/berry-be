require('dotenv').config()
const Auth = require('../models/Auth')
const Twitch = require('../models/Twitch')
const User = require('../models/User')

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

        console.log('authController userUxId: ', userUxId); //!REMOVE

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

        console.log('authController jwtToken: ', jwtToken) //!REMOVE

        await Twitch.setBotTarget(login, userUxId)

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
            access_token
        })

        // Debugging Console logs 
        DEBUG && (console.log('authController login userExists ', userExists))

        return

    } catch (error) {
        res.status(500).json({message: 'Server Login Error', error})
        console.log('authController.login() Error: ', error)
    }


    






}