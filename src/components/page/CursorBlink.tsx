"use client";

export default function CursorBlink() {
    return (
        <span
            className="cursor-blink inline-block text-ink"
            style={{ fontSize: "var(--font-size-lg)" }}
            aria-hidden="true"
        >
            |
        </span>
    );
}
