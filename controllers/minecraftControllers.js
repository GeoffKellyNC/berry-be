require('dotenv').config()
const Minecraft = require('../models/Minecraft')


exports.test = async (req, res) => {
    try {
        res.status(200).json({ message: 'It Works!'})
    } catch (error) {
        console.log("🚀 ~ file: minecraftControllers.js:9 ~ exports.test= ~ error", error)
        
    }
}