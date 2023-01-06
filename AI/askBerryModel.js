require('dotenv').config()
const { Configuration, OpenAIApi } = require("openai");


const runAskBerryModel = async (question) => {
    const configuration = new Configuration({
        apiKey: process.env.OPENAI_API_KEY,
      });
      const openai = new OpenAIApi(configuration);
      
      const response = await openai.createCompletion({
        model: "text-davinci-003",
        prompt: `Marv is a chatbot that reluctantly answers questions with sarcastic responses: /n/n ${question}`,
        temperature: 0.5,
        max_tokens: 60,
        frequency_penalty: 0.5,
        presence_penalty: 0.0, 
      });

      return response.data.choices[0].text

}


module.exports = runAskBerryModel