"use client";

import { useEffect, useState, useRef } from "react";
import { SESSION_CONFIG } from "@/lib/constants";

interface ProgressBarProps {
    isActive: boolean;
    onComplete: () => void;
}

export default function ProgressBar({ isActive, onComplete }: ProgressBarProps) {
    const [progress, setProgress] = useState(0);
    const startTimeRef = useRef<number | null>(null);

    useEffect(() => {
        if (!isActive) return;

        // Record start time when timer becomes active
        if (!startTimeRef.current) {
            startTimeRef.current = Date.now();
        }

        const interval = setInterval(() => {
            const elapsed = Date.now() - (startTimeRef.current || Date.now());
            const newProgress = Math.min(
                (elapsed / SESSION_CONFIG.FREE_SESSION_DURATION) * 100,
                100
            );
            setProgress(newProgress);

            if (newProgress >= 100) {
                clearInterval(interval);
                onComplete();
            }
        }, 100);

        return () => clearInterval(interval);
    }, [isActive, onComplete]);

    // Always render the bar container — shows as empty track before timer starts
    return (
        <div
            className="fixed top-0 left-0 w-full z-50"
            style={{ height: "3px", backgroundColor: "rgba(0,0,0,0.06)" }}
            role="progressbar"
            aria-valuenow={Math.round(progress)}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="Session time remaining"
        >
            <div
                style={{
                    height: "100%",
                    width: `${progress}%`,
                    backgroundColor: "var(--color-ink)",
                    opacity: 0.4,
                    transition: "width 100ms linear",
                }}
            />
        </div>
    );
}
