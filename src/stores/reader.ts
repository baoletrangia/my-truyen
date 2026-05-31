import { create } from "zustand";

export type ReaderTheme = "paper" | "sepia" | "midnight";

export type ReaderSettings = {
  fontFamily: "literata" | "spectral" | "inter";
  fontSize: number;
  lineHeight: number;
  contentWidth: number;
  theme: ReaderTheme;
};

type ReaderStore = {
  settings: ReaderSettings;
  setSettings: (settings: Partial<ReaderSettings>) => void;
  hydrate: () => void;
};

const defaultSettings: ReaderSettings = {
  fontFamily: "literata",
  fontSize: 18,
  lineHeight: 1.8,
  contentWidth: 720,
  theme: "paper",
};

const storageKey = "reader-settings";

export const useReaderStore = create<ReaderStore>((set) => ({
  settings: defaultSettings,
  setSettings: (settings) =>
    set((state) => {
      const next = { ...state.settings, ...settings };
      if (typeof window !== "undefined") {
        window.localStorage.setItem(storageKey, JSON.stringify(next));
      }
      return { settings: next };
    }),
  hydrate: () => {
    if (typeof window === "undefined") {
      return;
    }
    const stored = window.localStorage.getItem(storageKey);
    if (!stored) {
      return;
    }
    try {
      const parsed = JSON.parse(stored) as ReaderSettings;
      set({ settings: { ...defaultSettings, ...parsed } });
    } catch {
      set({ settings: defaultSettings });
    }
  },
}));
