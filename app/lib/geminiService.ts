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

// 识别照片里的东西（现在先用占位结果）
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

// 查单词解释（占位）
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

// 生成故事内容（占位 只返回一页 demo）
export const generateStoryContent = async (options: {
  theme?: Theme;
  words?: LearnedWord[];
  kid?: KidProfile;
}): Promise<StoryContentResult> => {
  const wordList = (options.words || []).map((w) => w.word).join(", ");
  const firstWord =
    (options.words && options.words[0]?.word) || "friend";

  const page: StoryPage = {
    id: "demo-page-1",
    text: `This is a demo story page using words like ${wordList || firstWord}. Replace this with real Gemini output later.`,
    imagePrompt: `Cute illustration with ${wordList || firstWord}.`
  };

  return {
    pages: [page],
    narratorNote: "Demo story generated locally without calling Gemini."
  };
};

// 生成插画（现在先不返回真正图片）
export const generateIllustration = async (
  prompt: string,
  stylePrompt?: string,
  characterVisual?: string
): Promise<string | null> => {
  return null;
};

// 文本转语音（占位 返回 null）
export const generateSpeech = async (
  text: string
): Promise<string | null> => {
  return null;
};

