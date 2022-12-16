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

    static async getUserConfigData (unx_id) {
      try {
        const sql = `SELECT * FROM config_twitch WHERE unx_id = '${unx_id}'`;
        const data = await db.execute(sql);
        return data[0][0];

      } catch (error) {
        console.log('Twitch Model getUserConfigData Error: ', error)
      }
    }

    static async updateConfig(data, unx_id) {
        try {
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

        } catch (error) {
          console.log('Twitch Model updateConfig() error: ', error)
        }
      }

      static async getBotConfig() {
        const sql = `SELECT * FROM config_twitch WHERE unx_id = 'bot'`;
        const data = await db.execute(sql);
        return data[0][0];
      }

      static async setConfig(data){
        try {
          const config = await db.execute('SELECT * FROM config_twitch WHERE unx_id = ?', [data.unx_id])
          if (config[0].length === 0) {
            await db.execute('INSERT INTO config_twitch (unx_id, accessToken, client_id, expires_in, refreshToken, client_secret) VALUES (?,?,?,?,?,?)', [
              data.unx_id,
              data.access_token,
              data.client_id,
              data.expires_in,
              data.refresh_token,
              data.client_secret
            ])
            return true
          }


          return db.execute(`UPDATE config_twitch SET client_id = '${data.client_id}', client_secret = '${data.client_secret}', accessToken = '${data.access_token}', refreshToken = '${data.refresh_token}' WHERE unx_id = '${data.unx_id}'`)

        } catch (error) {
          console.log('Twitch Model setConfig() error: ', error)
        }
      }


      static async setBotTarget (target, unx_id) {
        try {

          const sql = `INSERT INTO channel_targets (unx_id, target_channel) VALUES ('${this.unx_id}', '${this.target}')`;

          await db.execute(sql);

        } catch (error) {
          console.log('Twitch Model setConfig() error: ' + target, error)
        }
      }

      static async verifyTwitchAccessToken (access_token, userName, twitchId){
        try {
          const headers = {
            'Authorization': `OAuth ${access_token}`,
          }
          const verifiedData = await axios.get('https://id.twitch.tv/oauth2/validate', { headers })


          if (verifiedData.data.user_id === twitchId && userName === verifiedData.data.login){
              return {
                  verified: true,
                  data: verifiedData.data
              }
          }

          return false
          
        } catch (error) {
          console.log('Twitch Model verifyTwitchAccessToken Error: ', error)
        }
      }

      static async runTwitchAd ( access_token, twitch_id, duration, client_id ) {
        try {
            const headers = {
              Authorization: `Bearer ${access_token}`,
              "Client-ID": client_id,
              "Content-Type": "application/json",
            };
            const body = {
              broadcaster_id: twitch_id,
              length: duration,
            };

            const res = await axios.post(
              "https://api.twitch.tv/helix/channels/commercial",
              body,
              { headers }
            );

            if(res.status === 400){
              console.log('Its 400!')
              console.log('Twitch Model runTwitchAd res.status === 400: ', res.data)
            }

            return res.data;

        } catch (error) {
          console.log('Twitch Model runTwitchAd Error: ', error.response.data)
          return error.response.data
        }
  }

  static async getTwitchChatSettings(twitch_id, access_token, client_id) {
    try {
      const modId = 794561481;
      const broadcaster_id = twitch_id;

      const headers = {
        Authorization: `Bearer ${access_token}`,
        "Client-ID": client_id,
      };
      const res = await axios.get(
        `https://api.twitch.tv/helix/chat/settings?broadcaster_id=${broadcaster_id}&moderator_id=${modId}`,
        { headers }
      );

      return res.data;

    } catch (error) {
      console.log(error);
    }
  }
}

module.exports = Twitch;