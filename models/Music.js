require('dotenv').config()
const db = require('../config/db');
const axios = require('axios')
const DEBUG = process.env.DEBUG_MODE;


class Music {
    constructor(){

    }

    static async getAllSongs(){
        try {
            const sql = `SELECT * FROM music_data`;
            return db.execute(sql);
        } catch (error) {
            console.log(error);
        }
    }
}

module.exports = Music;