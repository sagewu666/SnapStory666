import { NextRequest, NextResponse } from 'next/server';
import { generateIllustration } from '@/app/lib/geminiService';

export async function POST(request: NextRequest) {
  try {
    const { prompt, style, characterVisual } = await request.json();

    if (!prompt) {
      return NextResponse.json(
        { error: 'Missing prompt' },
        { status: 400 }
      );
    }

    const result = await generateIllustration(
      prompt,
      style || "storybook style",
      characterVisual || "a character"
    );

    return NextResponse.json({ imageUrl: result });
  } catch (error) {
    console.error('Illustration Generation API Error:', error);
    return NextResponse.json(
      { error: 'Failed to generate illustration' },
      { status: 500 }
    );
  }
}
