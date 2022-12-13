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

    DEBUG && (console.log('authController login() id, login, display_name, email, profile_image_url ', id, login, display_name, email, profile_image_url))

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
    const dataObj = {
        client_id: process.env.TWITCH_CLIENT_ID,
        client_secret: process.env.TWITCH_CLIENT_SECRET,
        refresh_token,
        unx_id : userUxId,
        expires_in,
        access_token,
      };
    
    // LEFT OFF HERE!!! NEED TO REWORK LOGIN. ITS TOO LONG!!!





            // Debugging Console logs 
    DEBUG && (console.log('authController login() userExists ', userExists))


}