"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { createBrowserSupabaseClient } from "@/lib/supabase";
import BlankPageExperience from "@/components/page/BlankPageExperience";
import SessionSidebar from "@/components/history/SessionSidebar";
import SaveSessionModal from "@/components/history/SaveSessionModal";
import HowThisWorks from "@/components/manifesto/HowThisWorks";
import ManifestoSection from "@/components/manifesto/ManifestoSection";
import ManifestoAudioPlayer from "@/components/manifesto/ManifestoAudioPlayer";
import { MANIFESTO_CHAPTERS } from "@/lib/constants";

type Profile = {
    has_lifetime_access: boolean;
    subscription_status: string;
};

type Message = {
    role: string;
    content: string;
};

type SavedSession = {
    id: string;
    title: string | null;
    messages: Message[];
    created_at: string;
    is_saved: boolean;
};

const WELCOME_KEY = "blankpage_welcome_seen";

function hasSeenWelcome(): boolean {
    try {
        return localStorage.getItem(WELCOME_KEY) === "true";
    } catch {
        return false;
    }
}

function markWelcomeSeen(): void {
    try {
        localStorage.setItem(WELCOME_KEY, "true");
    } catch {
        // localStorage unavailable
    }
}

export default function PageApp() {
    const [loading, setLoading] = useState(true);
    const [authorized, setAuthorized] = useState(false);
    const [profile, setProfile] = useState<Profile | null>(null);
    const [showSidebar, setShowSidebar] = useState(false);
    const [savedSessions, setSavedSessions] = useState<SavedSession[]>([]);
    const [activeSession, setActiveSession] = useState<SavedSession | null>(null);
    const [userId, setUserId] = useState<string | null>(null);
    const [showSaveModal, setShowSaveModal] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    // Track current conversation messages from BlankPageExperience
    const currentMessagesRef = useRef<Message[]>([]);

    // Welcome state
    const [welcomePhase, setWelcomePhase] = useState<"checking" | "showing" | "fading" | "done">("checking");

    // Subscription management fade transition
    const [showSubscription, setShowSubscription] = useState(false);
    const subscriptionRef = useRef<HTMLDivElement>(null);

    const supabase = createBrowserSupabaseClient();

    useEffect(() => {
        const checkAccess = async () => {
            const {
                data: { session },
            } = await supabase.auth.getSession();

            if (!session) {
                window.location.href = "/";
                return;
            }

            setUserId(session.user.id);

            const { data: profileData } = await supabase
                .from("profiles")
                .select("has_lifetime_access, subscription_status")
                .eq("id", session.user.id)
                .single();

            if (!profileData?.has_lifetime_access) {
                window.location.href = "/";
                return;
            }

            setProfile(profileData);
            setAuthorized(true);
            setLoading(false);

            // Check welcome — localStorage based
            if (!hasSeenWelcome()) {
                setWelcomePhase("showing");
                markWelcomeSeen();

                // Auto-dismiss after 8 seconds
                setTimeout(() => {
                    setWelcomePhase((prev) => (prev === "showing" ? "fading" : prev));
                }, 8000);

                // Safety net: force "done" after 12s total in case animation callbacks fail
                setTimeout(() => {
                    setWelcomePhase((prev) => (prev !== "done" ? "done" : prev));
                }, 12000);
            } else {
                setWelcomePhase("done");
            }

            // Load saved sessions
            const { data: sessions } = await supabase
                .from("sessions")
                .select("*")
                .eq("user_id", session.user.id)
                .eq("is_saved", true)
                .order("created_at", { ascending: false });

            if (sessions) {
                setSavedSessions(sessions);
            }
        };

        checkAccess();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Dismiss welcome on click/tap or keypress
    useEffect(() => {
        if (welcomePhase !== "showing") return;

        const dismiss = () => setWelcomePhase("fading");

        document.addEventListener("click", dismiss);
        document.addEventListener("keydown", dismiss);

        return () => {
            document.removeEventListener("click", dismiss);
            document.removeEventListener("keydown", dismiss);
        };
    }, [welcomePhase]);

    // Track messages from BlankPageExperience
    const handleMessagesChange = useCallback((messages: Message[]) => {
        currentMessagesRef.current = messages;
    }, []);

    // Save session with actual messages
    const handleSaveSession = useCallback(
        async (title: string) => {
            setShowSaveModal(false);

            if (!userId) return;

            const messages = currentMessagesRef.current;
            if (messages.length === 0) return;

            const { data, error } = await supabase
                .from("sessions")
                .insert({
                    user_id: userId,
                    title: title || null,
                    messages: messages,
                    is_saved: true,
                })
                .select()
                .single();

            if (!error && data) {
                setSavedSessions((prev) => [data, ...prev]);
            }
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [userId]
    );

    // Subscription management — redirect to Stripe portal
    const handleManageSubscription = useCallback(async () => {
        if (!userId) return;

        try {
            const res = await fetch("/api/stripe/portal", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userId }),
            });

            const data = await res.json();

            if (data.url) {
                window.location.href = data.url;
            } else {
                console.error("Portal error:", data.error);
                setErrorMessage(data.error || "Unable to open subscription management.");
            }
        } catch (err) {
            console.error("Error opening portal:", err);
            setErrorMessage("Unable to connect. Please try again.");
        }
    }, [userId]);

    // Delete a saved session
    const handleDeleteSession = useCallback(
        async (sessionId: string) => {
            await supabase
                .from("sessions")
                .delete()
                .eq("id", sessionId);

            setSavedSessions((prev) => prev.filter((s) => s.id !== sessionId));

            // If viewing the deleted session, clear it
            if (activeSession?.id === sessionId) {
                setActiveSession(null);
            }
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [activeSession]
    );

    // Handle "reactivate" — fade to subscription section
    const handleShowSubscription = useCallback(() => {
        setShowSubscription(true);
    }, []);

    if (loading) {
        return (
            <div
                className="min-h-screen flex items-center justify-center"
                style={{ backgroundColor: "var(--color-paper)" }}
            />
        );
    }

    if (!authorized) return null;

    const isSubscriptionActive = profile?.subscription_status === "active";
    const showExperience = welcomePhase === "done";

    return (
        <main
            className="relative"
            style={{ backgroundColor: "var(--color-paper)" }}
        >
            {/* ============================================================
                WELCOME MESSAGE — first visit only
                ============================================================ */}
            <AnimatePresence
                onExitComplete={() => setWelcomePhase("done")}
            >
                {(welcomePhase === "showing" || welcomePhase === "fading") && (
                    <motion.div
                        key="welcome"
                        initial={{ opacity: 0 }}
                        animate={welcomePhase === "showing" ? { opacity: 1 } : { opacity: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{
                            duration: welcomePhase === "showing" ? 1.0 : 0.8,
                            ease: [0.4, 0, 0.2, 1],
                            delay: welcomePhase === "showing" ? 1 : 0,
                        }}
                        onAnimationComplete={() => {
                            // Backup: if we finished fading, force done
                            if (welcomePhase === "fading") {
                                setWelcomePhase("done");
                            }
                        }}
                        className="fixed inset-0 z-40 flex items-center justify-center px-8 cursor-pointer"
                        style={{ backgroundColor: "var(--color-paper)" }}
                        onClick={() => setWelcomePhase("fading")}
                    >
                        <div
                            className="text-center italic"
                            style={{
                                maxWidth: "480px",
                                color: "#8A8A8A",
                                fontSize: "1.125rem",
                                lineHeight: "1.7",
                            }}
                        >
                            <p style={{ marginBottom: "2rem", fontSize: "1.25rem" }}>
                                This is your page.
                            </p>
                            <p style={{ marginBottom: "1rem" }}>
                                Type whatever is on your mind.
                                <br />
                                The Page will ask you one question at a time.
                                <br />
                                It won&apos;t give you answers. It won&apos;t tell you what to do.
                            </p>
                            <p>
                                When you&apos;re ready, start typing.
                                <br />
                                Or don&apos;t. The page isn&apos;t going anywhere.
                            </p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ============================================================
                MAIN EXPERIENCE — shown after welcome completes
                ============================================================ */}
            {showExperience && (
                <>
                    {/* History toggle */}
                    <button
                        onClick={() => setShowSidebar(!showSidebar)}
                        className="fixed top-6 left-6 z-30 text-muted hover:text-ink transition-colors"
                        style={{
                            fontSize: "var(--font-size-xs)",
                            transitionDuration: "var(--duration-fast)",
                        }}
                    >
                        history
                    </button>

                    {/* New page */}
                    <button
                        onClick={() => {
                            setActiveSession(null);
                            window.location.reload();
                        }}
                        className="fixed bottom-6 left-6 z-30 text-muted hover:text-ink transition-colors"
                        style={{
                            fontSize: "var(--font-size-xs)",
                            transitionDuration: "var(--duration-fast)",
                        }}
                    >
                        new page
                    </button>

                    {/* Save / Subscription status */}
                    <button
                        onClick={
                            isSubscriptionActive
                                ? () => setShowSaveModal(true)
                                : handleShowSubscription
                        }
                        className="fixed bottom-6 right-6 z-30 text-muted hover:text-ink transition-colors"
                        style={{
                            fontSize: "var(--font-size-xs)",
                            transitionDuration: "var(--duration-fast)",
                        }}
                    >
                        {isSubscriptionActive ? "save this page" : "reactivate to save"}
                    </button>

                    {/* Session Sidebar */}
                    <SessionSidebar
                        visible={showSidebar}
                        sessions={savedSessions}
                        activeSessionId={activeSession?.id || null}
                        onSelectSession={(session) => {
                            setActiveSession({ ...session, is_saved: true });
                            setShowSidebar(false);
                        }}
                        onClose={() => setShowSidebar(false)}
                        onDeleteSession={handleDeleteSession}
                    />

                    {/* Save Session Modal */}
                    {showSaveModal && (
                        <SaveSessionModal
                            onSave={handleSaveSession}
                            onClose={() => setShowSaveModal(false)}
                        />
                    )}

                    {/* Error modal */}
                    <AnimatePresence>
                        {errorMessage && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
                                className="fixed inset-0 z-50 flex items-center justify-center cursor-pointer"
                                style={{
                                    backgroundColor: "rgba(250, 250, 250, 0.85)",
                                    backdropFilter: "blur(6px)",
                                    WebkitBackdropFilter: "blur(6px)",
                                }}
                                onClick={() => setErrorMessage(null)}
                                onAnimationComplete={() => {
                                    setTimeout(() => setErrorMessage(null), 4000);
                                }}
                            >
                                <motion.p
                                    initial={{ opacity: 0, y: 8 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 8 }}
                                    transition={{ duration: 0.6, delay: 0.1, ease: [0.4, 0, 0.2, 1] }}
                                    className="italic text-muted font-body text-center px-8"
                                    style={{
                                        fontSize: "var(--font-size-base)",
                                        maxWidth: "400px",
                                        lineHeight: "1.8",
                                    }}
                                >
                                    {errorMessage}
                                </motion.p>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Main experience — scrollable */}
                    <AnimatePresence mode="wait">
                        {!showSubscription ? (
                            <motion.div
                                key="page-experience"
                                exit={{ opacity: 0 }}
                                transition={{ duration: 1.2, ease: [0.4, 0, 0.2, 1] }}
                            >
                                {/* ─── Blank page experience (only after welcome is done or skipped) ─── */}
                                {welcomePhase === "done" && (
                                    <>
                                        {activeSession ? (
                                            <div className="min-h-screen flex flex-col items-center justify-center px-6 md:px-8">
                                                <div className="w-full max-w-prose mx-auto space-y-8">
                                                    {activeSession.messages.map(
                                                        (msg: Message, i: number) => (
                                                            <div key={i}>
                                                                {msg.role === "user" ? (
                                                                    <p
                                                                        className="text-ink font-body"
                                                                        style={{
                                                                            fontSize: "var(--font-size-lg)",
                                                                            lineHeight: "var(--line-height-body)",
                                                                        }}
                                                                    >
                                                                        {msg.content}
                                                                    </p>
                                                                ) : (
                                                                    <p
                                                                        className="italic text-muted font-body"
                                                                        style={{
                                                                            fontSize: "var(--font-size-base)",
                                                                            lineHeight: "var(--line-height-body)",
                                                                        }}
                                                                    >
                                                                        {msg.content}
                                                                    </p>
                                                                )}
                                                            </div>
                                                        )
                                                    )}
                                                </div>
                                            </div>
                                        ) : (
                                            <BlankPageExperience
                                                mode="paid"
                                                onMessagesChange={handleMessagesChange}
                                            />
                                        )}
                                    </>
                                )}


                                {/* How This Works */}
                                <HowThisWorks />

                                {/* Manifesto */}
                                <article>
                                    <ManifestoAudioPlayer />
                                    {MANIFESTO_CHAPTERS.map((chapter, i) => (
                                        <ManifestoSection key={i} chapter={chapter} />
                                    ))}
                                </article>

                                {/* Subscription management section — below the manifesto */}
                                <section
                                    ref={subscriptionRef}
                                    className="flex flex-col items-center justify-center px-6 md:px-8 text-center"
                                    style={{
                                        paddingTop: "var(--space-2xl)",
                                        paddingBottom: "var(--space-2xl)",
                                        minHeight: "60vh",
                                    }}
                                >
                                    {isSubscriptionActive ? (
                                        <>
                                            <p
                                                className="text-ink mb-2"
                                                style={{
                                                    fontSize: "var(--font-size-lg)",
                                                    lineHeight: "var(--line-height-heading)",
                                                }}
                                            >
                                                Your page is alive.
                                            </p>
                                            <p
                                                className="italic text-muted mb-12"
                                                style={{ fontSize: "var(--font-size-base)" }}
                                            >
                                                $2/month keeps your pages and history safe.
                                            </p>
                                            <button
                                                onClick={handleManageSubscription}
                                                className="text-muted hover:text-ink transition-colors font-body"
                                                style={{
                                                    fontSize: "var(--font-size-sm)",
                                                    background: "transparent",
                                                    border: "none",
                                                    cursor: "pointer",
                                                    textDecoration: "underline",
                                                    textUnderlineOffset: "3px",
                                                    letterSpacing: "0.05em",
                                                }}
                                            >
                                                manage subscription
                                            </button>
                                        </>
                                    ) : (
                                        <>
                                            <p
                                                className="text-ink mb-2"
                                                style={{
                                                    fontSize: "var(--font-size-lg)",
                                                    lineHeight: "var(--line-height-heading)",
                                                }}
                                            >
                                                Your pages are paused.
                                            </p>
                                            <p
                                                className="italic text-muted mb-12"
                                                style={{ fontSize: "var(--font-size-base)" }}
                                            >
                                                $2/month to save your sessions and keep your history.
                                            </p>
                                            <button
                                                onClick={handleManageSubscription}
                                                className="inline-block border border-ink text-ink font-body transition-colors hover:bg-ink hover:text-paper"
                                                style={{
                                                    padding: "1rem 3rem",
                                                    fontSize: "var(--font-size-base)",
                                                    letterSpacing: "0.1em",
                                                    transitionDuration: "var(--duration-normal)",
                                                }}
                                            >
                                                reactivate
                                            </button>
                                        </>
                                    )}
                                </section>

                                {/* Branding */}
                                <div
                                    className="text-center"
                                    style={{
                                        paddingTop: "var(--space-xl)",
                                        paddingBottom: "var(--space-xl)",
                                    }}
                                >
                                    <p
                                        className="text-muted uppercase"
                                        style={{
                                            fontSize: "var(--font-size-sm)",
                                            letterSpacing: "0.2em",
                                        }}
                                    >
                                        BLANK PAGE
                                    </p>
                                    <p
                                        className="text-muted mt-2"
                                        style={{
                                            fontSize: "var(--font-size-sm)",
                                            letterSpacing: "0.2em",
                                        }}
                                    >
                                        blankpageworth.com
                                    </p>
                                </div>
                            </motion.div>
                        ) : (
                            /* Subscription management fade-in (when "reactivate to save" is clicked) */
                            <motion.div
                                key="subscription-inline"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 1.2, ease: [0.4, 0, 0.2, 1] }}
                                className="min-h-screen flex flex-col items-center justify-center px-6 md:px-8 text-center"
                                style={{ backgroundColor: "var(--color-paper)" }}
                            >
                                <p
                                    className="text-ink mb-2"
                                    style={{
                                        fontSize: "var(--font-size-xl)",
                                        lineHeight: "var(--line-height-heading)",
                                    }}
                                >
                                    Keep your pages alive.
                                </p>
                                <p
                                    className="italic text-muted mb-4"
                                    style={{ fontSize: "var(--font-size-base)" }}
                                >
                                    $2/month to save your sessions and keep your history safe.
                                </p>
                                <p
                                    className="text-muted mb-12"
                                    style={{ fontSize: "var(--font-size-sm)" }}
                                >
                                    Cancel anytime. Your past sessions stay yours.
                                </p>
                                <button
                                    onClick={handleManageSubscription}
                                    className="inline-block border border-ink text-ink font-body transition-colors hover:bg-ink hover:text-paper"
                                    style={{
                                        padding: "1rem 3rem",
                                        fontSize: "var(--font-size-base)",
                                        letterSpacing: "0.1em",
                                        transitionDuration: "var(--duration-normal)",
                                    }}
                                >
                                    Reactivate Subscription
                                </button>
                                <button
                                    onClick={() => setShowSubscription(false)}
                                    className="mt-8 text-muted hover:text-ink transition-colors font-body"
                                    style={{
                                        fontSize: "var(--font-size-sm)",
                                        background: "transparent",
                                        border: "none",
                                        cursor: "pointer",
                                    }}
                                >
                                    back to page
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </>
            )}
        </main>
    );
}
