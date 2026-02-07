"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

interface BreakQuoteProps {
    text: string;
}

export default function BreakQuote({ text }: BreakQuoteProps) {
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
