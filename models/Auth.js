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

        console.log('Auth Model Token Set......') //!REMOVE

        return token
    }

}


module.exports = Auth;
