export default function TermsPage() {
    return (
        <main
            className="min-h-screen px-6 md:px-8"
            style={{
                backgroundColor: "var(--color-paper)",
                paddingTop: "var(--space-xl)",
                paddingBottom: "var(--space-xl)",
            }}
        >
            <article className="max-w-prose mx-auto">
                <h1
                    className="text-ink font-bold mb-16"
                    style={{
                        fontSize: "var(--font-size-2xl)",
                        lineHeight: "var(--line-height-heading)",
                        letterSpacing: "var(--letter-spacing-heading)",
                    }}
                >
                    Terms, Privacy & Refund Policy
                </h1>

                {/* Terms of Service */}
                <section className="mb-16">
                    <h2
                        className="text-ink font-bold mb-8"
                        style={{
                            fontSize: "var(--font-size-xl)",
                            lineHeight: "var(--line-height-heading)",
                        }}
                    >
                        Terms of Service
                    </h2>

                    <div
                        className="space-y-6 text-ink"
                        style={{
                            fontSize: "var(--font-size-base)",
                            lineHeight: "var(--line-height-body)",
                        }}
                    >
                        <p>
                            By purchasing access to Blank Page Worth, you agree to the following terms.
                        </p>
                        <p>
                            <strong>The Product.</strong> You are purchasing access to a digital blank page experience powered by AI. The AI asks questions — it does not generate content, provide advice, or serve as a substitute for professional therapy, counseling, or medical treatment.
                        </p>
                        <p>
                            <strong>Pricing.</strong> $22.95 is a one-time setup fee that grants you lifetime access to the blank page AI experience. $2/month is a recurring subscription that provides session saving and history features. The one-time fee is non-refundable.
                        </p>
                        <p>
                            <strong>Subscription.</strong> You may cancel your $2/month subscription at any time. Upon cancellation, you retain lifetime access to the AI experience but lose the ability to save new sessions. Existing saved sessions remain accessible in read-only mode.
                        </p>
                        <p>
                            <strong>Acceptable Use.</strong> Do not use this service to generate harmful, illegal, or abusive content. We reserve the right to terminate access for misuse.
                        </p>
                        <p>
                            <strong>Liability.</strong> This is not therapy. This is not a mental health service. If you are experiencing a mental health crisis, contact the 988 Suicide & Crisis Lifeline (call or text 988) or visit findahelpline.com.
                        </p>
                    </div>
                </section>

                {/* Privacy Policy */}
                <section className="mb-16">
                    <h2
                        className="text-ink font-bold mb-8"
                        style={{
                            fontSize: "var(--font-size-xl)",
                            lineHeight: "var(--line-height-heading)",
                        }}
                    >
                        Privacy Policy
                    </h2>

                    <div
                        className="space-y-6 text-ink"
                        style={{
                            fontSize: "var(--font-size-base)",
                            lineHeight: "var(--line-height-body)",
                        }}
                    >
                        <p>
                            <strong>What we collect.</strong> Your email address (for authentication) and your session data (if you choose to save sessions). We do not track you with cookies. We do not sell your data.
                        </p>
                        <p>
                            <strong>AI conversations.</strong> Your conversations with the AI are sent to Anthropic&apos;s API for processing. We do not store free session conversations. Paid user sessions are stored only if explicitly saved by you.
                        </p>
                        <p>
                            <strong>Analytics.</strong> We use privacy-respecting analytics that do not use cookies and do not track individuals. We measure aggregate page views and feature usage — nothing more.
                        </p>
                        <p>
                            <strong>Data deletion.</strong> You may request complete deletion of your data at any time by contacting us. We will delete your profile, all saved sessions, and any associated data.
                        </p>
                    </div>
                </section>

                {/* Refund Policy */}
                <section className="mb-16">
                    <h2
                        className="text-ink font-bold mb-8"
                        style={{
                            fontSize: "var(--font-size-xl)",
                            lineHeight: "var(--line-height-heading)",
                        }}
                    >
                        Refund Policy
                    </h2>

                    <div
                        className="space-y-6 text-ink"
                        style={{
                            fontSize: "var(--font-size-base)",
                            lineHeight: "var(--line-height-body)",
                        }}
                    >
                        <p>
                            No refunds. The $22.95 one-time fee is non-refundable.
                        </p>
                        <p>
                            This isn&apos;t because we&apos;re greedy. It&apos;s because the entire point of this product is that some decisions should remain permanent. A refund would undo the commitment that makes the blank page meaningful.
                        </p>
                        <p>
                            You may cancel your $2/month subscription at any time with no further charges. Subscription cancellation takes effect at the end of your current billing period.
                        </p>
                    </div>
                </section>

                {/* Footer */}
                <footer className="mt-16 pt-8 border-t border-faint">
                    <a
                        href="/"
                        className="text-muted"
                        style={{ fontSize: "var(--font-size-xs)" }}
                    >
                        ← Back to the blank page
                    </a>
                </footer>
            </article>
        </main>
    );
}
