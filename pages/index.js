import Head from "next/head";
import Image from "next/image";
import buildspaceLogo from "../assets/buildspace-logo.png";
import { useState } from "react";

import { Configuration, OpenAIApi } from "openai";

const Home = () => {
  const configuration = new Configuration({
    apiKey: "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",
  });

  const openai = new OpenAIApi(configuration);

  const [userInput, setUserInput] = useState("");
  const [apiOutput, setApiOutput] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [imageResult, setImageResult] = useState("");

  const promptGenerate = async () => {
    setIsGenerating(true);
    console.log("Calling OpenAI...");
    const response = await fetch("/api/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userInput }),
    });

    const data = await response.json();
    const { output } = data;
    console.log("OpenAI data...", data);

    setApiOutput(`${output.text.text}`);

    setImageResult(`${output.image}`);

    setIsGenerating(false);
  };

  const imageGenerate = async () => {
    setIsGenerating(true);

    // const splits = apiOutput.split(/\s(?=\d+\.)/);
    // const list = splits.map((el) => el.slice(3));

    console.log("Calling OpenAI...");
    const response = await fetch("/api/imageGenerate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ apiOutput }),
    });

    const data = await response.json();
    const { output } = data;
    console.log("OpenAI replied...", output);

    setImageResult(`${output}`);
    setIsGenerating(false);
  };

  const onUserChangedText = (event) => {
    setUserInput(event.target.value);
  };

  return (
    <div className="root">
      <Head>
        <title>GPT-3 Writer | by Mystic River</title>
      </Head>
      <div className="container">
        <div className="header color-gradient ">
          <div className="header-title ">
            <h1>Art All Day</h1>
          </div>
          <div className="header-subtitle">
            <h2>Daily AI Art generator</h2>
          </div>
        </div>
      </div>
      <div className="prompt-container">
        <textarea
          placeholder="start typing here"
          className="prompt-box"
          value={userInput}
          onChange={onUserChangedText}
        />

        <div className="prompt-buttons">
          <a
            className={
              isGenerating
                ? "generate-button loading"
                : "generate-button background"
            }
            onClick={promptGenerate}
          >
            <div className="generate ">
              {isGenerating ? (
                <span className="loader"> </span>
              ) : (
                <p>Generate</p>
              )}
            </div>
          </a>
        </div>
      </div>


   
      {imageResult.length > 0 ? (
        <img className="result-image" src={imageResult} alt="result" />
      ) : (
        <></>
      )}
         {apiOutput && (
        <div>
          <div className="output">
            <div className="output-header-container">
              <div className="output-header">
                <h3>Result</h3>
              </div>
            </div>
            <div className="output-content">
              <p>{apiOutput}</p>
            </div>
          </div>{" "}
        </div>
      )}


      <div className="badge-container grow">
        <a href="" target="_blank" rel="noreferrer">
          <div className="badge">
            <Image src={buildspaceLogo} alt="buildspace logo" />
            <p> by Mystic River Technologies</p>
          </div>
        </a>
      </div>
    </div>
  );
};

export default Home;
