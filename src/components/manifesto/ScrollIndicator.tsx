"use client";

import { motion } from "framer-motion";

export default function ScrollIndicator({ visible }: { visible: boolean }) {
    if (!visible) return null;

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        >
            <div className="w-px h-8 bg-faint animate-breathe" />
            <span
                className="text-faint animate-breathe select-none"
                style={{ fontSize: "var(--font-size-sm)" }}
            >
                ∨
            </span>
        </motion.div>
    );
}
