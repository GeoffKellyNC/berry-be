require('dotenv').config()
const  { returnBerryClient } = require('../twitch/berry')
const axios  = require('axios')
const runAskBerryModel = require('../AI/askBerryModel')


class BerryBot {
    constructor(obj){
        this.target = obj.target;
        this.unx_id = obj.unx_id;
        this.configData = obj.configData;
    }

    static async connect(target){
        const date = new Date()
        const client = await returnBerryClient()
        await client.join(target)
        this.processMessages(client, target)
        console.log(`Berry Bot Connected to ${target} chat at ${date}`)
        return 
    }

   static async processMessages(client) {
        client.onMessage( async (channel, user, message) => {
            processMessage(client, channel, user, message )
        })
    }
    static async disconnect(client, target) {
        await client.part(target)
        const date = new Date()
        console.log(`Berry Bot Disconnected from ${target} chat at ${date}`)
    }

}


const processMessage = async (chatClient, channel, user, message) => {

    if(message === "!ping"){
        chatClient.say(channel, `Pong! @${user}`)
        return
    }

    if(message === "!berry"){
        chatClient.say(channel, ` Hello! @${user})`)
        return
    }

    if(message === "!yomamma"){
        const jokeRes = await axios.get('https://api.yomomma.info/')
        const joke = jokeRes.data.joke
        chatClient.say(channel, `@${user} ${joke}`)
        return
    }

    if(message.startsWith("!askberry")){
        const question = message.slice(10)
        const answer = await runAskBerryModel(question)
        chatClient.say(channel, `@${user} ${answer}`)
        return
    }

    if(message.toLowerCase().startsWith("@xberrybot")){
        const question = message.slice(10)
        const answer = await runAskBerryModel(question)
        chatClient.say(channel, `@${user} ${answer}`)
        return 
    }

}

module.exports = BerryBot