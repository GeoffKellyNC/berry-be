require('dotenv').config()
const { Configuration, OpenAIApi } = require("openai");

const contextArray = []

const runAskBerryModel = async (question) => {

  try{

    console.log('Context Array: ', contextArray) //!REMOVE
    await contextArray.push(question)


    const context = contextArray.join('/n')

    console.log("Berry Has been Asked: ", question) //!REMOVE
    const configuration = new Configuration({
        apiKey: process.env.OPENAI_API_KEY,
      });
      const openai = new OpenAIApi(configuration);
      
      const response = await openai.createCompletion({
        model: "text-davinci-003",
        prompt: `${context}`,
        temperature: 0.5,
        max_tokens: 150,
        frequency_penalty: 0.5,
        presence_penalty: 0.0, 
      });

      console.log('Berry Responded!') //!REMOVE

      contextArray.push(response.data.choices[0].text)

      return response.data.choices[0].text

    }catch(error){
      console.log("🚀 ~ file: askBerryModel.js:25 ~ runAskBerryModel ~ error", error)
      
    }

}


module.exports = runAskBerryModel