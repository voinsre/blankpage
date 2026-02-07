import Link from "next/link";

export default function NotFound() {
    return (
        <main
            className="min-h-screen flex flex-col items-end justify-end px-6 md:px-8 pb-8"
            style={{ backgroundColor: "var(--color-paper)" }}
        >
            <p
                className="text-muted mb-4"
                style={{ fontSize: "var(--font-size-xs)" }}
            >
                There&apos;s nothing here. But you already knew that.
            </p>
            <Link
                href="/"
                className="text-ink"
                style={{
                    fontSize: "var(--font-size-xs)",
                    textDecoration: "underline",
                    textUnderlineOffset: "3px",
                }}
            >
                Go to your page →
            </Link>
        </main>
    );
}
