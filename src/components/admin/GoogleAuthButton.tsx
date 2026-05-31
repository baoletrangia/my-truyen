"use client";

import { clearAdminState } from "@/lib/google/admin";
import { useAdminState } from "@/lib/google/use-admin";

export default function GoogleAuthButton() {
  const state = useAdminState();

  const logout = () => {
    clearAdminState();
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
      {state ? (
        <button type="button" className="button secondary" onClick={logout}>
          Disconnect Google
        </button>
      ) : (
        <a className="button" href="/admin">
          Go to Admin Login
        </a>
      )}
    </div>
  );
}

export { useAdminAccessToken as useGoogleAccessToken } from "@/lib/google/use-admin";
