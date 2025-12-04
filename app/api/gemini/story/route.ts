import { NextRequest, NextResponse } from 'next/server';
import { generateStoryContent, generateIllustration } from '@/app/lib/geminiService';
import { LearnedWord, Theme, KidProfile } from '@/app/lib/types';

export async function POST(request: NextRequest) {
  try {
    const { learnedWords, theme, kidProfile, userPrompt } = await request.json();

    if (!learnedWords || !theme || !kidProfile) {
      return NextResponse.json(
        { error: 'Missing required fields: learnedWords, theme, or kidProfile' },
        { status: 400 }
      );
    }

    const storyContent = await generateStoryContent(
      learnedWords as LearnedWord[],
      theme as Theme,
      kidProfile as KidProfile,
      userPrompt
    );

    // Generate cover image
    const coverImage = await generateIllustration(
      storyContent.pages[0].text,
      "storybook style",
      storyContent.mainCharacterVisual
    );

    if (coverImage) {
      storyContent.pages[0].imageUrl = coverImage;
    }

    return NextResponse.json(storyContent);
  } catch (error) {
    console.error('Story Generation API Error:', error);
    return NextResponse.json(
      { error: 'Failed to generate story' },
      { status: 500 }
    );
  }
}
