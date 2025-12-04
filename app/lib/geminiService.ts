// app/lib/geminiService.ts

import type { StoryPage, Theme, LearnedWord, KidProfile } from "./types";

export interface IdentifyResult {
  word: string;
  definition: string;
  visualDetail: string;
  matchesTheme?: boolean;
  feedback?: string;
}

export interface LookupDefinitionResult {
  definition: string;
  funFact: string;
  emoji: string;
  visualDetail: string;
}

export interface StoryContentResult {
  pages: StoryPage[];
  narratorNote?: string;
}

// 內部使用的基礎函數: 識別物件
export const identifyObject = async (
  imageBase64: string,
  theme?: Theme
): Promise<IdentifyResult> => {
  return {
    word: "mystery object",
    definition: "A placeholder object used when AI is disabled.",
    visualDetail: "Looks fun and colorful.",
    matchesTheme: true
  };
};

// 內部使用的基礎函數: 單詞解釋
export const lookupWordDefinition = async (
  word: string,
  context?: string
): Promise<LookupDefinitionResult> => {
  return {
    definition: `A placeholder definition for "${word}".`,
    funFact: `This is a demo fun fact about "${word}".`,
    emoji: "✨",
    visualDetail: "Simple and kid friendly."
  };
};

// 內部使用的基礎函數: 生成故事內容
export const generateStoryContent = async (options: {
  theme?: Theme;
  words?: LearnedWord[];
  kid?: KidProfile;
}): Promise<StoryContentResult> => {
  const wordList = (options.words || []).map((w) => w.word).join(", ");
  const firstWord =
    (options.words && options.words[0]?.word) || "friend";

  const page: StoryPage = {
    id: "demopage1",
    text: `This is a demo story page using words like ${wordList || firstWord}. Replace this with real Gemini output later.`,
    imagePrompt: `Cute illustration with ${wordList || firstWord}.`
  };

  return {
    pages: [page],
    narratorNote: "Demo story generated locally without calling Gemini."
  };
};

// 內部使用的基礎函數: 插畫
export const generateIllustration = async (
  prompt: string,
  stylePrompt?: string,
  characterVisual?: string
): Promise<string | null> => {
  return null;
};

// 內部使用的基礎函數: 語音
export const generateSpeech = async (
  text: string
): Promise<string | null> => {
  return null;
};

/*
  以下是為了配合路由中原本的 import 名稱
  讓編譯可以不改路由直接通過
*/

// 路由期望的名稱: identifyObjectFromImage
export async function identifyObjectFromImage(
  imageBase64: string,
  theme?: Theme
): Promise<IdentifyResult> {
  return identifyObject(imageBase64, theme);
}

// 路由期望的名稱: lookupWordMeaning
export async function lookupWordMeaning(
  word: string,
  context?: string
): Promise<LookupDefinitionResult> {
  return lookupWordDefinition(word, context);
}

// 路由期望的名稱: generateStory
export async function generateStory(options: {
  theme?: Theme;
  words?: LearnedWord[];
  kid?: KidProfile;
}): Promise<StoryContentResult> {
  return generateStoryContent(options);
}

// 路由期望的名稱: synthesizeSpeech
export async function synthesizeSpeech(
  text: string
): Promise<string | null> {
  return generateSpeech(text);
}

