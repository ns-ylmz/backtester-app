import { NextRequest, NextResponse } from "next/server";
import { streamText } from "ai";
import { createOpenAI } from "@ai-sdk/openai";

export const runtime = "edge";

const SYSTEM_PROMPT =
  "You are a professional trading strategy optimization expert. Analyze user's trading strategies and provide improvement suggestions focusing on technical analysis, risk management, and backtest results. Respond in Turkish.";

const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX_REQUESTS = 5;

interface StrategyRequest {
  strategy: string;
  timeframe?: string;
  riskProfile?: string;
  instruments?: string;
  goals?: string;
}

interface RateLimitEntry {
  count: number;
  expiresAt: number;
}

const rateLimitStore = new Map<string, RateLimitEntry>();

const openai = createOpenAI({
  apiKey: process.env.OPENAI_API_KEY ?? "",
});

export async function POST(req: NextRequest) {
  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json(
      { error: "Sunucu yapılandırması eksik: OPENAI_API_KEY tanımlı değil." },
      { status: 500 }
    );
  }

  const identifier = getRequesterIdentifier(req);
  if (isRateLimited(identifier)) {
    return NextResponse.json(
      {
        error:
          "Çok fazla istek gönderdiniz. Lütfen bir dakika sonra tekrar deneyin.",
      },
      { status: 429 }
    );
  }

  let body: any;
  try {
    body = await req.json();
  } catch (_error) {
    return NextResponse.json(
      { error: "Geçersiz JSON formatı gönderildi." },
      { status: 400 }
    );
  }

  // Support both useChat format (messages) and direct strategy format
  let userMessage: string;
  if (body.messages && Array.isArray(body.messages)) {
    // useChat format - get the last user message
    const lastUserMessage = body.messages
      .filter((msg: any) => msg.role === "user")
      .pop();
    if (!lastUserMessage?.content) {
      return NextResponse.json(
        { error: "Geçerli bir mesaj bulunamadı." },
        { status: 400 }
      );
    }
    userMessage = lastUserMessage.content;
  } else if (body.strategy) {
    // Direct strategy format
    userMessage = body.strategy;
  } else {
    return NextResponse.json(
      { error: "strategy alanı veya messages zorunludur." },
      { status: 400 }
    );
  }

  if (!userMessage || typeof userMessage !== "string" || !userMessage.trim()) {
    return NextResponse.json(
      { error: "Mesaj içeriği zorunludur ve metin olmalıdır." },
      { status: 400 }
    );
  }

  try {
    const result = await streamText({
      model: openai("gpt-3.5-turbo"),
      temperature: 0.4,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        {
          role: "user",
          content: userMessage.trim(),
        },
      ],
    });

    return result.toTextStreamResponse();
  } catch (error) {
    console.error("Trading strategy route error:", error);
    return NextResponse.json(
      {
        error:
          "Strateji önerileri oluşturulurken bir hata oluştu. Lütfen tekrar deneyin.",
      },
      { status: 500 }
    );
  }
}

function buildUserPrompt(payload: StrategyRequest): string {
  const sections = [
    `Strateji Özeti: ${payload.strategy.trim()}`,
    payload.timeframe && `Hedef Zaman Dilimi: ${payload.timeframe}`,
    payload.riskProfile && `Risk Profili: ${payload.riskProfile}`,
    payload.instruments && `İşlem Enstrümanları: ${payload.instruments}`,
    payload.goals && `Hedefler / Ek Notlar: ${payload.goals}`,
  ].filter(Boolean);

  return sections.join("\n");
}

function getRequesterIdentifier(req: NextRequest): string {
  const forwardedFor = req.headers.get("x-forwarded-for");
  if (forwardedFor) {
    return forwardedFor.split(",")[0]?.trim() ?? "anonymous";
  }

  const realIp = req.headers.get("x-real-ip");
  if (realIp) {
    return realIp;
  }

  return "anonymous";
}

function isRateLimited(identifier: string): boolean {
  const now = Date.now();
  const entry = rateLimitStore.get(identifier);

  if (!entry || entry.expiresAt < now) {
    rateLimitStore.set(identifier, {
      count: 1,
      expiresAt: now + RATE_LIMIT_WINDOW_MS,
    });
    return false;
  }

  if (entry.count >= RATE_LIMIT_MAX_REQUESTS) {
    return true;
  }

  entry.count += 1;
  rateLimitStore.set(identifier, entry);
  return false;
}