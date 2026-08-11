import { NextResponse } from "next/server";
import { getPortfolio } from "@/lib/api";
import { buildPortfolioChatResponse } from "@/lib/chatbot";

const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX = 15;
const MAX_QUESTION_LENGTH = 500;

const requestLog = new Map<string, number[]>();

function sanitizeQuestion(input: string): string {
  return input.replace(/[\u0000-\u001f\u007f]/g, "").trim();
}

function getClientIp(request: Request): string {
  const header = request.headers.get("x-forwarded-for") ?? request.headers.get("x-real-ip");
  if (header) return header.split(",")[0]?.trim() || "unknown";
  return "unknown";
}

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const current = requestLog.get(ip) ?? [];
  const fresh = current.filter((timestamp) => now - timestamp < RATE_LIMIT_WINDOW_MS);

  if (fresh.length >= RATE_LIMIT_MAX) {
    requestLog.set(ip, fresh);
    return true;
  }

  fresh.push(now);
  requestLog.set(ip, fresh);
  return false;
}

export async function POST(request: Request) {
  try {
    const ip = getClientIp(request);
    if (isRateLimited(ip)) {
      return NextResponse.json(
        {
          error: "Too many requests. Please wait before sending another message.",
        },
        { status: 429 },
      );
    }

    const body = (await request.json()) as { question?: unknown };
    if (typeof body.question !== "string") {
      return NextResponse.json({ error: "Invalid request payload." }, { status: 400 });
    }

    const question = sanitizeQuestion(body.question);
    if (!question) {
      return NextResponse.json({ error: "Please enter a question." }, { status: 400 });
    }

    if (question.length > MAX_QUESTION_LENGTH) {
      return NextResponse.json(
        {
          error: `Question is too long. Please keep it under ${MAX_QUESTION_LENGTH} characters.`,
        },
        { status: 413 },
      );
    }

    const portfolio = await getPortfolio();
    const response = buildPortfolioChatResponse(question, portfolio);

    return NextResponse.json({
      ...response,
      meta: {
        questionLength: question.length,
      },
    });
  } catch {
    return NextResponse.json(
      {
        error: "Unable to process your request right now. Please try again.",
      },
      { status: 500 },
    );
  }
}
