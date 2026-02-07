"use client";

import { useState, useEffect, useRef, useCallback } from "react";

interface TypewriterRotatorProps {
    questions: string[];
    intervalMs: number;
    /** Called when user starts typing so we freeze the current question */
    frozen?: boolean;
}

/**
 * Displays a question with typewriter effect.
 * After `intervalMs`, it backspaces the current question character by character,
 * then types the next one character by character.
 *
 * When `frozen` becomes true, the current question finishes typing to the end
 * and then stays permanently (no deleting/rotating).
 */
export default function TypewriterRotator({
    questions,
    intervalMs,
    frozen = false,
}: TypewriterRotatorProps) {
    const [displayText, setDisplayText] = useState("");
    const [questionIndex, setQuestionIndex] = useState(0);
    const [phase, setPhase] = useState<"typing" | "idle" | "deleting">("typing");
    const charIndexRef = useRef(0);
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    const currentQuestion = questions[questionIndex];

    // Phase: TYPING — type in character by character
    // When frozen, we STILL finish typing the current question (don't cut off mid-word)
    useEffect(() => {
        if (phase !== "typing") return;

        const target = questions[questionIndex];
        if (charIndexRef.current >= target.length) {
            // If frozen, stay here forever (don't transition to idle/deleting)
            if (!frozen) {
                setPhase("idle");
            }
            return;
        }

        timerRef.current = setTimeout(() => {
            charIndexRef.current++;
            setDisplayText(target.slice(0, charIndexRef.current));
        }, 65); // typing speed per character — smooth and deliberate

        return () => {
            if (timerRef.current) clearTimeout(timerRef.current);
        };
    }, [phase, displayText, questionIndex, questions, frozen]);

    // Phase: IDLE — wait for intervalMs, then start deleting
    useEffect(() => {
        if (phase !== "idle" || frozen) return;

        timerRef.current = setTimeout(() => {
            setPhase("deleting");
        }, intervalMs);

        return () => {
            if (timerRef.current) clearTimeout(timerRef.current);
        };
    }, [phase, intervalMs, frozen]);

    // Phase: DELETING — backspace character by character
    // If frozen mid-delete, immediately retype the current question
    useEffect(() => {
        if (phase !== "deleting") return;

        if (frozen) {
            // Frozen while deleting — retype the current question
            setPhase("typing");
            return;
        }

        if (charIndexRef.current <= 0) {
            // Move to next question
            const nextIndex = (questionIndex + 1) % questions.length;
            setQuestionIndex(nextIndex);
            charIndexRef.current = 0;
            setDisplayText("");
            setPhase("typing");
            return;
        }

        timerRef.current = setTimeout(() => {
            charIndexRef.current--;
            setDisplayText(currentQuestion.slice(0, charIndexRef.current));
        }, 40); // backspace speed — slightly faster than typing

        return () => {
            if (timerRef.current) clearTimeout(timerRef.current);
        };
    }, [phase, displayText, questionIndex, questions, currentQuestion, frozen]);

    // Get stable height — use the longest question for min-height
    const longestQuestion = useCallback(() => {
        return questions.reduce((a, b) => (a.length > b.length ? a : b), "");
    }, [questions]);

    return (
        <div className="relative" style={{ minHeight: "3.2em" }}>
            {/* Invisible text for stable height — wraps on mobile */}
            <p
                className="italic text-center invisible"
                style={{
                    fontSize: "clamp(1rem, 2.2vw, 1.5rem)",
                    lineHeight: "1.6",
                }}
                aria-hidden="true"
            >
                {longestQuestion()}
            </p>

            {/* Actual visible text — wraps naturally */}
            <p
                className="italic text-center absolute inset-0 flex items-center justify-center"
                style={{
                    fontSize: "clamp(1rem, 2.2vw, 1.5rem)",
                    color: "var(--color-muted)",
                    lineHeight: "1.6",
                }}
            >
                {displayText}
                <span
                    className="cursor-blink inline-block ml-0.5"
                    style={{ color: "var(--color-muted)" }}
                >
                    |
                </span>
            </p>
        </div>
    );
}
