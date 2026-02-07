"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

const PARAGRAPHS = [
    {
        text: "You type. The Page listens. Then it asks you one question.",
        type: "normal" as const,
    },
    {
        text: "Not the question you want to hear. The question you've been avoiding.",
        type: "break" as const,
    },
    {
        text: "It won't give you advice. It won't write for you. It won't tell you what to do. It will sit with you in the silence and ask the one thing that cuts through the noise.",
        type: "normal" as const,
    },
    {
        text: "There are no rules. Write a sentence. Write a paragraph. Write one word. Or write nothing and stare at the blank page until it stares back.",
        type: "normal" as const,
    },
    {
        text: "Your first five minutes are free. After that, the page is $22.95 — and it's yours to come back to whenever the voices in your head get too loud.",
        type: "normal" as const,
    },
];

function HowParagraph({ text }: { text: string }) {
    const ref = useRef<HTMLParagraphElement>(null);
    const isInView = useInView(ref, { once: true, amount: 0.3 });

    return (
        <motion.p
            ref={ref}
            initial={{ opacity: 0, y: 10 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1.2, ease: [0.4, 0, 0.2, 1] }}
            style={{
                fontSize: "1.125rem",
                lineHeight: "1.7",
                color: "#1A1A1A",
                marginBottom: "1.25rem",
            }}
        >
            {text}
        </motion.p>
    );
}

function HowBreakQuote({ text }: { text: string }) {
    const ref = useRef<HTMLParagraphElement>(null);
    const isInView = useInView(ref, { once: true, amount: 0.3 });

    return (
        <motion.p
            ref={ref}
            initial={{ opacity: 0, y: 10 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1.2, ease: [0.4, 0, 0.2, 1] }}
            className="text-ink font-body text-center"
            style={{
                fontSize: "var(--font-size-xl)",
                lineHeight: "var(--line-height-heading)",
                paddingTop: "var(--space-xl)",
                paddingBottom: "var(--space-xl)",
            }}
        >
            {text}
        </motion.p>
    );
}

export default function HowThisWorks() {
    const titleRef = useRef<HTMLHeadingElement>(null);
    const titleInView = useInView(titleRef, { once: true, amount: 0.3 });

    return (
        <section
            style={{
                paddingTop: "8rem",
                paddingBottom: "8rem",
            }}
            className="px-8 md:px-12"
        >
            {/* Section title */}
            <motion.h2
                ref={titleRef}
                initial={{ opacity: 0, y: 10 }}
                animate={titleInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 1.2, ease: [0.4, 0, 0.2, 1] }}
                className="text-center font-bold uppercase"
                style={{
                    fontSize: "clamp(1.5rem, 3vw, 2rem)",
                    color: "#1A1A1A",
                    letterSpacing: "0.05em",
                    marginBottom: "4rem",
                }}
            >
                HOW THIS WORKS
            </motion.h2>

            {/* Paragraphs */}
            <div style={{ maxWidth: "640px", margin: "0 auto" }}>
                {PARAGRAPHS.map((p, i) =>
                    p.type === "break" ? (
                        <HowBreakQuote key={i} text={p.text} />
                    ) : (
                        <HowParagraph key={i} text={p.text} />
                    )
                )}
            </div>
        </section>
    );
}
