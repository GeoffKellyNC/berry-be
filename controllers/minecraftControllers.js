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

        console.log('Message: ', kHeadersMessage) //!REMOVE
        console.log('user_id: ', kHeaders['user-id']) //!REMOVE

        const user = kHeaders['user-id']


        console.log('Asking Question....')
        const answer = await runAskBerryModel(kHeadersMessage)


        const newAnswer = answer.includes('Marv: ') ? answer.replace('Marv: ', '') : answer

        // console.log('Answer: ', newAnswer)
        // res.status(200).json(newAnswer)
        
        
        const removedNewLines = newAnswer.replace('/n', '')
        console.log('NEW ANSWER', removedNewLines)
        res.status(200).json(removedNewLines)
        
        // res.status(200) //!REMOVE

        console.log('SENT!')
        


    } catch (error) {
        res.status(500).json(error)
        console.log("🚀 ~ file: minecraftControllers.js:20 ~ exports.testPost= ~ error", error)
        
    }
}