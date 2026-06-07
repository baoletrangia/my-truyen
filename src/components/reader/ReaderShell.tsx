"use client";

import { useEffect, useState, useCallback } from "react";
import { useReaderStore } from "@/stores/reader";
import ReaderControls from "@/components/reader/ReaderControls";
import ReaderNavbar from "@/components/reader/ReaderNavbar";

type ChapterItem = {
  number: number;
  title: string;
};

type ReaderShellProps = {
  children: React.ReactNode;
  novelSlug: string;
  novelTitle: string;
  currentChapter: number;
  chapters: ChapterItem[];
  previousChapter?: number;
  nextChapter?: number;
};

export default function ReaderShell({
  children,
  novelSlug,
  novelTitle,
  currentChapter,
  chapters,
  previousChapter,
  nextChapter,
}: ReaderShellProps) {
  const { settings, hydrate } = useReaderStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  useEffect(() => {
    if (!sidebarOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSidebarOpen(false);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [sidebarOpen]);

  const toggleSidebar = useCallback(() => setSidebarOpen((v) => !v), []);

  const fontFamilyMap: Record<string, string> = {
    literata: "var(--font-literata)",
    spectral: "var(--font-spectral)",
    inter: "var(--font-inter)",
  };

  const style = {
    "--reader-font": fontFamilyMap[settings.fontFamily] ?? "var(--font-literata)",
    "--reader-font-size": `${settings.fontSize}px`,
    "--reader-line-height": settings.lineHeight,
    "--reader-width": `${settings.contentWidth}px`,
  } as React.CSSProperties;

  return (
    <div className={`reader-shell theme-${settings.theme}`} style={style}>
      <ReaderNavbar
        novelSlug={novelSlug}
        novelTitle={novelTitle}
        currentChapter={currentChapter}
        chapters={chapters}
        previousChapter={previousChapter}
        nextChapter={nextChapter}
        onToggleSidebar={toggleSidebar}
      />

      {children}

      {sidebarOpen && (
        <div className="reader-backdrop" onClick={() => setSidebarOpen(false)} />
      )}

      <aside className={`reader-sidebar ${sidebarOpen ? "open" : ""}`}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "1rem 1.5rem",
            borderBottom: "1px solid var(--border)",
          }}
        >
          <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "1.2rem" }}>
            Reader Preferences
          </h2>
          <button
            type="button"
            className="chip"
            onClick={() => setSidebarOpen(false)}
            style={{ fontSize: "1.1rem", lineHeight: 1, padding: "0.25rem 0.5rem" }}
          >
            ✕
          </button>
        </div>
        <ReaderControls />
      </aside>
    </div>
  );
}
