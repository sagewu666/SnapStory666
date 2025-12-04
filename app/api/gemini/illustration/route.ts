import { NextResponse } from "next/server";
import { generateIllustration } from "../../../lib/geminiService";

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();

    const result = await generateIllustration(prompt);

    return NextResponse.json({ result });
  } catch (err) {
    console.error("Illustration Error:", err);
    return NextResponse.json({ error: "Illustration failed" }, { status: 500 });
  }
}
