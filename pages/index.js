import Head from "next/head";
import Image from "next/image";
import buildspaceLogo from "../assets/buildspace-logo.png";
import defaultImg from "../assets/default.png";

import { useState, useEffect, useRef } from "react";
import { useFullscreen, useToggle } from "react-use";
import { ImEnlarge2, ImShrink2 } from "react-icons/im";

const Slideshow = ({ images, autoplay, interval }) => {
  // Add a ref to store the reference to the slideshow-container element
  const [currentIndex, setCurrentIndex] = useState(0);

  const ref = useRef(null);
  const [show, toggle] = useToggle(false);
  const isFullscreen = useFullscreen(ref, show, {
    onClose: () => toggle(false),
  });

  useEffect(() => {
    if (!autoplay) {
      return;
    }

    const timeout = setTimeout(() => {
     images&& setCurrentIndex((currentIndex + 1) % images.length);
    }, interval);

    return () => clearTimeout(timeout);
  }, [currentIndex, autoplay, interval,images]);

  // Listen for a click on the button
  const previousSlide = () => {
    setCurrentIndex((currentIndex + images.length - 1) % images.length);
  };

  const nextSlide = () => {
    setCurrentIndex((currentIndex + 1) % images.length);
  };

  // Listen for a click on the button
  if (images === undefined || images.length === 0 || !images) {
    // initialize the images array with at least one element

    images = null;
  }

  return (
    <div className="slideshow-container" ref={ref}>
      <div className="slideshow-image ">
        {!images && <Image src={defaultImg} />}

        {images && (
          <div>
            <img
              src={images[currentIndex].image}
              alt={images[currentIndex].alt}
              className="ken-burns-image"
            />
            <div className="slideshow-image-overlay ">
              <p>{images[currentIndex].text}</p>
            </div>
         
          </div>
          
        )}
          {images && (
            <div> 
      <button onClick={previousSlide}>Prev</button>
      <button onClick={nextSlide}>Next</button>

      </div>)}
      </div>

     

      {isFullscreen ? (
        <ImShrink2 className="fullscreen-button" onClick={() => toggle()} />
      ) : (
        <ImEnlarge2 className="fullscreen-button" onClick={() => toggle()} />
      )}
    </div>
  );
};

const Home = () => {
  const [userInput, setUserInput] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [apiOutput, setApiOutput] = useState([]);
  const [imageResult, setImageResult] = useState([]);

  const promptGenerate = async () => {
    setIsGenerating(true);
    console.log("Calling OpenAI...");

    const response = await fetch("/api/generate", {
      method: "POST",
      body: JSON.stringify({ userInput }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();
    const { output } = data;
    console.log("OpenAI data...", output);

    setApiOutput(`${output.text}`);

    setImageResult(output.generatedImages);

    setIsGenerating(false);
  };

  console.log(imageResult, "res");

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

      {imageResult ? (
        <Slideshow images={imageResult} autoplay interval={5000} />
      ) : (
        <></>
      )}

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

      <div className="badge-container grow">
        <a href="" target="_blank" rel="noreferrer">
          <div className="badge">
            <Image src={buildspaceLogo} alt="mystic River logo" />
            <p> by Mystic River Technologies</p>
          </div>
        </a>
      </div>
    </div>
  );
};

export default Home;
