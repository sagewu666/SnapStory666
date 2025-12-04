import { NextResponse } from "next/server";
import { synthesizeSpeech } from "../../../lib/geminiService";

export async function POST(req: Request) {
  try {
    const { text } = await req.json();

    const audio = await synthesizeSpeech(text);

    return NextResponse.json({ audio });
  } catch (err) {
    console.error("Speech Error:", err);
    return NextResponse.json({ error: "Speech failed" }, { status: 500 });
  }
}
