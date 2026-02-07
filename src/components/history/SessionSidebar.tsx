"use client";

import { motion, AnimatePresence } from "framer-motion";

type Session = {
    id: string;
    title: string | null;
    messages: Array<{ role: string; content: string }>;
    created_at: string;
};

interface SessionSidebarProps {
    visible: boolean;
    sessions: Session[];
    activeSessionId: string | null;
    onSelectSession: (session: Session) => void;
    onDeleteSession?: (sessionId: string) => void;
    onClose: () => void;
}

export default function SessionSidebar({
    visible,
    sessions,
    activeSessionId,
    onSelectSession,
    onDeleteSession,
    onClose,
}: SessionSidebarProps) {
    return (
        <AnimatePresence>
            {visible && (
                <>
                    {/* Mobile overlay */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="fixed inset-0 z-40 md:hidden"
                        style={{ backgroundColor: "rgba(250, 250, 250, 0.9)" }}
                        onClick={onClose}
                    />

                    {/* Sidebar */}
                    <motion.aside
                        initial={{ x: -280, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: -280, opacity: 0 }}
                        transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
                        className="fixed top-0 left-0 h-full z-50 overflow-y-auto w-full md:w-[280px]"
                        style={{
                            backgroundColor: "var(--color-paper)",
                            paddingTop: "var(--space-lg)",
                            paddingLeft: "var(--space-md)",
                            paddingRight: "var(--space-md)",
                        }}
                    >
                        {/* Close button (mobile) */}
                        <button
                            onClick={onClose}
                            className="md:hidden absolute top-6 right-6 text-muted hover:text-ink"
                            style={{
                                fontSize: "var(--font-size-xs)",
                                transitionDuration: "var(--duration-fast)",
                            }}
                        >
                            close
                        </button>

                        <h3
                            className="text-muted uppercase mb-8"
                            style={{
                                fontSize: "var(--font-size-xs)",
                                letterSpacing: "0.2em",
                            }}
                        >
                            Sessions
                        </h3>

                        {sessions.length === 0 ? (
                            <p
                                className="italic text-muted"
                                style={{ fontSize: "var(--font-size-sm)" }}
                            >
                                No saved sessions yet.
                            </p>
                        ) : (
                            <div className="space-y-4">
                                {sessions.map((session) => (
                                    <button
                                        key={session.id}
                                        onClick={() => onSelectSession(session)}
                                        className="w-full text-left py-2 transition-colors"
                                        style={{
                                            borderLeft:
                                                activeSessionId === session.id
                                                    ? "2px solid var(--color-ink)"
                                                    : "2px solid transparent",
                                            paddingLeft: "var(--space-sm)",
                                        }}
                                    >
                                        <p
                                            className="text-ink"
                                            style={{ fontSize: "var(--font-size-sm)" }}
                                        >
                                            {session.title || "Untitled"}
                                        </p>
                                        <div className="flex items-center justify-between mt-1">
                                            <p
                                                className="text-muted"
                                                style={{ fontSize: "var(--font-size-xs)" }}
                                            >
                                                {new Date(session.created_at).toLocaleDateString("en-US", {
                                                    month: "short",
                                                    day: "numeric",
                                                    year: "numeric",
                                                })}
                                            </p>
                                            {onDeleteSession && (
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        onDeleteSession(session.id);
                                                    }}
                                                    className="text-muted hover:text-ink transition-colors"
                                                    style={{
                                                        fontSize: "var(--font-size-xs)",
                                                        background: "transparent",
                                                        border: "none",
                                                        cursor: "pointer",
                                                        opacity: 0.5,
                                                        transitionDuration: "var(--duration-fast)",
                                                    }}
                                                    onMouseEnter={(e) => (e.currentTarget.style.opacity = "1")}
                                                    onMouseLeave={(e) => (e.currentTarget.style.opacity = "0.5")}
                                                >
                                                    delete
                                                </button>
                                            )}
                                        </div>
                                    </button>
                                ))}
                            </div>
                        )}

                        {/* Close button — always visible */}
                        <button
                            onClick={onClose}
                            className="text-muted hover:text-ink transition-colors mt-8 mb-6"
                            style={{
                                fontSize: "var(--font-size-xs)",
                                letterSpacing: "0.1em",
                                background: "transparent",
                                border: "none",
                                cursor: "pointer",
                                display: "block",
                            }}
                        >
                            close
                        </button>
                    </motion.aside>
                </>
            )}
        </AnimatePresence>
    );
}
