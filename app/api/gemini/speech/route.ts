import { NextRequest, NextResponse } from 'next/server';
import { generateSpeech } from '@/app/lib/geminiService';

export async function POST(request: NextRequest) {
  try {
    const { text } = await request.json();

    if (!text) {
      return NextResponse.json(
        { error: 'Missing text' },
        { status: 400 }
      );
    }

    const result = await generateSpeech(text);
    return NextResponse.json({ audio: result });
  } catch (error) {
    console.error('TTS API Error:', error);
    return NextResponse.json(
      { error: 'Failed to generate speech' },
      { status: 500 }
    );
  }
}
