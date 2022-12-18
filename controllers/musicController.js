require('dotenv').config()
const Twitch = require('../models/Twitch')
const Auth = require('../models/Auth')
const Music = require('../models/Music')

exports.getAllMusic = async (req, res) => {
    try {
        const { unx_id } = req.body.data;
        const userJwtToken = req.headers.authorization

        const verified = await Auth.verifyUserJWT(userJwtToken, unx_id)

        if(!verified){
            res.status(401).json({ message: 'Not Authorized'})
            return
        }

        const result = await Music.getAllSongs()

        console.log('Get Songs Res: ', result[0]) //!REMOVE

        res.status(200).json({ data: result[0] })

    } catch (error) {
        res.status(500).json({ message: error })
        console.log('music Controller getAllSongs Error: ', error) //!REMOVE
    }

}