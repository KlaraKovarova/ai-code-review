import { NextRequest, NextResponse } from "next/server";
import { reviewCode } from "@/lib/claude";
import { DEMO_REVIEW } from "@/lib/demo";

export const maxDuration = 60;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as {
      code?: string;
      language?: string;
      focus?: string[];
      apiKey?: string;
    };

    const { code, language = "", focus = [], apiKey } = body;

    if (!code || typeof code !== "string" || !code.trim()) {
      return NextResponse.json({ error: "code is required" }, { status: 400 });
    }

    if (code.trim().length > 20000) {
      return NextResponse.json({ error: "Code too long (max 20 000 characters)" }, { status: 400 });
    }

    const resolvedKey =
      apiKey && typeof apiKey === "string" && apiKey.trim()
        ? apiKey.trim()
        : process.env.ANTHROPIC_API_KEY;

    if (!resolvedKey) {
      return NextResponse.json({ review: DEMO_REVIEW, demo: true });
    }

    const review = await reviewCode(code.trim(), language, focus, resolvedKey);
    return NextResponse.json({ review });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Review failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
