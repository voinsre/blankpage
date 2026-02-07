import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { createAdminSupabaseClient } from "@/lib/supabase";

export async function POST(request: NextRequest) {
    try {
        const { userId } = await request.json();

        if (!userId) {
            return NextResponse.json({ error: "Missing userId" }, { status: 400 });
        }

        // Look up the Stripe customer ID from the profile
        const admin = createAdminSupabaseClient();
        const { data: profile } = await admin
            .from("profiles")
            .select("stripe_customer_id, email")
            .eq("id", userId)
            .single();

        if (!profile) {
            return NextResponse.json(
                { error: "Profile not found" },
                { status: 404 }
            );
        }

        let customerId = profile.stripe_customer_id;

        // If no stripe_customer_id stored, try to find by email
        if (!customerId && profile.email) {
            const customers = await stripe.customers.list({
                email: profile.email,
                limit: 1,
            });

            if (customers.data.length > 0) {
                customerId = customers.data[0].id;
                // Save it for next time
                await admin
                    .from("profiles")
                    .update({ stripe_customer_id: customerId })
                    .eq("id", userId);
            }
        }

        if (!customerId) {
            return NextResponse.json(
                { error: "No Stripe customer found for this account." },
                { status: 400 }
            );
        }

        const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:1110";

        // Create a Stripe Customer Portal session
        const portalSession = await stripe.billingPortal.sessions.create({
            customer: customerId,
            return_url: `${siteUrl}/page`,
        });

        return NextResponse.json({ url: portalSession.url });
    } catch (err) {
        console.error("Error creating portal session:", err);
        return NextResponse.json(
            { error: "Failed to create portal session" },
            { status: 500 }
        );
    }
}
