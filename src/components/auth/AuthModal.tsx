"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { SupabaseClient } from "@supabase/supabase-js";

interface AuthModalProps {
    onClose: () => void;
    supabase: SupabaseClient;
}

export default function AuthModal({ onClose, supabase }: AuthModalProps) {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [sent, setSent] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const emailRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        // Focus without scrolling the page
        setTimeout(() => emailRef.current?.focus({ preventScroll: true }), 100);
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email.trim()) return;

        setLoading(true);
        setError(null);

        try {
            // Always use the current origin for the callback to prevent environment mismatch
            // e.g. if testing on localhost, we want to come back to localhost
            const redirectUrl = `${window.location.origin}/api/auth/callback`;
            const { error: authError } = await supabase.auth.signInWithOtp({
                email: email.trim(),
                options: {
                    emailRedirectTo: redirectUrl,
                },
            });

            if (authError) {
                console.error("Magic link error:", authError);
                setError(authError.message || "Something went wrong. Try again.");
            } else {
                setSent(true);
            }
        } catch {
            setError("The page is still here. Your connection isn't. We'll wait.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
                className="fixed inset-0 z-50 flex items-center justify-center"
                style={{ backgroundColor: "rgba(250, 250, 250, 0.95)" }}
                onClick={onClose}
            >
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
                    className="w-full max-w-sm px-6"
                    onClick={(e) => e.stopPropagation()}
                >
                    {!sent ? (
                        <form onSubmit={handleSubmit} className="text-center">
                            <p
                                className="text-ink mb-8"
                                style={{ fontSize: "var(--font-size-lg)" }}
                            >
                                Your page is waiting.
                            </p>

                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="your email"
                                required
                                ref={emailRef}
                                className="w-full bg-transparent border-b border-faint text-ink font-body text-center outline-none pb-2 mb-8 placeholder:text-muted placeholder:italic"
                                style={{
                                    fontSize: "var(--font-size-base)",
                                    caretColor: "var(--color-ink)",
                                }}
                            />

                            <button
                                type="submit"
                                disabled={loading}
                                className="inline-block border border-ink text-ink font-body transition-colors hover:bg-ink hover:text-paper disabled:opacity-50"
                                style={{
                                    padding: "0.75rem 2rem",
                                    fontSize: "var(--font-size-sm)",
                                    letterSpacing: "0.1em",
                                    transitionDuration: "var(--duration-normal)",
                                }}
                            >
                                {loading ? "Sending..." : "Send magic link"}
                            </button>

                            {error && (
                                <p
                                    className="mt-6 italic text-muted animate-shake"
                                    style={{ fontSize: "var(--font-size-sm)" }}
                                >
                                    {error}
                                </p>
                            )}
                        </form>
                    ) : (
                        <div className="text-center">
                            <p
                                className="text-ink mb-4"
                                style={{ fontSize: "var(--font-size-lg)" }}
                            >
                                Check your email.
                            </p>
                            <p
                                className="italic text-muted"
                                style={{ fontSize: "var(--font-size-base)" }}
                            >
                                No password needed. Just you and the void.
                            </p>
                            <p
                                className="text-muted mt-6"
                                style={{ fontSize: "var(--font-size-xs)", opacity: 0.6 }}
                            >
                                Not there? Check your spam folder.
                            </p>
                        </div>
                    )}

                    {/* Close hint */}
                    <button
                        onClick={onClose}
                        className="block mx-auto mt-12 text-muted hover:text-ink transition-colors"
                        style={{
                            fontSize: "var(--font-size-xs)",
                            transitionDuration: "var(--duration-fast)",
                        }}
                    >
                        close
                    </button>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}
