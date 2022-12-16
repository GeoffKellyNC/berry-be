require('dotenv').config()
const  { returnBerryClient } = require('../twitch/berry')
const axios  = require('axios')

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
    switch(message){
        case "!ping":
            chatClient.say(channel, `@${user} Pong!`)
            break;
        case "!berry":
            chatClient.say(channel, ` Hello! @${user})`)
            break;
        case "!yomamma":
            const jokeRes = await axios.get('https://api.yomomma.info/')
            const joke = jokeRes.data.joke
            chatClient.say(channel, `@${user} ${joke}`)
            break;
        default:
            return
    }
}

module.exports = BerryBot