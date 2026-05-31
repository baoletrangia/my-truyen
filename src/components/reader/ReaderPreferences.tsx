"use client";

import { useEffect } from "react";
import { useReaderStore } from "@/stores/reader";

type ReaderPreferencesProps = {
  children: React.ReactNode;
};

export default function ReaderPreferences({ children }: ReaderPreferencesProps) {
  const { settings, hydrate } = useReaderStore();

  useEffect(() => {
    hydrate();
  }, [hydrate]);

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
    <div className={`theme-${settings.theme}`} style={style}>
      {children}
    </div>
  );
}
