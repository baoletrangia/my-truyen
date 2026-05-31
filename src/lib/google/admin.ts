import { env } from "@/lib/env";

export type AdminProfile = {
  email: string;
  name?: string;
  picture?: string;
};

export type AdminState = {
  accessToken: string;
  expiresAt: number;
  profile: AdminProfile;
};

const adminStorageKey = "admin-session";
const adminEvent = "admin-session-updated";

export function getAdminWhitelist() {
  return env.adminEmails
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);
}

export function isAdminEmail(email: string) {
  const whitelist = getAdminWhitelist();
  if (whitelist.length === 0) {
    return false;
  }
  return whitelist.includes(email.toLowerCase());
}

export function readAdminState(): AdminState | null {
  if (typeof window === "undefined") {
    return null;
  }
  const raw = window.localStorage.getItem(adminStorageKey);
  if (!raw) {
    return null;
  }
  try {
    const parsed = JSON.parse(raw) as AdminState;
    if (parsed.expiresAt && parsed.expiresAt > Date.now()) {
      return parsed;
    }
  } catch {
    return null;
  }
  return null;
}

export function writeAdminState(state: AdminState) {
  window.localStorage.setItem(adminStorageKey, JSON.stringify(state));
  window.dispatchEvent(new Event(adminEvent));
}

export function clearAdminState() {
  window.localStorage.removeItem(adminStorageKey);
  window.dispatchEvent(new Event(adminEvent));
}

export function subscribeAdminState(callback: () => void) {
  window.addEventListener(adminEvent, callback);
  return () => window.removeEventListener(adminEvent, callback);
}
