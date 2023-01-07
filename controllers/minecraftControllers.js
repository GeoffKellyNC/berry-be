require('dotenv').config()
const Minecraft = require('../models/Minecraft')
const runAskBerryModel = require('../AI/askBerryModel')


exports.test = async (req, res) => {
    try {
        res.status(200).json({ message: 'YOU TESTED POSITIVE FOR AIDS. SO SO SORRY!!'})
    } catch (error) {
        res.status(500).json(error)
        console.log("🚀 ~ file: minecraftControllers.js:9 ~ exports.test= ~ error", error)
        
    }
}


exports.testPost = async (req, res) => {
    try {

        const symbols = Object.getOwnPropertySymbols(req);
        const kHeadersSymbol = symbols.find((symbol) => symbol.toString() === 'Symbol(kHeaders)');
        const kHeaders = req[kHeadersSymbol];
        const kHeadersMessage = req[kHeadersSymbol]['message'];

        console.log(kHeadersMessage)

        console.log('Asking Question....')
        const answer = await runAskBerryModel(kHeadersMessage)

        console.log('ANSWERED!', answer)

        res.status(200).json({ message: answer})

        console.log('SENT!')


    } catch (error) {
        res.status(500).json(error)
        console.log("🚀 ~ file: minecraftControllers.js:20 ~ exports.testPost= ~ error", error)
        
    }
}