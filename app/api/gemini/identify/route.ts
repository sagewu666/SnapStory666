import { NextResponse } from "next/server";
import { identifyObjectFromImage } from "../../../lib/geminiService";

export async function POST(req: Request) {
  try {
    const { image } = await req.json();

    const result = await identifyObjectFromImage(image);

    return NextResponse.json({ result });
  } catch (err) {
    console.error("Identify Error:", err);
    return NextResponse.json({ error: "Identify failed" }, { status: 500 });
  }
}
