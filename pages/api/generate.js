import next from "next";
import { Configuration, OpenAIApi } from "openai";

export const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

const basePromptPrefix =
  "generate 3 prompts in an json array without the variable so it can  generate beautiful paintings using differnt techniquest with Dal-e 2. Usethe following prompt: ";

const generateAction = async (req, res) => {
  console.log(`API: ${req.body.userInput}`);
  let defaultprompts = ["albanian art", "mexican art", "american art"];

  const baseCompletion = await openai.createCompletion({
    model: "text-davinci-003",
    prompt: `${basePromptPrefix}${req.body.userInput}`,
    temperature: 0.99,
    max_tokens: 250,
  });

  const basePromptOutput = baseCompletion.data.choices.pop();
  let generatedPrompts = basePromptOutput.text || "";
  let promptsArr = await JSON.parse(generatedPrompts);

  console.log("prompts", generatedPrompts);

  let generatedImages = [];
  if (promptsArr) {
    for (let i = 0; i < promptsArr.length; i++) {
      const pic = await openai.createImage({
        prompt: promptsArr[i] || defaultprompts,
        n: 2,
        size: "1024x1024",
      });
      generatedImages.push({image: pic.data.data[0].url, text: promptsArr[i] });
      console.log("images", pic.data.data[0].url, promptsArr[i]);

    }
  }

      if (generatedImages && basePromptOutput)
      res.status(200)
      .json({ output: { generatedImages } });
            else {
        res.status(500).json({ error: "Ha Ocurrido un error" });
      }
return

};

export default generateAction;
