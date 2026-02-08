"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SessionInput from "./SessionInput";
import AIResponse from "./AIResponse";
import ProgressBar from "./ProgressBar";
import TypewriterRotator from "./TypewriterRotator";
import { SESSION_CONFIG, ERROR_MESSAGES } from "@/lib/constants";

type Message = {
    role: "user" | "assistant";
    content: string;
};

interface BlankPageExperienceProps {
    mode: "free" | "paid";
    onSessionEnd?: () => void;
    onScroll?: () => void;
    onMessagesChange?: (messages: Message[]) => void;
}

export default function BlankPageExperience({
    mode,
    onSessionEnd,
    onScroll,
    onMessagesChange,
}: BlankPageExperienceProps) {
    // Reveal stages — input shows immediately, everything else fades in
    const [showPrompt, setShowPrompt] = useState(false);
    const [showBorder, setShowBorder] = useState(false);
    const [showHint, setShowHint] = useState(false);

    const [messages, setMessages] = useState<Message[]>([]);
    const [inputValue, setInputValue] = useState("");
    const [isStreaming, setIsStreaming] = useState(false);
    const [streamingText, setStreamingText] = useState("");
    const [hasStartedTyping, setHasStartedTyping] = useState(false);
    const [sessionEnded, setSessionEnded] = useState(false);
    const [showEndMessage, setShowEndMessage] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [timerActive, setTimerActive] = useState(false);
    const [isLockedOut, setIsLockedOut] = useState(false);

    const messagesContainerRef = useRef<HTMLDivElement>(null);
    const sectionRef = useRef<HTMLElement>(null);
    const [viewportHeight, setViewportHeight] = useState<number | null>(null);

    // Stage timings
    useEffect(() => {
        const t1 = setTimeout(() => setShowPrompt(true), SESSION_CONFIG.PROMPT_DELAY);
        const t2 = setTimeout(() => setShowBorder(true), SESSION_CONFIG.BORDER_DELAY);
        const t3 = setTimeout(() => setShowHint(true), SESSION_CONFIG.HINT_DELAY);
        return () => {
            clearTimeout(t1);
            clearTimeout(t2);
            clearTimeout(t3);
        };
    }, []);

    // Lock page scroll on mount
    useEffect(() => {
        window.scrollTo(0, 0);

        // Check for existing free session lockout
        if (mode === "free") {
            try {
                const sessionData = localStorage.getItem("blankpage_free_session");
                if (sessionData) {
                    const { startedAt } = JSON.parse(sessionData);
                    const elapsed = Date.now() - new Date(startedAt).getTime();
                    const twentyFourHours = 24 * 60 * 60 * 1000;

                    if (elapsed < twentyFourHours) {
                        setIsLockedOut(true);
                    } else {
                        // Lockout expired, clear it
                        localStorage.removeItem("blankpage_free_session");
                    }
                }
            } catch {
                // Ignore storage errors (incognito etc)
            }
        }
    }, [mode]);

    // Mobile keyboard detection via visualViewport API
    useEffect(() => {
        const vv = window.visualViewport;
        if (!vv) return;

        const handleResize = () => {
            // When the keyboard opens, visualViewport.height shrinks
            // Use it directly as our container height
            setViewportHeight(vv.height);

            // Scroll messages to bottom when keyboard opens
            if (messagesContainerRef.current) {
                requestAnimationFrame(() => {
                    messagesContainerRef.current?.scrollTo({
                        top: messagesContainerRef.current.scrollHeight,
                        behavior: "smooth",
                    });
                });
            }
        };

        // Set initial height
        setViewportHeight(vv.height);

        vv.addEventListener("resize", handleResize);
        vv.addEventListener("scroll", handleResize);

        return () => {
            vv.removeEventListener("resize", handleResize);
            vv.removeEventListener("scroll", handleResize);
        };
    }, []);

    // Scroll within messages container only
    useEffect(() => {
        if (messages.length > 0 && messagesContainerRef.current) {
            messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
        }
    }, [messages, streamingText]);

    // Notify parent of message changes (for session saving)
    useEffect(() => {
        onMessagesChange?.(messages);
    }, [messages, onMessagesChange]);

    const handleSessionEnd = useCallback(() => {
        setSessionEnded(true);
        setShowEndMessage(true);
        onSessionEnd?.();
    }, [onSessionEnd]);

    const handleSubmit = useCallback(
        async (text: string) => {
            if (sessionEnded || isStreaming) return;

            if (mode === "free") {
                if (!timerActive) {
                    setTimerActive(true);
                    // Start 24h lockout timer
                    try {
                        localStorage.setItem("blankpage_free_session", JSON.stringify({
                            startedAt: new Date().toISOString()
                        }));
                    } catch { /* ignore */ }
                }
            }
            if (!hasStartedTyping) {
                setHasStartedTyping(true);
            }

            const userMessage: Message = { role: "user", content: text };
            const newMessages = [...messages, userMessage];
            setMessages(newMessages);
            setInputValue("");
            setError(null);

            // Free session: only limited by timer, no message count limit

            setIsStreaming(true);
            setStreamingText("");

            try {
                const response = await fetch("/api/chat", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ messages: newMessages, sessionType: mode }),
                });

                if (response.status === 402) { handleSessionEnd(); return; }
                if (response.status === 429) {
                    setError(ERROR_MESSAGES.RATE_LIMIT);
                    setIsStreaming(false);
                    return;
                }
                if (!response.ok) {
                    let errorMsg = ERROR_MESSAGES.AI_FAILURE;
                    try {
                        const d = await response.json();
                        if (d?.error) errorMsg = d.error;
                    } catch { /* ignore */ }
                    setError(errorMsg);
                    setIsStreaming(false);
                    return;
                }

                const reader = response.body?.getReader();
                const decoder = new TextDecoder();
                let fullText = "";

                if (reader) {
                    while (true) {
                        const { done, value } = await reader.read();
                        if (done) break;
                        fullText += decoder.decode(value, { stream: true });
                        setStreamingText(fullText);
                    }
                }

                setMessages((prev) => [...prev, { role: "assistant", content: fullText }]);
                setStreamingText("");
            } catch {
                setError(ERROR_MESSAGES.NETWORK_ERROR);
            } finally {
                setIsStreaming(false);
            }
        },
        [messages, mode, sessionEnded, isStreaming, timerActive, hasStartedTyping, handleSessionEnd]
    );

    const handleTimerComplete = useCallback(() => {
        setMessages((prev) => [
            ...prev,
            { role: "assistant", content: SESSION_CONFIG.FREE_SESSION_END_MESSAGE },
        ]);
        setTimeout(() => handleSessionEnd(), 3000);
    }, [handleSessionEnd]);

    const isConversationActive = messages.length > 0;

    return (
        <section
            ref={sectionRef}
            className="relative flex flex-col"
            style={{
                backgroundColor: "var(--color-paper)",
                height: viewportHeight ? `${viewportHeight}px` : "100dvh",
                overflow: "hidden",
                overflowX: "hidden",
            }}
        >
            {/* Progress bar */}
            {mode === "free" && !isLockedOut && (
                <ProgressBar isActive={timerActive} onComplete={handleTimerComplete} />
            )}

            {/* Locked out state */}
            {isLockedOut && (
                <div className="absolute inset-0 z-50 flex items-center justify-center p-8 text-center" style={{ backgroundColor: "var(--color-paper)" }}>
                    <div>
                        <p
                            className="font-body italic mb-8"
                            style={{
                                fontSize: "1.125rem",
                                color: "#8A8A8A",
                                lineHeight: "1.6"
                            }}
                        >
                            Your free session has ended.<br />
                            The page will be here tomorrow. Or you can get yours now.
                        </p>
                        <button
                            onClick={onScroll}
                            className="inline-block border border-ink text-ink font-body transition-colors hover:bg-ink hover:text-paper"
                            style={{
                                padding: "1rem 3rem",
                                fontSize: "var(--font-size-base)",
                                letterSpacing: "0.1em",
                            }}
                        >
                            Get Your Page
                        </button>
                    </div>
                </div>
            )}

            {/* ==============================================================
                PRE-CONVERSATION — position-locked centered layout
                Everything positioned relative to the input which stays fixed
                ============================================================== */}
            {!isConversationActive && !isLockedOut && (
                <div
                    className="flex-1 flex flex-col items-center justify-center px-8 md:px-12"
                >
                    {/*
                      Layout structure (top to bottom, all items pre-allocated):
                      1. Question text slot (fixed height, always present)
                      2. Spacer
                      3. Input field (always present from load)
                      4. Spacer
                      5. Hint text slot (fixed height, always present)
                    */}

                    {/* 1. Question text — fades out when user starts typing */}
                    <motion.div
                        initial={{ opacity: 1, height: "auto", marginBottom: "2rem" }}
                        animate={
                            hasStartedTyping
                                ? { opacity: 0, height: 0, marginBottom: 0 }
                                : { opacity: 1, height: "auto", marginBottom: "2rem" }
                        }
                        transition={
                            hasStartedTyping
                                ? {
                                    opacity: { duration: 0.6, ease: [0.4, 0, 0.2, 1] },
                                    height: { duration: 0.4, delay: 0.6, ease: [0.4, 0, 0.2, 1] },
                                    marginBottom: { duration: 0.4, delay: 0.6, ease: [0.4, 0, 0.2, 1] },
                                }
                                : { duration: 0.3 }
                        }
                        style={{ overflow: "hidden", minHeight: hasStartedTyping ? 0 : undefined }}
                    >
                        <AnimatePresence>
                            {showPrompt && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ duration: 1.2, ease: [0.4, 0, 0.2, 1] }}
                                >
                                    <TypewriterRotator
                                        questions={SESSION_CONFIG.INITIAL_QUESTIONS}
                                        intervalMs={SESSION_CONFIG.QUESTION_ROTATION_INTERVAL}
                                        frozen={hasStartedTyping}
                                    />
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>

                    {/* 3. Input — always visible from page load */}
                    <div className="w-full" style={{ maxWidth: "36rem" }}>
                        <SessionInput
                            value={inputValue}
                            onChange={(val) => {
                                setInputValue(val);
                                if (!hasStartedTyping && val.length > 0) {
                                    setHasStartedTyping(true);
                                }
                            }}
                            onSubmit={handleSubmit}
                            disabled={isStreaming || sessionEnded}
                            showBorder={showBorder}
                        />
                    </div>

                    {/* 5. Hint text — fixed-height container, content fades in */}
                    <div style={{ minHeight: "2rem", marginTop: "2rem" }}>
                        <AnimatePresence>
                            {showHint && (
                                <motion.p
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 0.4 }}
                                    transition={{ duration: 1.5 }}
                                    className="text-center italic"
                                    style={{
                                        fontSize: "clamp(0.75rem, 1.5vw, 0.875rem)",
                                        color: "var(--color-muted)",
                                    }}
                                >
                                    scroll to read our manifesto
                                </motion.p>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            )}

            {/* ==============================================================
                CONVERSATION — messages + input pinned at bottom
                ============================================================== */}
            {isConversationActive && !isLockedOut && (
                <div
                    className="flex-1 flex flex-col px-8 md:px-12"
                    style={{
                        maxWidth: "42rem",
                        margin: "0 auto",
                        width: "100%",
                        overflow: "hidden",
                    }}
                >
                    {/* Scrollable messages */}
                    <div
                        ref={messagesContainerRef}
                        className="flex-1 overflow-y-auto"
                        style={{
                            paddingTop: "3rem",
                            paddingBottom: "2rem",
                            scrollbarWidth: "none",
                            msOverflowStyle: "none",
                        }}
                    >
                        <div className="space-y-8">
                            {messages.map((msg, i) =>
                                msg.role === "user" ? (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
                                    >
                                        <p
                                            className="text-ink font-body"
                                            style={{
                                                fontSize: "clamp(1.0625rem, 2vw, 1.375rem)",
                                                lineHeight: "var(--line-height-body)",
                                            }}
                                        >
                                            {msg.content}
                                        </p>
                                    </motion.div>
                                ) : (
                                    <div key={i}>
                                        <AIResponse text={msg.content} isStreaming={false} />
                                    </div>
                                )
                            )}

                            {isStreaming && streamingText && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.4 }}
                                >
                                    <AIResponse text={streamingText} isStreaming={true} />
                                </motion.div>
                            )}
                        </div>
                    </div>

                    {/* Input pinned at bottom */}
                    {!sessionEnded && (
                        <div style={{ paddingBottom: "0.75rem", flexShrink: 0 }}>
                            <SessionInput
                                value={inputValue}
                                onChange={(val) => {
                                    setInputValue(val);
                                    if (!hasStartedTyping && val.length > 0) {
                                        setHasStartedTyping(true);
                                    }
                                }}
                                onSubmit={handleSubmit}
                                disabled={isStreaming || sessionEnded}
                                showBorder={true}
                            />

                            <p
                                className="mt-3 text-center italic"
                                style={{
                                    fontSize: "clamp(0.7rem, 1.2vw, 0.8rem)",
                                    color: "var(--color-muted)",
                                    opacity: 0.35,
                                }}
                            >
                                scroll to read our manifesto
                            </p>
                        </div>
                    )}

                    {/* Error */}
                    <AnimatePresence>
                        {error && (
                            <motion.p
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="pb-4 italic text-center animate-shake"
                                style={{
                                    fontSize: "var(--font-size-sm)",
                                    color: "var(--color-muted)",
                                }}
                            >
                                {error}
                            </motion.p>
                        )}
                    </AnimatePresence>

                    {/* End session CTA */}
                    <AnimatePresence>
                        {showEndMessage && mode === "free" && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 1.2, delay: 2, ease: [0.4, 0, 0.2, 1] }}
                                className="py-8 text-center"
                            >
                                <button
                                    onClick={onScroll}
                                    className="inline-block border border-ink text-ink font-body transition-colors hover:bg-ink hover:text-paper"
                                    style={{
                                        padding: "1rem 3rem",
                                        fontSize: "var(--font-size-base)",
                                        letterSpacing: "0.1em",
                                    }}
                                >
                                    Get Your Page
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            )}
        </section>
    );
}
