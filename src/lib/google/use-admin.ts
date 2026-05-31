"use client";

import { useSyncExternalStore } from "react";
import { type AdminState, readAdminState, subscribeAdminState } from "./admin";

let cached: AdminState | null | undefined;

function getSnapshot(): AdminState | null {
  if (cached === undefined) {
    cached = readAdminState();
  }
  return cached;
}

function getServerSnapshot(): null {
  return null;
}

function subscribe(callback: () => void) {
  if (typeof window === "undefined") {
    return () => {};
  }
  return subscribeAdminState(() => {
    cached = undefined;
    callback();
  });
}

export function useAdminState() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

export function useAdminAccessToken(): string | null {
  const state = useAdminState();
  return state?.accessToken ?? null;
}
