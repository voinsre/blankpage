import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { createAdminSupabaseClient } from "@/lib/supabase";

export async function GET(request: NextRequest) {
    const requestUrl = new URL(request.url);
    const code = requestUrl.searchParams.get("code");
    const token_hash = requestUrl.searchParams.get("token_hash");
    const type = requestUrl.searchParams.get("type") as "magiclink" | "email" | null;
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:1110";

    console.log(`[AuthCallback] Processing callback. Code: ${!!code}, TokenHash: ${!!token_hash}, Type: ${type}`);

    // Create a response check container - initially redirecting to site root if all else fails
    // But we will override this for the final output
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
        console.log("[AuthCallback] Exchanging code for session...");
        const { data, error } = await supabase.auth.exchangeCodeForSession(code);
        if (error) {
            console.error("[AuthCallback] Code exchange error:", error);
        } else {
            console.log("[AuthCallback] Session established via code.");
            session = data.session;
        }
    }

    // Flow 2: Token hash verification (works cross-browser)
    if (!session && token_hash && type) {
        console.log("[AuthCallback] Verifying OTP token hash...");
        const { data, error } = await supabase.auth.verifyOtp({
            token_hash,
            type,
        });
        if (error) {
            console.error("[AuthCallback] Token hash verification error:", error);
        } else {
            console.log("[AuthCallback] Session established via token_hash.");
            session = data.session;
        }
    }

    // If neither flow produced a session, we must redirect to error page
    // We cannot proceed to Stripe or Page without a session
    if (!session) {
        console.error("[AuthCallback] No session created. Redirecting to error.");
        return NextResponse.redirect(`${siteUrl}/?error=auth_failed_no_session`);
    }

    // Session exists - check profile for payment status
    console.log(`[AuthCallback] Session User ID: ${session.user.id}`);

    // Use admin client to bypass RLS and ensure we get the profile
    const admin = createAdminSupabaseClient();
    const { data: profile, error: profileError } = await admin
        .from("profiles")
        .select("has_lifetime_access")
        .eq("id", session.user.id)
        .single();

    if (profileError) {
        console.error("[AuthCallback] Error fetching profile:", profileError);
        // Fallthrough to Stripe if we can't verify payment, just to be safe (or handle as error)
        // If profile doesn't exist, it likely means new user, so treat as unpaid
    }

    const hasAccess = profile?.has_lifetime_access === true;
    console.log(`[AuthCallback] Has Lifetime Access: ${hasAccess}`);

    // Determine destination — NEVER back to homepage for authenticated users
    let destination: string;

    if (hasAccess) {
        // Already paid → go to their page
        destination = `${siteUrl}/page`;
        console.log(`[AuthCallback] Redirecting paid user to: ${destination}`);
    } else {
        // Not paid → send directly to Stripe with email prefilled
        const paymentLink = process.env.NEXT_PUBLIC_STRIPE_PAYMENT_LINK;
        if (!paymentLink) {
            console.error("[AuthCallback] FATAL: NEXT_PUBLIC_STRIPE_PAYMENT_LINK is missing!");
            // Fallback to page, which will probably show the paywall anyway
            destination = `${siteUrl}/page`;
        } else {
            const userEmail = session.user.email || "";
            destination = `${paymentLink}?prefilled_email=${encodeURIComponent(userEmail)}`;
            // Add a client_reference_id to Stripe if needed, using user ID
            destination += `&client_reference_id=${session.user.id}`;
            console.log(`[AuthCallback] Redirecting unpaid user to Stripe: ${destination}`);
        }
    }

    // Create the final redirect response
    const finalRedirect = NextResponse.redirect(destination);

    // CRITICAL: Copy cookies from the temporary 'response' (where supabase set the session)
    // to the 'finalRedirect' response we are actually returning
    response.cookies.getAll().forEach((cookie) => {
        finalRedirect.cookies.set(cookie.name, cookie.value);
    });

    return finalRedirect;
}
