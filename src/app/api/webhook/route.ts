import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { createAdminSupabaseClient } from "@/lib/supabase";
import Stripe from "stripe";

export async function POST(request: NextRequest) {
    const body = await request.text();
    const signature = request.headers.get("stripe-signature");

    if (!signature) {
        return NextResponse.json({ error: "Missing signature" }, { status: 400 });
    }

    let event: Stripe.Event;

    try {
        event = stripe.webhooks.constructEvent(
            body,
            signature,
            process.env.STRIPE_WEBHOOK_SECRET!
        );
    } catch (err) {
        console.error("Webhook signature verification failed:", err);
        return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    const admin = createAdminSupabaseClient();

    try {
        switch (event.type) {
            // ─── One-time purchase completed ─────────────────────────────
            case "checkout.session.completed": {
                const session = event.data.object as Stripe.Checkout.Session;
                const customerEmail = session.customer_email || session.customer_details?.email;
                const customerId = session.customer as string;

                if (!customerEmail) {
                    console.error("No email in checkout session");
                    break;
                }

                // Find user by email and grant lifetime access
                const { data: profile, error: profileError } = await admin
                    .from("profiles")
                    .select("id")
                    .eq("email", customerEmail)
                    .single();

                if (profileError || !profile) {
                    console.error("Profile not found for email:", customerEmail, profileError);
                    break;
                }

                await admin
                    .from("profiles")
                    .update({
                        has_lifetime_access: true,
                        stripe_customer_id: customerId,
                    })
                    .eq("id", profile.id);

                console.log(`✅ Granted lifetime access to ${customerEmail}`);
                break;
            }

            // ─── Subscription updated ────────────────────────────────
            case "customer.subscription.updated": {
                const subscription = event.data.object as Stripe.Subscription;
                const customerId = subscription.customer as string;
                const status = subscription.status;

                let subscriptionStatus = "none";
                if (status === "active" || status === "trialing") {
                    subscriptionStatus = "active";
                } else if (status === "canceled" || status === "unpaid") {
                    subscriptionStatus = "cancelled";
                } else if (status === "past_due") {
                    subscriptionStatus = "active";
                }

                await admin
                    .from("profiles")
                    .update({
                        subscription_status: subscriptionStatus,
                        stripe_subscription_id: subscription.id,
                        stripe_customer_id: customerId,
                    })
                    .eq("stripe_customer_id", customerId);

                console.log(`✅ Subscription ${status} for customer ${customerId}`);
                break;
            }

            // ─── Subscription deleted ────────────────────────────────────
            case "customer.subscription.deleted": {
                const subscription = event.data.object as Stripe.Subscription;
                const customerId = subscription.customer as string;

                await admin
                    .from("profiles")
                    .update({
                        subscription_status: "cancelled",
                        stripe_subscription_id: null,
                    })
                    .eq("stripe_customer_id", customerId);

                console.log(`✅ Subscription cancelled for customer ${customerId}`);
                break;
            }

            // ─── Invoice payment failed ──────────────────────────────────
            case "invoice.payment_failed": {
                const invoice = event.data.object as Stripe.Invoice;
                const customerId = invoice.customer as string;

                // Mark as past_due but don't revoke access yet
                await admin
                    .from("profiles")
                    .update({
                        subscription_status: "active", // keep access, Stripe will retry
                    })
                    .eq("stripe_customer_id", customerId);

                console.log(`⚠️ Payment failed for customer ${customerId}, keeping access`);
                break;
            }

            default:
                break;
        }
    } catch (err) {
        console.error("Error processing webhook:", err);
        return NextResponse.json({ error: "Webhook handler failed" }, { status: 500 });
    }

    return NextResponse.json({ received: true });
}
