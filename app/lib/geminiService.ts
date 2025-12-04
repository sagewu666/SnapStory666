import {
  GoogleGenerativeAI,
  SchemaType
} from "@google/genai";

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  throw new Error("❌ Missing GEMINI_API_KEY in environment variables");
}

const client = new GoogleGenerativeAI(apiKey);

//
// Identify Object
//
export async function identifyObjectFromImage(base64Image: string) {
  const model = client.getGenerativeModel({
    model: "gemini-1.5-flash"
  });

  const result = await model.generateContent([
    {
      inlineData: {
        data: base64Image,
        mimeType: "image/jpeg"
      }
    },
    {
      text: "What object is shown in this image? Describe it shortly."
    }
  ]);

  return result.response.text();
}

//
// Story Generator
//
export async function generateStory(words: string[]) {
  const storyPrompt = `
    Create a short children's story using these words:
    ${words.join(", ")}.
    Make it fun, simple, and suitable for English beginners.
  `;

  const model = client.getGenerativeModel({ model: "gemini-1.5-pro" });
  const result = await model.generateContent(storyPrompt);

  return result.response.text();
}

//
// Illustration Generator
//
export async function generateIllustration(prompt: string) {
  const model = client.getGenerativeModel({ model: "gemini-1.5-flash" });

  const result = await model.generateContent({
    contents: [
      {
        role: "user",
        parts: [{ text: `Generate a cute children’s book style illustration of: ${prompt}` }]
      }
    ]
  });

  return result.response.text();
}

//
// Dictionary Lookup
//
export async function lookupWordMeaning(word: string) {
  const prompt = `Explain the meaning of the word "${word}" in simple English suitable for kids.`;

  const model = client.getGenerativeModel({ model: "gemini-1.5-pro" });
  const result = await model.generateContent(prompt);

  return result.response.text();
}

//
// Speech Synthesis (text → base64 audio)
//
export async function synthesizeSpeech(text: string) {
  const model = client.getGenerativeModel({
    model: "gemini-1.5-flash"
  });

  const prompt = `Read this text aloud: "${text}"`;

  const result = await model.generateContent(prompt);

  return result.response.text();
}

