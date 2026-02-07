"use client";

import { useEffect, useState, useRef } from "react";

interface AIResponseProps {
    text: string;
    isStreaming: boolean;
}

/**
 * AI response with character-by-character typewriter animation
 * matching the prompt question speed (65ms/char).
 */
export default function AIResponse({ text, isStreaming }: AIResponseProps) {
    const [displayedText, setDisplayedText] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const charIndexRef = useRef(0);
    const timerRef = useRef<NodeJS.Timeout | null>(null);
    const prevTextRef = useRef("");

    useEffect(() => {
        if (!isStreaming && !isTyping) {
            // Already finished — show all text immediately (for saved messages)
            setDisplayedText(text);
            charIndexRef.current = text.length;
            return;
        }

        if (isStreaming) {
            // While streaming, show text as it arrives (no extra delay)
            setDisplayedText(text);
            charIndexRef.current = text.length;
            prevTextRef.current = text;
            return;
        }

        // Streaming just ended — now do the typewriter from where streaming left off
        // Actually for non-streaming (completed messages), type them out char by char
        if (text !== prevTextRef.current) {
            // New text — start typewriter
            charIndexRef.current = 0;
            setDisplayedText("");
            setIsTyping(true);
            prevTextRef.current = text;
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [text, isStreaming]);

    // Character-by-character typewriter for completed messages
    useEffect(() => {
        if (!isTyping) return;

        if (charIndexRef.current >= text.length) {
            setIsTyping(false);
            return;
        }

        timerRef.current = setTimeout(() => {
            charIndexRef.current++;
            setDisplayedText(text.slice(0, charIndexRef.current));
        }, 55); // slightly faster than prompt questions (65ms) since responses are longer

        return () => {
            if (timerRef.current) clearTimeout(timerRef.current);
        };
    }, [isTyping, displayedText, text]);

    return (
        <p
            className="italic font-body"
            style={{
                fontSize: "clamp(1rem, 2vw, 1.25rem)",
                lineHeight: "var(--line-height-body)",
                color: "var(--color-muted)",
            }}
        >
            {displayedText}
            {isTyping && (
                <span
                    className="cursor-blink inline-block ml-0.5"
                    style={{ color: "var(--color-muted)" }}
                >
                    |
                </span>
            )}
        </p>
    );
}
