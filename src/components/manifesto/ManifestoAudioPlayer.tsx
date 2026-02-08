"use client";

import { useState, useRef, useEffect, useCallback } from "react";

function formatTime(seconds: number): string {
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s.toString().padStart(2, "0")}`;
}

export default function ManifestoAudioPlayer() {
    const [isOpen, setIsOpen] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [isSticky, setIsSticky] = useState(false);

    const audioRef = useRef<HTMLAudioElement | null>(null);
    const playerRef = useRef<HTMLDivElement>(null);
    const sentinelRef = useRef<HTMLDivElement>(null);

    // Create audio element on mount
    useEffect(() => {
        const audio = new Audio("/ElevenLabs_THE_BLANK_PAGE_MANIFESTO.mp3");
        audio.preload = "metadata";
        audioRef.current = audio;

        const onLoadedMetadata = () => setDuration(audio.duration);
        const onTimeUpdate = () => setCurrentTime(audio.currentTime);
        const onEnded = () => {
            setIsPlaying(false);
            setIsOpen(false);
            setCurrentTime(0);
        };

        audio.addEventListener("loadedmetadata", onLoadedMetadata);
        audio.addEventListener("timeupdate", onTimeUpdate);
        audio.addEventListener("ended", onEnded);

        return () => {
            audio.removeEventListener("loadedmetadata", onLoadedMetadata);
            audio.removeEventListener("timeupdate", onTimeUpdate);
            audio.removeEventListener("ended", onEnded);
            audio.pause();
            audio.src = "";
        };
    }, []);

    // Sticky detection via IntersectionObserver
    useEffect(() => {
        if (!isOpen || !sentinelRef.current) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                // When the sentinel scrolls out of view, make player sticky
                setIsSticky(!entry.isIntersecting);
            },
            { threshold: 0 }
        );

        observer.observe(sentinelRef.current);
        return () => observer.disconnect();
    }, [isOpen]);

    const togglePlay = useCallback(() => {
        const audio = audioRef.current;
        if (!audio) return;

        if (isPlaying) {
            audio.pause();
            setIsPlaying(false);
        } else {
            audio.play();
            setIsPlaying(true);
        }
    }, [isPlaying]);

    const toggleOpen = useCallback(() => {
        if (isOpen) {
            // Close: pause audio and reset
            audioRef.current?.pause();
            setIsPlaying(false);
            setIsOpen(false);
            setIsSticky(false);
        } else {
            setIsOpen(true);
        }
    }, [isOpen]);

    const playerContent = (
        <button
            onClick={togglePlay}
            style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.75rem",
                fontSize: "0.875rem",
                color: "#8A8A8A",
                background: "none",
                border: "none",
                cursor: "pointer",
                fontFamily: "inherit",
                fontStyle: "italic",
                padding: 0,
                transition: "color 300ms",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#1A1A1A")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "#8A8A8A")}
        >
            <span>{isPlaying ? "❚❚ pause" : "▶ play"}</span>
            <span style={{ fontStyle: "normal" }}>
                {formatTime(currentTime)} / {duration > 0 ? formatTime(duration) : "—:——"}
            </span>
        </button>
    );

    return (
        <div ref={playerRef} className="text-center" style={{ marginBottom: "4rem" }}>
            {/* Sentinel element — when this scrolls off, player goes sticky */}
            <div ref={sentinelRef} style={{ height: 0 }} />

            {/* Toggle link */}
            <button
                onClick={toggleOpen}
                style={{
                    fontSize: "0.875rem",
                    color: "#8A8A8A",
                    fontStyle: "italic",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    fontFamily: "inherit",
                    padding: 0,
                    transition: "color 300ms",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#1A1A1A")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "#8A8A8A")}
            >
                {isOpen ? "close player" : "listen to the manifesto"}
            </button>

            {/* Inline player (non-sticky) */}
            {isOpen && !isSticky && (
                <div style={{ marginTop: "1rem" }}>
                    {playerContent}
                </div>
            )}

            {/* Sticky player (fixed at top when scrolled past) */}
            {isOpen && isSticky && (
                <div
                    style={{
                        position: "fixed",
                        top: 0,
                        left: 0,
                        right: 0,
                        zIndex: 30,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "1.5rem",
                        padding: "1rem 0",
                        backgroundColor: "#FAFAFA",
                        borderBottom: "1px solid #E5E5E5",
                    }}
                >
                    {playerContent}
                    <button
                        onClick={toggleOpen}
                        style={{
                            fontSize: "0.75rem",
                            color: "#BEBEBE",
                            background: "none",
                            border: "none",
                            cursor: "pointer",
                            fontFamily: "inherit",
                            padding: "0 0.5rem",
                            transition: "color 300ms",
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.color = "#1A1A1A")}
                        onMouseLeave={(e) => (e.currentTarget.style.color = "#BEBEBE")}
                    >
                        ✕
                    </button>
                </div>
            )}
        </div>
    );
}
