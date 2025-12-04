// Shared types for both frontend and backend

export enum ThemeCategory {
  COLOR = 'Color',
  SHAPE = 'Shape',
  MATERIAL = 'Material',
  SPACE = 'Space',
  FUNCTION = 'Function',
  SURPRISE = 'Surprise'
}

export interface Theme {
  id: string;
  label: string;
  category: ThemeCategory;
  icon: string;
  description: string;
  promptContext: string;
  color: string;
}

export interface LearnedWord {
  id: string;
  word: string;
  definition: string;
  imageUrl: string;
  originalImage: string;
  timestamp: number;
  visualDetail: string;
}

export interface StoryPage {
  pageNumber: number;
  text: string;
  imageUrl?: string;
  fallbackImagePrompt?: string;
}

export interface KidProfile {
  ageGroup: '3-5' | '6-8' | '9-12';
  englishLevel: 'Beginner' | 'Intermediate' | 'Advanced';
}
