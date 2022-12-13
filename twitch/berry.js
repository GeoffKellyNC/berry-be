require('dotenv').config()
const { RefreshingAuthProvider } = require('@twurple/auth')
const { ChatClient } = require('@twurple/chat');
const Twitch = require('../models/Twitch')



const refreshConfig = async (data) => {
    const oldData = await Twitch.getBotConfig()
    const newData = {
        ...oldData,
        ...data
    }
    Twitch.updateConfig(newData,'bot')
}

let berryClient;


const createChatClient = (authProvider) => {
    const chatClient = new ChatClient({
        authProvider,
        channels: [],
        config: {
            isAlwaysMod: true,
            receiveMembershipEvents: true,
        }
    })
    berryClient = chatClient
    return chatClient
}

const returnBerryClient = () => {
    return berryClient ? berryClient : 'No client'
}


async function berry() {
    const configData = await Twitch.getBotConfig()
    const clientId = configData.client_id
    const clientSecret = configData.client_secret
    const authProvider = new RefreshingAuthProvider(
        {
            clientId,
            clientSecret,
            onRefresh: async (newTokenData) => {
                await refreshConfig(newTokenData)
            }
        },
        configData
    );
    
    const client = await createChatClient(authProvider)

    const date = new Date()
    await client.connect()
    console.log(`Berry PUB Dev connected at ${date.toLocaleString()}`)

}

module.exports = {
    berry,
    returnBerryClient
}