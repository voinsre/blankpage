import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { createAdminSupabaseClient } from "@/lib/supabase";

export async function GET(request: NextRequest) {
    const requestUrl = new URL(request.url);
    const code = requestUrl.searchParams.get("code");
    const token_hash = requestUrl.searchParams.get("token_hash");
    const type = requestUrl.searchParams.get("type") as "magiclink" | "email" | null;
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:1110";

    // Create a response we can set cookies on
    const response = NextResponse.redirect(`${siteUrl}/`);

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll();
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value, options }) => {
                        response.cookies.set(name, value, options);
                    });
                },
            },
        }
    );

    let session = null;

    // Flow 1: PKCE code exchange (same browser)
    if (code) {
        const { data, error } = await supabase.auth.exchangeCodeForSession(code);
        if (error) {
            console.error("Code exchange error:", error);
        } else {
            session = data.session;
        }
    }

    // Flow 2: Token hash verification (works cross-browser)
    if (!session && token_hash && type) {
        const { data, error } = await supabase.auth.verifyOtp({
            token_hash,
            type,
        });
        if (error) {
            console.error("Token hash verification error:", error);
        } else {
            session = data.session;
        }
    }

    // If neither flow produced a session, redirect with error
    if (!session) {
        return NextResponse.redirect(`${siteUrl}/?error=auth_failed`);
    }

    // Check if user has paid
    const admin = createAdminSupabaseClient();
    const { data: profile } = await admin
        .from("profiles")
        .select("has_lifetime_access")
        .eq("id", session.user.id)
        .single();

    // Determine destination — NEVER back to homepage
    let destination: string;
    if (profile?.has_lifetime_access) {
        // Already paid → go to their page
        destination = `${siteUrl}/page`;
    } else {
        // Not paid → send directly to Stripe with email prefilled
        const paymentLink = process.env.NEXT_PUBLIC_STRIPE_PAYMENT_LINK;
        const userEmail = session.user.email || "";
        destination = `${paymentLink}?prefilled_email=${encodeURIComponent(userEmail)}`;
    }

    const finalRedirect = NextResponse.redirect(destination);
    response.cookies.getAll().forEach((cookie) => {
        finalRedirect.cookies.set(cookie.name, cookie.value);
    });

    return finalRedirect;
}
