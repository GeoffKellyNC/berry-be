require('dotenv').config()
const  { returnBerryClient } = require('../twitch/berry')
const axios  = require('axios')
const { Configuration, OpenAIApi } = require("openai");


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

const runGPTModel = async (question) => {
    const configuration = new Configuration({
        apiKey: process.env.OPENAI_API_KEY,
      });
      const openai = new OpenAIApi(configuration);
      
      const response = await openai.createCompletion({
        model: "text-davinci-003",
        prompt: question,
        temperature: 0.5,
        max_tokens: 60,
        top_p: 0.3,
        frequency_penalty: 0.5,
        presence_penalty: 0.0,
      });

      return response.data.choices[0].text

      
}


const processMessage = async (chatClient, channel, user, message) => {
    if(message === "!ping"){
        chatClient.say(channel, `@${user} Pong!`)
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
        const answer = await runGPTModel(question)
        chatClient.say(channel, `@${user} ${answer}`)
        return
    }
}

module.exports = BerryBot