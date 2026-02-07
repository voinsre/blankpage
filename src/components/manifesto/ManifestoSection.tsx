"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import BreakQuote from "./BreakQuote";
import type { ManifestoChapter } from "@/lib/constants";

interface ManifestoSectionProps {
    chapter: ManifestoChapter;
}

export default function ManifestoSection({ chapter }: ManifestoSectionProps) {
    const sectionRef = useRef<HTMLElement>(null);
    const numberRef = useRef<HTMLDivElement>(null);
    const titleRef = useRef<HTMLHeadingElement>(null);
    const numberInView = useInView(numberRef, { once: true, amount: 0.3 });
    const titleInView = useInView(titleRef, { once: true, amount: 0.3 });

    return (
        <section
            ref={sectionRef}
            className="w-full px-8 md:px-12"
            style={{ paddingTop: "var(--space-section)", paddingBottom: "var(--space-lg)" }}
        >
            {/* Chapter number */}
            <motion.div
                ref={numberRef}
                initial={{ opacity: 0, y: 10 }}
                animate={numberInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 1.2, ease: [0.4, 0, 0.2, 1] }}
                className="text-center mb-4"
            >
                <span
                    className="text-ink font-bold"
                    style={{
                        fontSize: "var(--font-size-xl)",
                        lineHeight: "var(--line-height-heading)",
                    }}
                >
                    {chapter.number}
                </span>
            </motion.div>

            {/* Chapter title */}
            <motion.h2
                ref={titleRef}
                initial={{ opacity: 0, y: 10 }}
                animate={titleInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 1.2, delay: 0.2, ease: [0.4, 0, 0.2, 1] }}
                className="text-center mb-16 text-ink font-bold"
                style={{
                    fontSize: "var(--font-size-2xl)",
                    lineHeight: "var(--line-height-heading)",
                    letterSpacing: "var(--letter-spacing-heading)",
                }}
            >
                {chapter.title}
            </motion.h2>

            {/* Paragraphs */}
            <div className="max-w-prose mx-auto px-6 md:px-8">
                {chapter.paragraphs.map((paragraph, i) => {
                    const isBreakQuote = chapter.breakQuotes?.includes(i);

                    if (isBreakQuote) {
                        return <BreakQuote key={i} text={paragraph} />;
                    }

                    return <ManifestoParagraph key={i} text={paragraph} />;
                })}
            </div>
        </section>
    );
}

function ManifestoParagraph({ text }: { text: string }) {
    const ref = useRef<HTMLParagraphElement>(null);
    const isInView = useInView(ref, { once: true, amount: 0.3 });

    return (
        <motion.p
            ref={ref}
            initial={{ opacity: 0, y: 10 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1.2, ease: [0.4, 0, 0.2, 1] }}
            className="text-ink font-body mb-6"
            style={{
                fontSize: "var(--font-size-base)",
                lineHeight: "var(--line-height-body)",
            }}
        >
            {text}
        </motion.p>
    );
}
