"use client";

import { useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { createBrowserSupabaseClient } from "@/lib/supabase";
import AuthModal from "@/components/auth/AuthModal";

interface PurchaseSectionProps {
    session: { user: { email: string; id: string } } | null;
    profile: { has_lifetime_access: boolean } | null;
}

export default function PurchaseSection({
    session,
    profile,
}: PurchaseSectionProps) {
    const [showAuthModal, setShowAuthModal] = useState(false);
    const sectionRef = useRef<HTMLElement>(null);
    const isInView = useInView(sectionRef, { once: true, amount: 0.3 });

    const handleGetPage = () => {
        if (!session) {
            setShowAuthModal(true);
        } else if (!profile?.has_lifetime_access) {
            const paymentLink = process.env.NEXT_PUBLIC_STRIPE_PAYMENT_LINK;
            window.location.href = `${paymentLink}?prefilled_email=${encodeURIComponent(
                session.user.email
            )}`;
        } else {
            window.location.href = "/page";
        }
    };

    return (
        <>
            <section
                ref={sectionRef}
                className="min-h-screen flex flex-col items-center justify-center px-6 md:px-8"
                style={{
                    paddingTop: "var(--space-2xl)",
                    paddingBottom: "var(--space-xl)",
                }}
            >
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 1.2, ease: [0.4, 0, 0.2, 1] }}
                    className="text-center max-w-prose mx-auto"
                >
                    {/* Pricing */}
                    <p
                        className="text-ink mb-2"
                        style={{
                            fontSize: "var(--font-size-xl)",
                            lineHeight: "var(--line-height-heading)",
                        }}
                    >
                        <span className="font-bold">$22.95/life</span> to get your page.
                    </p>
                    <p
                        className="text-ink mb-8"
                        style={{
                            fontSize: "var(--font-size-xl)",
                            lineHeight: "var(--line-height-heading)",
                        }}
                    >
                        <span className="font-bold">$2/month</span> to keep it alive.
                    </p>

                    {/* Tagline */}
                    <p
                        className="italic text-muted mb-12"
                        style={{ fontSize: "var(--font-size-base)" }}
                    >
                        The first is a decision. The second is a reminder.
                    </p>

                    {/* CTA Button */}
                    <button
                        onClick={handleGetPage}
                        className="inline-block border border-ink text-ink font-body transition-colors hover:bg-ink hover:text-paper"
                        style={{
                            padding: "1rem 3rem",
                            fontSize: "var(--font-size-base)",
                            letterSpacing: "0.1em",
                            transitionDuration: "var(--duration-normal)",
                        }}
                    >
                        Get Your Page
                    </button>

                    {/* Refund notice */}
                    <p className="mt-8 text-muted" style={{ fontSize: "var(--font-size-sm)" }}>
                        No refunds. Because some decisions should remain permanent.
                    </p>

                    {/* Footer */}
                    <div className="mt-16">
                        <a
                            href="/terms"
                            className="text-muted no-underline"
                            style={{
                                fontSize: "var(--font-size-xs)",
                                textDecoration: "underline",
                                textUnderlineOffset: "3px",
                            }}
                        >
                            Terms & Privacy
                        </a>
                    </div>
                </motion.div>
            </section>

            {/* Auth Modal */}
            {showAuthModal && (
                <AuthModal
                    onClose={() => setShowAuthModal(false)}
                    supabase={createBrowserSupabaseClient()}
                />
            )}
        </>
    );
}
