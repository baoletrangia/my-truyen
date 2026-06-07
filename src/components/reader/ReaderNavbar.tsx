"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

type ChapterItem = {
  number: number;
  title: string;
};

type ReaderNavbarProps = {
  novelSlug: string;
  novelTitle: string;
  currentChapter: number;
  chapters: ChapterItem[];
  previousChapter?: number;
  nextChapter?: number;
  onToggleSidebar: () => void;
};

export default function ReaderNavbar({
  novelSlug,
  novelTitle,
  currentChapter,
  chapters,
  previousChapter,
  nextChapter,
  onToggleSidebar,
}: ReaderNavbarProps) {
  const [visible, setVisible] = useState(true);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const lastScrollY = useRef(0);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY <= 0) {
        setVisible(true);
      } else if (currentScrollY < lastScrollY.current) {
        setVisible(true);
      } else if (currentScrollY > lastScrollY.current + 10) {
        setVisible(false);
      }
      lastScrollY.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (!dropdownOpen) return;
    const handleClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [dropdownOpen]);

  const current = chapters.find((c) => c.number === currentChapter);
  const label = current ? `Ch.${current.number}: ${current.title}` : `Chapter ${currentChapter}`;

  return (
    <>
      <div className="reader-navbar-ghost" />
      <nav className={`reader-navbar ${visible ? "" : "hidden"}`}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", minWidth: 0, flex: 1 }}>
          <Link
            href={`/novel/${novelSlug}`}
            className="chip"
            style={{ flexShrink: 0 }}
          >
            {novelTitle}
          </Link>
          {previousChapter ? (
            <Link
              href={`/novel/${novelSlug}/chapter/${previousChapter}`}
              className="button secondary"
              style={{ padding: "0.35rem 0.75rem", fontSize: "0.8rem", flexShrink: 0 }}
            >
              ◀
            </Link>
          ) : null}
          {nextChapter ? (
            <Link
              href={`/novel/${novelSlug}/chapter/${nextChapter}`}
              className="button secondary"
              style={{ padding: "0.35rem 0.75rem", fontSize: "0.8rem", flexShrink: 0 }}
            >
              ▶
            </Link>
          ) : null}
        </div>

        <div style={{ position: "relative", flexShrink: 0 }} ref={dropdownRef}>
          <button
            type="button"
            className="chapter-trigger"
            onClick={() => setDropdownOpen((v) => !v)}
          >
            {label}
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" style={{ flexShrink: 0 }}>
              <path d="M3 5l3 3 3-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          {dropdownOpen && (
            <div className="chapter-dropdown">
              {chapters.map((ch) => (
                <Link
                  key={ch.number}
                  href={`/novel/${novelSlug}/chapter/${ch.number}`}
                  className={ch.number === currentChapter ? "active" : ""}
                  onClick={() => setDropdownOpen(false)}
                >
                  Ch.{ch.number}: {ch.title}
                </Link>
              ))}
            </div>
          )}
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flex: 1, justifyContent: "flex-end" }}>
          <button
            type="button"
            className="chip"
            onClick={onToggleSidebar}
            aria-label="Reader settings"
            style={{ fontSize: "1.1rem", lineHeight: 1, padding: "0.35rem 0.6rem" }}
          >
            ⚙
          </button>
        </div>
      </nav>
    </>
  );
}
