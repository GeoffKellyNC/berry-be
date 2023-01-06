require('dotenv').config()
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../config/db')
const axios = require('axios')


class Auth {
    constructor(){

    }

    static async createJWT (unx_id) {
        const token = jwt.sign({unx_id}, process.env.JWT_SECRET, {expiresIn: '24h'});
        await db.execute(`UPDATE app_users SET session_token = '${token}' WHERE unx_id = '${unx_id}'`)


        return token
    }

    static async verifyUserJWT (userJWT, unx_id) {
        try {
            const sql = `SELECT session_token FROM app_users WHERE unx_id = '${unx_id}'`;

            const res =  await db.execute(sql);
            // console.log("🚀 ~ file: Auth.js:28 ~ Auth ~ verifyUserJWT ~ sessionToken", res[0][0]) //!REMOVE
            
            const sessionToken = res[0][0].session_token


            const tokenMatch = (userJWT === sessionToken)

            const jwtValid = await jwt.verify(userJWT, process.env.JWT_SECRET, (err, decoded) => {
                if (err) {
                    return false;
                } else {
                    return true;
                }
            });

            if (!tokenMatch || !jwtValid) {
                return false;
            }

            return true



        } catch (error) {
            console.log('Auth Model verifyUserJWT Error: ', error)
        }
    }

}


module.exports = Auth;
