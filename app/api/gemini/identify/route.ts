import { NextRequest, NextResponse } from 'next/server';
import { identifyObject } from '@/app/lib/geminiService';
import { Theme } from '@/app/lib/types';

export async function POST(request: NextRequest) {
  try {
    const { imageBase64, theme } = await request.json();

    if (!imageBase64) {
      return NextResponse.json(
        { error: 'Missing imageBase64' },
        { status: 400 }
      );
    }

    const result = await identifyObject(imageBase64, theme as Theme | undefined);
    return NextResponse.json(result);
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Failed to identify object' },
      { status: 500 }
    );
  }
}
