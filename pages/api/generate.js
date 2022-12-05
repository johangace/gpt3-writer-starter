import { Configuration, OpenAIApi } from "openai";

export const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

const basePromptPrefix = "generate a prompt for dalle-2 painting with this description:";

const generateAction = async (req, res) => {
  // Run first prompt
  console.log(`API: ${basePromptPrefix}${req.body.userInput}`);



  const baseCompletion = await openai.createCompletion({
    model: "text-davinci-003",
    prompt: `${basePromptPrefix}${req.body.userInput}`,
    temperature: 0.99,
    max_tokens: 250,
  });

  const basePromptOutput = baseCompletion.data.choices.pop();
console.log(basePromptOutput.text)


  const pic = await openai.createImage({
    prompt: basePromptOutput.text,
    n: 1,
    size: "256x256",
  });
  const image = pic.data.data[0].url;

  res.status(200).json({ output: {image: image, text: basePromptOutput } });

};



export default generateAction;
