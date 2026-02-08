import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
    const { pathname, searchParams } = request.nextUrl;

    // If Supabase redirects to the root with an auth code,
    // forward it to the actual auth callback handler
    if (pathname === "/" && searchParams.has("code")) {
        const code = searchParams.get("code");
        const callbackUrl = new URL("/api/auth/callback", request.url);
        callbackUrl.searchParams.set("code", code!);

        // Preserve any other params Supabase might add
        searchParams.forEach((value, key) => {
            if (key !== "code") {
                callbackUrl.searchParams.set(key, value);
            }
        });

        console.log(`[Middleware] Forwarding auth code to callback: ${callbackUrl.pathname}`);
        return NextResponse.redirect(callbackUrl);
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/"],
};
