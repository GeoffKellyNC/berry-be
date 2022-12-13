const db = require('../config/db');
const { v4: uuid } = require('uuid');

class User {
    constructor(name, email, password, twitchName, twitchId, avatarURL ) {
        this.unx_id = uuid();
        this.name = name;
        this.email = email;
        this.password = password;
        this.twitchName = twitchName;
        this.twitchId = twitchId;
        this.avatarURL = avatarURL;
    }

/**
 * @description - save a user when they sign up
 * @returns execute query to save a user to database
 */
    async addUserToDb() {
        try {

        const addUserSQL = `INSERT INTO app_users (unx_id, user_name, user_email, user_pass, twitch_user, twitch_id, profile_img) VALUES (?)`
        const values = [this.unx_id, this.name, this.email, this.password, this.twitchName, this.twitchId, this.avatarURL]

          
        return db.query(addUserSQL, [values]);
  
        } catch (error) {
          console.log('authController.addUserToDb error: ', error);
        }
          
      }

      async checkUserExists (email) {
        const sql = `SELECT * FROM app_users WHERE user_email = ?`;
        const value = [email];
        const result = await db.execute(sql, value);
        if (result[0].length > 0) {
            return true;
        }
        return false;
    }

    async saveUserToDb() {
        try {
          const sql = `INSERT INTO app_users (unx_id, user_name, user_email, user_pass, twitch_user, twitch_id, profile_img) VALUES (?)`;
          const values = [
            this.unx_id,
            this.name,
            this.email,
            this.password,
            this.twitchName,
            this.twitchId,
            this.avatarURL,
          ];
          const idData = db.execute(sql, [values]);
          return [0][0].unx_id
        } catch (error) {
          console.log("User.saveUserToDb error: ", error);
          
        }
    }

    static getUserUxId (userName){

    }
}


module.exports = User;


