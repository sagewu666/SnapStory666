import { NextRequest, NextResponse } from 'next/server';
import { lookupWordDefinition } from '@/app/lib/geminiService';

export async function POST(request: NextRequest) {
  try {
    const { word, context, ageGroup } = await request.json();

    if (!word || !ageGroup) {
      return NextResponse.json(
        { error: 'Missing word or ageGroup' },
        { status: 400 }
      );
    }

    const result = await lookupWordDefinition(
      word,
      context || "",
      ageGroup
    );

    return NextResponse.json(result);
  } catch (error) {
    console.error('Word Lookup API Error:', error);
    return NextResponse.json(
      { error: 'Failed to lookup word' },
      { status: 500 }
    );
  }
}
