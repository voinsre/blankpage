"use client";

import { useRef, useEffect, useState, useCallback } from "react";

interface SessionInputProps {
    onSubmit: (text: string) => void;
    disabled?: boolean;
    value: string;
    onChange: (value: string) => void;
    showBorder?: boolean;
}

export default function SessionInput({
    onSubmit,
    disabled = false,
    value,
    onChange,
    showBorder = true,
}: SessionInputProps) {
    const inputRef = useRef<HTMLTextAreaElement>(null);
    const idleTimerRef = useRef<NodeJS.Timeout | null>(null);
    const [isListening, setIsListening] = useState(false);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const recognitionRef = useRef<any>(null);

    // Auto-resize textarea to fit content, with a max height
    const autoResize = useCallback(() => {
        const el = inputRef.current;
        if (!el) return;
        // Reset height to auto so scrollHeight recalculates
        el.style.height = "auto";
        // Max height: ~6 lines on desktop, ~4 lines on mobile
        const maxHeight = window.innerWidth < 640 ? 120 : 180;
        const newHeight = Math.min(el.scrollHeight, maxHeight);
        el.style.height = `${newHeight}px`;
        // Show scrollbar only when content exceeds max
        el.style.overflowY = el.scrollHeight > maxHeight ? "auto" : "hidden";
    }, []);

    // Keep focus on the input — always (without scrolling the page)
    useEffect(() => {
        if (inputRef.current && !disabled) {
            inputRef.current.focus({ preventScroll: true });
        }
    }, [disabled]);

    // Re-focus on click anywhere, and also on blur
    // But NOT when a modal/overlay is open (z-50 fixed element)
    useEffect(() => {
        const isModalOpen = () => !!document.querySelector(".fixed.z-50, [class*='z-50']");

        const keepFocus = () => {
            if (inputRef.current && !disabled && !isModalOpen()) {
                inputRef.current.focus({ preventScroll: true });
            }
        };

        const handleClick = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            if (target.closest("[data-voice-btn]")) return;
            if (target.closest(".fixed")) return; // Don't steal focus from modals
            keepFocus();
        };

        document.addEventListener("click", handleClick);

        // Re-focus when the input blurs so the caret stays visible
        const input = inputRef.current;
        if (input) {
            input.addEventListener("blur", () => {
                // Small delay to let modal focus happen first
                setTimeout(keepFocus, 50);
            });
        }

        return () => {
            document.removeEventListener("click", handleClick);
        };
    }, [disabled]);

    // Auto-resize whenever value changes
    useEffect(() => {
        autoResize();
    }, [value, autoResize]);

    // Reset idle timer on each keystroke
    useEffect(() => {
        if (value.trim().length === 0) return;

        if (idleTimerRef.current) {
            clearTimeout(idleTimerRef.current);
        }

        idleTimerRef.current = setTimeout(() => {
            if (value.trim()) {
                onSubmit(value.trim());
            }
        }, 5000);

        return () => {
            if (idleTimerRef.current) {
                clearTimeout(idleTimerRef.current);
            }
        };
    }, [value, onSubmit]);

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            if (value.trim()) {
                if (idleTimerRef.current) {
                    clearTimeout(idleTimerRef.current);
                }
                onSubmit(value.trim());
            }
        }
    };

    // Web Speech API
    const toggleVoice = useCallback(() => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const win = window as any;
        if (!win.webkitSpeechRecognition && !win.SpeechRecognition) {
            alert("Voice input is not supported in this browser.");
            return;
        }

        if (isListening && recognitionRef.current) {
            recognitionRef.current.stop();
            setIsListening(false);
            return;
        }

        const SpeechRecognitionAPI = win.SpeechRecognition || win.webkitSpeechRecognition;
        if (!SpeechRecognitionAPI) return;

        const recognition = new SpeechRecognitionAPI();
        recognition.continuous = false;
        recognition.interimResults = true;
        recognition.lang = "en-US";

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        recognition.onresult = (event: any) => {
            let transcript = "";
            for (let i = 0; i < event.results.length; i++) {
                transcript += event.results[i][0].transcript;
            }
            onChange(transcript);
        };

        recognition.onend = () => {
            setIsListening(false);
        };

        recognition.onerror = () => {
            setIsListening(false);
        };

        recognitionRef.current = recognition;
        recognition.start();
        setIsListening(true);
    }, [isListening, onChange]);

    return (
        <div
            className="relative w-full transition-all duration-1000 ease-out"
            style={{
                border: showBorder ? "1px solid var(--color-faint)" : "1px solid transparent",
                borderRadius: "8px",
                padding: "0.75rem 1.25rem",
                backgroundColor: showBorder ? "rgba(255,255,255,0.35)" : "transparent",
            }}
        >
            <div className="flex items-start gap-3">
                <textarea
                    ref={inputRef}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    onKeyDown={handleKeyDown}
                    disabled={disabled}
                    rows={1}
                    className="flex-1 font-body text-ink text-center resize-none"
                    style={{
                        fontSize: "clamp(1.0625rem, 2.5vw, 1.375rem)",
                        lineHeight: "1.8",
                        caretColor: "var(--color-ink)",
                        background: "transparent",
                        border: "none",
                        outline: "none",
                        padding: "0.5rem 0",
                        minHeight: "2.5rem",
                        overflowY: "hidden",
                        scrollbarWidth: "thin",
                        scrollbarColor: "var(--color-faint) transparent",
                    }}
                    autoFocus
                    autoComplete="off"
                    autoCapitalize="off"
                    spellCheck={false}
                    aria-label="Type your thoughts"
                    placeholder=""
                />
                <button
                    data-voice-btn
                    type="button"
                    onClick={toggleVoice}
                    className="font-body shrink-0 transition-opacity mt-2"
                    style={{
                        fontSize: "clamp(0.75rem, 1.5vw, 0.875rem)",
                        color: isListening ? "var(--color-ink)" : "var(--color-muted)",
                        background: "transparent",
                        border: "none",
                        cursor: "pointer",
                        padding: "0.25rem 0.5rem",
                        letterSpacing: "0.05em",
                        opacity: isListening ? 1 : 0.5,
                        textTransform: "lowercase",
                    }}
                    aria-label={isListening ? "Stop listening" : "Start voice input"}
                >
                    {isListening ? "listening..." : "voice"}
                </button>
            </div>
        </div>
    );
}
