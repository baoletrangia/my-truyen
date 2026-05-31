"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { readAdminState, subscribeAdminState } from "@/lib/google/admin";

type AdminGateProps = {
  children: React.ReactNode;
};

export default function AdminGate({ children }: AdminGateProps) {
  const [ready, setReady] = useState(false);
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const update = () => {
      const state = readAdminState();
      setAuthorized(Boolean(state?.accessToken));
      setReady(true);
    };
    update();
    const unsubscribe = subscribeAdminState(update);
    return unsubscribe;
  }, []);

  if (!ready) {
    return null;
  }

  if (!authorized) {
    return (
      <section className="surface fade-in" style={{ padding: "2rem" }}>
        <div className="card" style={{ gap: "0.75rem" }}>
          <strong>Admin access required</strong>
          <span style={{ color: "var(--muted)" }}>
            Please sign in with an authorized Google account.
          </span>
          <Link className="button" href="/admin">
            Go to Admin Login
          </Link>
        </div>
      </section>
    );
  }

  return <>{children}</>;
}
