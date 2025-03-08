import React, { createContext, useState, useEffect } from "react";
import { CreateWebWorkerMLCEngine } from "@mlc-ai/web-llm";

const API_URL = process.env.REACT_APP_API_URL;

// Create a context
export const AIContext = createContext();

// Create a provider component
export const AIProvider = ({ children }) => {
  const [engine, setEngine] = useState(null);
  const modelToUse = "Qwen2.5-1.5B-Instruct-q4f16_1-MLC";

  useEffect(() => {
    const initModel = async () => {
      try {
        const createdEngine = await CreateWebWorkerMLCEngine(
          new Worker(new URL(".././workers/worker.js", import.meta.url), {
            type: "module",
          }),
          modelToUse
        );
        setEngine(createdEngine);
      } catch (error) {
        console.error("Error while loading model:", error);
      }
    };

    initModel();
  }, []);

  const getReply = async (
    userQuery,
    systemPrompt,
    setModelReply,
    setStreaming
  ) => {
    if (userQuery === "") {
      return;
    }

    try {
      await engine.resetChat();
      const messages = [
        {
          role: "system",
          content: systemPrompt,
        },
        { role: "user", content: userQuery },
      ];

      // console.log(JSON.stringify(extractEventDetails(response.data.results), null, 2) + " The bees knees");
      // const maxBufferSize = await engine.getMaxStorageBufferBindingSize();
      // console.log(maxBufferSize);
      const chunks = await engine.chat.completions.create({
        messages,
        temperature: 0.5,
        stream: true,
      });

      let reply = "";
      for await (const chunk of chunks) {
        reply += chunk.choices[0]?.delta.content || "";
        setModelReply(reply);
        setStreaming(true);
      }
      setStreaming(false);
      const fullReply = await engine.getMessage();
      setModelReply(fullReply);
    } catch (error) {
      console.error("Error during chat completion:", error);
    }

  };

  return (
    <AIContext.Provider value={{getReply, engine}}>
      {children}
    </AIContext.Provider>
  );
};
