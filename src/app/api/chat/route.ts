import { NextRequest, NextResponse } from "next/server";
import { anthropicClient, SYSTEM_PROMPT } from "@/lib/anthropic";

// Simple in-memory rate limiter
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT = 20;
const RATE_WINDOW = 60 * 1000; // 1 minute

function checkRateLimit(ip: string): boolean {
    const now = Date.now();
    const entry = rateLimitMap.get(ip);

    if (!entry || now > entry.resetTime) {
        rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_WINDOW });
        return true;
    }

    if (entry.count >= RATE_LIMIT) {
        return false;
    }

    entry.count++;
    return true;
}

export async function POST(request: NextRequest) {
    try {
        // Rate limiting
        const ip =
            request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
            request.headers.get("x-real-ip") ||
            "unknown";

        if (!checkRateLimit(ip)) {
            return NextResponse.json(
                { error: "Slow down. The blank page isn't going anywhere." },
                { status: 429 }
            );
        }

        const body = await request.json();
        const { messages } = body;

        if (!messages || !Array.isArray(messages)) {
            return NextResponse.json(
                { error: "Invalid request" },
                { status: 400 }
            );
        }

        // Free session: limited by time only (enforced client-side)

        // Format messages for Anthropic
        const formattedMessages = messages.map(
            (msg: { role: string; content: string }) => ({
                role: msg.role as "user" | "assistant",
                content: msg.content,
            })
        );

        // Try primary model, fallback to older model
        let stream;
        try {
            stream = anthropicClient.messages.stream({
                model: process.env.ANTHROPIC_MODEL || "claude-sonnet-4-20250514",
                max_tokens: 150,
                temperature: 0.9,
                system: SYSTEM_PROMPT,
                messages: formattedMessages,
            });
        } catch (error: unknown) {
            const status = (error as { status?: number })?.status;
            if (status === 403 || status === 404) {
                stream = anthropicClient.messages.stream({
                    model:
                        process.env.ANTHROPIC_MODEL_FALLBACK || "claude-3-haiku-20240307",
                    max_tokens: 150,
                    temperature: 0.9,
                    system: SYSTEM_PROMPT,
                    messages: formattedMessages,
                });
            } else {
                throw error;
            }
        }

        // Create a streaming response
        const encoder = new TextEncoder();
        const readableStream = new ReadableStream({
            async start(controller) {
                try {
                    for await (const event of stream) {
                        if (
                            event.type === "content_block_delta" &&
                            event.delta.type === "text_delta"
                        ) {
                            controller.enqueue(encoder.encode(event.delta.text));
                        }
                    }
                    controller.close();
                } catch (error) {
                    console.error("Stream error:", error);
                    controller.close();
                }
            },
        });

        return new Response(readableStream, {
            headers: {
                "Content-Type": "text/plain; charset=utf-8",
                "Cache-Control": "no-cache",
                Connection: "keep-alive",
            },
        });
    } catch (error) {
        console.error("Chat API error:", error);
        return NextResponse.json(
            { error: "The page is thinking. Try again in a moment." },
            { status: 500 }
        );
    }
}
