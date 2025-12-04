// app/lib/types.ts

export enum AppView {
  HOME = "HOME",
  THEME_SELECTION = "THEME_SELECTION",
  CAMERA_QUEST = "CAMERA_QUEST",
  VOCAB_REVIEW = "VOCAB_REVIEW",
  KID_PROFILE = "KID_PROFILE",
  STORY_MODE_SELECT = "STORY_MODE_SELECT",
  STORY_SETUP = "STORY_SETUP",
  STORY_READER = "STORY_READER",
  STORY_QUIZ = "STORY_QUIZ",
  CALENDAR = "CALENDAR",
  PASSPORT = "PASSPORT",
  WORD_MEMORY = "WORD_MEMORY",
  VOCAB_LIST = "VOCAB_LIST"
}

export interface Theme {
  id: string;
  label: string;
  description?: string;
  icon?: string;
  color?: string;
  [key: string]: any;
}

export interface LearnedWord {
  id: string;
  word: string;
  imageUrl?: string;
  definition?: string;
  exampleSentence?: string;
  themeId?: string;
  [key: string]: any;
}

export interface StoryPage {
  id: string;
  text: string;
  imagePrompt?: string;
  imageUrl?: string;
  [key: string]: any;
}

export interface Story {
  id: string;
  title: string;
  pages: StoryPage[];
  createdAt?: number;
  words?: string[];
  [key: string]: any;
}

export interface KidProfile {
  id?: string;
  name?: string;
  age?: number;
  avatarUrl?: string;
  favoriteThemeIds?: string[];
  ageGroup?: '3-5' | '6-8' | '9-12';
  englishLevel?: 'Beginner' | 'Intermediate' | 'Advanced';
  [key: string]: any;
}

export interface PassportBadge {
  id: string;
  label: string;
  description: string;
  icon: string;
  condition: (stories: Story[], totalWords: number) => boolean;
  color: string;
}

export interface WordMastery {
  [wordId: string]: {
    level: number;
    lastReviewed: number;
  };
}

// KidProfile defined above includes both profile meta and preference fields
