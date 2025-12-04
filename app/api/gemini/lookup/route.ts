import { NextResponse } from "next/server";
import { lookupWordMeaning } from "../../../lib/geminiService";

export async function POST(req: Request) {
  try {
    const { word } = await req.json();

    const result = await lookupWordMeaning(word);

    return NextResponse.json({ result });
  } catch (err) {
    console.error("Lookup Error:", err);
    return NextResponse.json({ error: "Lookup failed" }, { status: 500 });
  }
}

