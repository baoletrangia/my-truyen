"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { env } from "@/lib/env";
import { generateCodeChallenge, generateCodeVerifier } from "@/lib/google/oauth";
import {
  clearAdminState,
  getAdminWhitelist,
  isAdminEmail,
  readAdminState,
  type AdminProfile,
  writeAdminState,
} from "@/lib/google/admin";

type LoginState = {
  error: string | null;
  loading: boolean;
  profile: AdminProfile | null;
};

export default function AdminLogin() {
  const [state, setState] = useState<LoginState>(() => {
    const existing = readAdminState();
    if (existing) {
      return { error: null, loading: false, profile: existing.profile };
    }
    return { error: null, loading: false, profile: null };
  });

  const redirectUri = useMemo(() => {
    if (typeof window === "undefined") {
      return "";
    }
    return `${window.location.origin}/admin`;
  }, []);

  const beginLogin = useCallback(async () => {
    if (!env.googleClientId || !redirectUri) {
      setState((prev) => ({
        ...prev,
        error: "Missing Google client ID or redirect URL",
      }));
      return;
    }
    if (getAdminWhitelist().length === 0) {
      setState((prev) => ({
        ...prev,
        error: "No admin emails configured.",
      }));
      return;
    }
    setState((prev) => ({ ...prev, loading: true, error: null }));
    const codeVerifier = generateCodeVerifier();
    const codeChallenge = await generateCodeChallenge(codeVerifier);
    window.localStorage.setItem("pkce_verifier", codeVerifier);
    const authUrl = new URL("https://accounts.google.com/o/oauth2/v2/auth");
    authUrl.searchParams.set("client_id", env.googleClientId);
    authUrl.searchParams.set("redirect_uri", redirectUri);
    authUrl.searchParams.set("response_type", "code");
    authUrl.searchParams.set(
      "scope",
      [
        "https://www.googleapis.com/auth/spreadsheets",
        "openid",
        "email",
        "profile",
      ].join(" "),
    );
    authUrl.searchParams.set("code_challenge", codeChallenge);
    authUrl.searchParams.set("code_challenge_method", "S256");
    authUrl.searchParams.set("access_type", "online");
    authUrl.searchParams.set("prompt", "consent");
    window.location.href = authUrl.toString();
  }, [redirectUri]);

  const handleExchange = useCallback(async () => {
    if (typeof window === "undefined") {
      return;
    }
    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");
    if (!code) {
      return;
    }
    const verifier = window.localStorage.getItem("pkce_verifier");
    if (!verifier) {
      setState((prev) => ({ ...prev, error: "Missing verifier" }));
      return;
    }
    setState((prev) => ({ ...prev, loading: true, error: null }));
    const response = await fetch("/api/auth/google", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        code,
        redirectUri,
        codeVerifier: verifier,
      }),
    });
    const data = (await response.json()) as {
      accessToken?: string;
      expiresIn?: number;
      error?: string;
    };
    if (!response.ok || !data.accessToken) {
      setState((prev) => ({
        ...prev,
        loading: false,
        error: data.error ?? "Auth failed",
      }));
      return;
    }
    const profileResponse = await fetch(
      "https://www.googleapis.com/oauth2/v3/userinfo",
      {
        headers: { Authorization: `Bearer ${data.accessToken}` },
      },
    );
    if (!profileResponse.ok) {
      setState((prev) => ({
        ...prev,
        loading: false,
        error: "Failed to load profile",
      }));
      return;
    }
    const profile = (await profileResponse.json()) as AdminProfile;
    if (!profile.email || !isAdminEmail(profile.email)) {
      clearAdminState();
      setState((prev) => ({
        ...prev,
        loading: false,
        profile,
        error: "This account is not authorized.",
      }));
      return;
    }
    const expiresAt = Date.now() + (data.expiresIn ?? 3600) * 1000;
    writeAdminState({
      accessToken: data.accessToken,
      expiresAt,
      profile,
    });
    window.history.replaceState({}, "", redirectUri);
    window.location.href = "/admin/editor";
  }, [redirectUri]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    handleExchange();
  }, [handleExchange]);

  const logout = () => {
    clearAdminState();
    setState({ error: null, loading: false, profile: null });
  };

  return (
    <section className="surface fade-in" style={{ padding: "2.5rem" }}>
      <div style={{ display: "grid", gap: "1rem" }}>
        <span className="chip">Admin Access</span>
        <h1 style={{ fontFamily: "var(--font-serif)", fontSize: "2.6rem" }}>
          Sign in to manage content
        </h1>
        <p style={{ color: "var(--muted)" }}>
          Only whitelisted admins can access the editor.
        </p>
        <div style={{ color: "var(--muted)", fontSize: "0.9rem" }}>
          Allowed: {getAdminWhitelist().join(", ") || "No admins configured"}
        </div>
        {state.profile ? (
          <div className="card" style={{ gap: "0.5rem" }}>
            <strong>{state.profile.name ?? state.profile.email}</strong>
            <span style={{ color: "var(--muted)" }}>{state.profile.email}</span>
            <button type="button" className="button secondary" onClick={logout}>
              Sign out
            </button>
          </div>
        ) : (
          <button
            type="button"
            className="button"
            onClick={beginLogin}
            disabled={state.loading}
          >
            {state.loading ? "Connecting..." : "Sign in with Google"}
          </button>
        )}
        {state.error ? (
          <div className="card" style={{ color: "var(--accent-strong)" }}>
            {state.error}
          </div>
        ) : null}
      </div>
    </section>
  );
}
