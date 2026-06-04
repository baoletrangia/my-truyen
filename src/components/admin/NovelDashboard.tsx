"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useGoogleAccessToken } from "@/components/admin/GoogleAuthButton";
import NovelEditModal from "@/components/admin/NovelEditModal";
import type { ChapterRow, NovelRow } from "@/lib/google/sheets";
import { formatDate } from "@/lib/utils";

type NovelDashboardProps = {
  novel: NovelRow;
  chapters: ChapterRow[];
};

export default function NovelDashboard({ novel, chapters }: NovelDashboardProps) {
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentNovel, setCurrentNovel] = useState(novel);
  const router = useRouter();
  const accessToken = useGoogleAccessToken();

  return (
    <>
      <div style={{ display: "grid", gap: "2rem" }}>
        <section className="surface fade-in" style={{ padding: "2rem" }}>
          <div style={{ display: "grid", gap: "1.5rem" }}>
            <div
              style={{
                display: "flex",
                gap: "1rem",
                flexWrap: "wrap",
                alignItems: "flex-start",
                justifyContent: "space-between",
              }}
            >
              <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", alignItems: "center" }}>
                <Link href="/admin/novels" style={{ color: "var(--muted)", fontSize: "0.9rem" }}>
                  &larr; All Novels
                </Link>
                <span className="chip">{currentNovel.status}</span>
                {currentNovel.tags.map((tag) => (
                  <span className="chip" key={tag}>
                    {tag}
                  </span>
                ))}
              </div>
              <button
                type="button"
                className="button secondary"
                onClick={() => setShowEditModal(true)}
              >
                Edit Novel
              </button>
            </div>

            <div style={{ display: "flex", gap: "2rem", flexWrap: "wrap" }}>
              {currentNovel.cover ? (
                <img
                  src={currentNovel.cover}
                  alt={currentNovel.title}
                  style={{
                    width: 200,
                    borderRadius: "20px",
                    border: "1px solid var(--border)",
                    boxShadow: "0 18px 40px var(--shadow)",
                    aspectRatio: "3/4",
                    objectFit: "cover",
                  }}
                />
              ) : null}
              <div style={{ flex: 1, display: "grid", gap: "0.75rem", alignContent: "start" }}>
                <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "1.8rem" }}>
                  {currentNovel.title}
                </h2>
                <p style={{ color: "var(--muted)" }}>By {currentNovel.author}</p>
                <p style={{ color: "var(--muted)", fontSize: "0.85rem" }}>
                  Slug: {currentNovel.slug}
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="surface fade-in" style={{ padding: "2rem" }}>
          <div style={{ display: "grid", gap: "1.5rem" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                gap: "1rem",
              }}
            >
              <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "1.8rem" }}>
                Chapters ({chapters.length})
              </h2>
              <button
                type="button"
                className="button"
                onClick={() => router.push(`/admin/novels/${currentNovel.slug}/chapter/new`)}
              >
                + Add Chapter
              </button>
            </div>
            {chapters.length === 0 ? (
              <p style={{ color: "var(--muted)" }}>No chapters yet.</p>
            ) : (
              <div style={{ display: "grid", gap: "0.75rem" }}>
                {chapters.map((chapter) => (
                  <button
                    key={chapter.chapterNumber}
                    type="button"
                    className="card"
                    style={{ cursor: "pointer", textAlign: "left" }}
                    onClick={() =>
                      router.push(
                        `/admin/novels/${currentNovel.slug}/chapter/${chapter.chapterNumber}/edit`,
                      )
                    }
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        gap: "1rem",
                      }}
                    >
                      <span>
                        <strong>Chapter {chapter.chapterNumber}</strong>: {chapter.title}
                      </span>
                      <span style={{ color: "var(--muted)", fontSize: "0.9rem", whiteSpace: "nowrap" }}>
                        {formatDate(chapter.createdAt)}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </section>
      </div>

      {showEditModal && (
        <NovelEditModal
          novel={currentNovel}
          accessToken={accessToken}
          onClose={() => setShowEditModal(false)}
          onSaved={(updated) => {
            setCurrentNovel(updated);
            setShowEditModal(false);
          }}
        />
      )}
    </>
  );
}
