require('dotenv').config()
const db = require('../config/db');
const axios = require('axios')
const DEBUG = process.env.DEBUG_MODE;


class Twitch {
    constructor(){

    }

    static async getAccessToken(code) {
        try{
            const CLIENT_SECRET = process.env.TWITCH_CLIENT_SECRET;
            const CLIENT_ID = process.env.TWITCH_CLIENT_ID;
            const REDIRECT_URI = process.env.TWITCH_REDIRECT_URI;
            const REDIRECT_URI_LOCAL = process.env.TWITCH_REDIRECT_URI_LOCAL;
            const data = await axios.post(`https://id.twitch.tv/oauth2/token?client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}&code=${code}&grant_type=authorization_code&redirect_uri=${ REDIRECT_URI_LOCAL }`);
            const { access_token, expires_in, refresh_token, scope,  } = data.data;

            //DEBUGGING CONSOLE logs
            // DEBUG && (
            //     console.log('Twitch Model getAccessToken Data: ', data.data)
            // )
            
            return {access_token, expires_in, refresh_token, scope}
        }catch(err){
            console.log(err);
        }
    }

    static async getUserData (token) {
        try {
            const headers = {
              Authorization: `Bearer ${token}`,
              "Client-ID": process.env.TWITCH_CLIENT_ID,
            };
        
            const res = await axios.get("https://api.twitch.tv/helix/users", {
              headers,
            });
        
            const { id, login, display_name, email, profile_image_url } =
              res.data.data[0];
                
            return {
              id,
              login,
              display_name,
              email,
              profile_image_url,
            };
          } catch (error) {
            console.log('Twitch Model getUserData Error: ', error)
          }
    }

    static async updateConfig(data, unx_id) {
        const sql = `UPDATE config_twitch SET client_id = ?, client_secret = ?, refreshToken =?, accessToken = ?, obtainment_timestamp = ? WHERE unx_id = '${unx_id}'`;
        await db.execute(sql, [
          data.client_id,
          data.client_secret,
          data.refreshToken,
          data.accessToken,
          data.obtainment_timestamp,
        ]);
        const configSql = `SELECT * FROM config_twitch WHERE unx_id = '${this.unx_id}'`;
        const newConfig = await db.execute(configSql);
        return newConfig[0][0];
      }

      static async getBotConfig() {
        const sql = `SELECT * FROM config_twitch WHERE unx_id = 'bot'`;
        const data = await db.execute(sql);
        return data[0][0];
      }

}

module.exports = Twitch;