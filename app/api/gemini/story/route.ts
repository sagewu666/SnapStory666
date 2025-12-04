import { NextResponse } from "next/server";
import { generateStory } from "../../../lib/geminiService";

export async function POST(req: Request) {
  try {
    const { words } = await req.json();

    const story = await generateStory(words);

    return NextResponse.json({ story });
  } catch (err) {
    console.error("Story Error:", err);
    return NextResponse.json({ error: "Story failed" }, { status: 500 });
  }
}

