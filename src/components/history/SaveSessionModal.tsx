"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface SaveSessionModalProps {
    onSave: (title: string) => void;
    onClose: () => void;
}

export default function SaveSessionModal({ onSave, onClose }: SaveSessionModalProps) {
    const [title, setTitle] = useState("");
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        setTimeout(() => inputRef.current?.focus({ preventScroll: true }), 100);
    }, []);

    const handleSubmit = () => {
        onSave(title.trim());
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") {
            e.preventDefault();
            handleSubmit();
        }
        if (e.key === "Escape") {
            onClose();
        }
    };

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="fixed inset-0 z-50 flex items-center justify-center px-6"
                style={{ backgroundColor: "rgba(250, 250, 250, 0.92)" }}
                onClick={(e) => {
                    if (e.target === e.currentTarget) onClose();
                }}
            >
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
                    className="w-full"
                    style={{ maxWidth: "400px" }}
                >
                    {/* Title */}
                    <p
                        className="text-ink text-center mb-6 italic"
                        style={{
                            fontSize: "var(--font-size-base)",
                            color: "var(--color-muted)",
                        }}
                    >
                        name this page
                    </p>

                    {/* Input */}
                    <div
                        style={{
                            border: "1px solid var(--color-faint)",
                            borderRadius: "8px",
                            padding: "0.75rem 1.25rem",
                            backgroundColor: "rgba(255,255,255,0.35)",
                        }}
                    >
                        <input
                            ref={inputRef}
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="untitled"
                            className="w-full font-body text-ink text-center"
                            style={{
                                fontSize: "clamp(1rem, 2vw, 1.25rem)",
                                lineHeight: "1.8",
                                caretColor: "var(--color-ink)",
                                background: "transparent",
                                border: "none",
                                outline: "none",
                                padding: "0.5rem 0",
                            }}
                            autoComplete="off"
                            spellCheck={false}
                        />
                    </div>

                    {/* Buttons */}
                    <div className="flex justify-center gap-8 mt-8">
                        <button
                            onClick={onClose}
                            className="font-body text-muted hover:text-ink transition-colors"
                            style={{
                                fontSize: "var(--font-size-sm)",
                                background: "transparent",
                                border: "none",
                                cursor: "pointer",
                                letterSpacing: "0.05em",
                            }}
                        >
                            cancel
                        </button>
                        <button
                            onClick={handleSubmit}
                            className="font-body text-ink hover:text-muted transition-colors"
                            style={{
                                fontSize: "var(--font-size-sm)",
                                background: "transparent",
                                border: "none",
                                cursor: "pointer",
                                letterSpacing: "0.05em",
                            }}
                        >
                            save
                        </button>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}
