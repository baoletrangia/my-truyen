"use client";

import Link from "next/link";
import type { ChapterRow, NovelRow } from "@/lib/google/sheets";
import { stripHtml, truncateText } from "@/lib/utils";

type NovelListProps = {
  novels: NovelRow[];
  chapters: ChapterRow[];
};

export default function NovelList({ novels, chapters }: NovelListProps) {
  return (
    <div style={{ display: "grid", gap: "2rem" }}>
      <Link href="/admin/novels/new" className="button" style={{ justifySelf: "start" }}>
        + Create Novel
      </Link>

      {novels.length === 0 ? (
        <section className="surface fade-in" style={{ padding: "2rem" }}>
          <p style={{ color: "var(--muted)" }}>No novels yet. Create one to get started.</p>
        </section>
      ) : (
        <div style={{ display: "grid", gap: "1rem" }}>
          {novels.map((novel) => {
            const chapterCount = chapters.filter((c) => c.novelSlug === novel.slug).length;
            return (
              <Link
                key={novel.slug}
                href={`/admin/novels/${novel.slug}`}
                className="card fade-in"
                style={{
                  display: "grid",
                  gridTemplateColumns: "80px 1fr",
                  gap: "1.5rem",
                  cursor: "pointer",
                  transition: "box-shadow 0.2s ease",
                }}
              >
                {novel.cover ? (
                  <img
                    src={novel.cover}
                    alt={novel.title}
                    style={{
                      width: 80,
                      height: 107,
                      borderRadius: "12px",
                      objectFit: "cover",
                      border: "1px solid var(--border)",
                    }}
                  />
                ) : (
                  <div
                    style={{
                      width: 80,
                      height: 107,
                      borderRadius: "12px",
                      background: "var(--border)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "var(--muted)",
                      fontSize: "0.8rem",
                    }}
                  >
                    No cover
                  </div>
                )}
                <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                  <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", alignItems: "center" }}>
                    <span className="chip">{novel.status}</span>
                    <span style={{ color: "var(--muted)", fontSize: "0.85rem" }}>
                      {chapterCount} chapter{chapterCount !== 1 ? "s" : ""}
                    </span>
                  </div>
                  <h3 style={{ fontFamily: "var(--font-serif)", fontSize: "1.3rem", margin: 0 }}>
                    {novel.title}
                  </h3>
                  <p style={{ color: "var(--muted)", fontSize: "0.9rem", margin: 0 }}>
                    {novel.author}
                  </p>
                  <p style={{ color: "var(--muted)", fontSize: "0.85rem", margin: 0 }}>
                    {truncateText(stripHtml(novel.summary), 120)}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
