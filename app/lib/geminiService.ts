import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

if (!process.env.GEMINI_API_KEY) {
  console.warn("⚠️ GEMINI_API_KEY is missing in environment variables");
}

/**
 * Identify object from an image
 */
export async function identifyObjectFromImage(base64Image: string) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-exp-1206" });

    const response = await model.generateContent([
      {
        inlineData: {
          data: base64Image,
          mimeType: "image/jpeg",
        },
      },
      { text: "Identify the object in this image with a short label." },
    ]);

    return response.response.text();
  } catch (error) {
    console.error("❌ identifyObjectFromImage error:", error);
    throw error;
  }
}

/**
 * Lookup word meaning
 */
export async function lookupWordMeaning(word: string) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-exp-1206" });

    const response = await model.generateContent(
      `Explain the meaning of the word "${word}" in one short child-friendly sentence.`
    );

    return response.response.text();
  } catch (error) {
    console.error("❌ lookupWordMeaning error:", error);
    throw error;
  }
}

/**
 * Generate illustration based on a prompt
 */
export async function generateIllustration(prompt: string) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-exp-1206" });

    const response = await model.generateContent(
      `Create a cute children’s-book-style illustration of: ${prompt}`
    );

    return response.response.text();
  } catch (error) {
    console.error("❌ generateIllustration error:", error);
    throw error;
  }
}

/**
 * Generate full storytelling
 */
export async function generateStory(theme: string, words: string[]) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-exp-1206" });

    const prompt = `
      Write a short story for young children inspired by the theme: ${theme}.
      Include the following vocabulary words naturally in the story:
      ${words.join(", ")}.
      Keep the story simple, friendly, and imaginative.
    `;

    const response = await model.generateContent(prompt);
    return response.response.text();
  } catch (error) {
    console.error("❌ generateStory error:", error);
    throw error;
  }
}

/**
 * Speech synthesis
 */
export async function synthesizeSpeech(text: string) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-exp-1206" });

    const response = await model.generateContent({
      contents: [
        {
          role: "user",
          parts: [{ text }],
        },
      ],
      generationConfig: {
        responseMimeType: "audio/mpeg",
      },
    });

    return response.response;
  } catch (error) {
    console.error("❌ synthesizeSpeech error:", error);
    throw error;
  }
}
