"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Session, AuthChangeEvent } from "@supabase/supabase-js";
import { motion, AnimatePresence } from "framer-motion";
import { createBrowserSupabaseClient } from "@/lib/supabase";
import BlankPageExperience from "@/components/page/BlankPageExperience";
import ManifestoSection from "@/components/manifesto/ManifestoSection";
import HowThisWorks from "@/components/manifesto/HowThisWorks";
import PurchaseSection from "@/components/purchase/PurchaseSection";
import { MANIFESTO_CHAPTERS } from "@/lib/constants";

type UserSession = {
  user: { email: string; id: string };
} | null;

type Profile = {
  has_lifetime_access: boolean;
  subscription_status: string;
} | null;

export default function HomePage() {
  const [session, setSession] = useState<UserSession>(null);
  const [profile, setProfile] = useState<Profile>(null);
  const [showPurchase, setShowPurchase] = useState(false);
  const purchaseRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const supabase = createBrowserSupabaseClient();

    // Get initial session
    supabase.auth.getSession().then(({ data: { session: s } }: { data: { session: Session | null } }) => {
      if (s) {
        setSession({ user: { email: s.user.email || "", id: s.user.id } });
        // Fetch profile
        supabase
          .from("profiles")
          .select("has_lifetime_access, subscription_status")
          .eq("id", s.user.id)
          .single()
          .then(({ data }: { data: Profile | null }) => {
            if (data) setProfile(data);
          });
      }
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event: AuthChangeEvent, s: Session | null) => {
      if (s) {
        setSession({ user: { email: s.user.email || "", id: s.user.id } });
      } else {
        setSession(null);
        setProfile(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // Smooth fade transition from conversation to purchase
  const handleGetPage = useCallback(() => {
    setShowPurchase(true);
  }, []);

  return (
    <main>
      {/* ACT 1: The Page — blank page AI experience */}
      <AnimatePresence mode="wait">
        {!showPurchase ? (
          <motion.div
            key="experience"
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2, ease: [0.4, 0, 0.2, 1] }}
          >
            <BlankPageExperience
              mode="free"
              onSessionEnd={() => { }}
              onScroll={handleGetPage}
            />
          </motion.div>
        ) : (
          <motion.div
            key="purchase-inline"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.2, ease: [0.4, 0, 0.2, 1] }}
            className="min-h-screen flex items-center justify-center"
            style={{ backgroundColor: "var(--color-paper)" }}
          >
            <PurchaseSection session={session} profile={profile} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* How This Works */}
      <HowThisWorks />

      {/* ACT 2: The Manifesto */}
      <article>
        {MANIFESTO_CHAPTERS.map((chapter, i) => (
          <ManifestoSection key={i} chapter={chapter} />
        ))}
      </article>

      {/* ACT 3: The Purchase */}
      <div ref={purchaseRef}>
        <PurchaseSection session={session} profile={profile} />
      </div>

      {/* Branding */}
      <div
        className="text-center"
        style={{
          paddingTop: "var(--space-xl)",
          paddingBottom: "var(--space-xl)",
        }}
      >
        <p
          className="text-muted uppercase"
          style={{
            fontSize: "var(--font-size-sm)",
            letterSpacing: "0.2em",
          }}
        >
          BLANK PAGE
        </p>
        <p
          className="text-muted mt-2"
          style={{
            fontSize: "var(--font-size-sm)",
            letterSpacing: "0.2em",
          }}
        >
          blankpageworth.com
        </p>
      </div>

    </main>
  );
}
