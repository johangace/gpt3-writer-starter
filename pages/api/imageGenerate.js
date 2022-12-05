
import { Configuration, OpenAIApi } from "openai";

export const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

const basePromptPrefix = "";


export const generateImage = async (req, res) => {
  const pic = await openai.createImage({
    prompt: req.body.apiOutput,
    n: 1,
    size: "256x256",
  });
  const image = pic.data.data[0].url;

  res.status(200).json({ output: {image: image, text: image } });
};

export default generateImage;
