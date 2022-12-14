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

          return db.execute('INSERT INTO app_users (unx_id, user_name, user_email, user_pass, twitch_user, twitch_id, profile_img) VALUES (?,?,?,?,?,?,?)', 
          [
            this.unx_id,
            this.name,
            this.email,
            this.password,
            this.twitchName,
            this.twitchId,
            this.avatarURL,
          ]);

        } catch (error) {
          console.log("User.saveUserToDb error: ", error);
          
        }
    }

    static async getUserUxId (userName){
        const sql = `SELECT unx_id FROM app_users WHERE twitch_user = ?`;
        const value = [userName];
        const idSQL = await db.execute(sql, value);

        return idSQL[0][0].unx_id;
    }
}


module.exports = User;


