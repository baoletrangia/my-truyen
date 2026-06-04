"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import EditorToolbar from "@/components/admin/EditorToolbar";
import { useGoogleAccessToken } from "@/components/admin/GoogleAuthButton";
import { appendSheetValues } from "@/lib/google/client";
import { env } from "@/lib/env";

type ChapterNewFormProps = {
  novelSlug: string;
};

export default function ChapterNewForm({ novelSlug }: ChapterNewFormProps) {
  const accessToken = useGoogleAccessToken();
  const [chapterNumber, setChapterNumber] = useState(1);
  const [title, setTitle] = useState("");
  const [createdAt, setCreatedAt] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const editor = useEditor({
    extensions: [
      StarterKit.configure({ heading: { levels: [2, 3, 4] } }),
      Underline,
      Link.configure({ openOnClick: false }),
    ],
    content: "",
    editorProps: {
      attributes: {
        class: "reader",
        style: "min-height: 220px;",
      },
    },
  });

  const handleCreate = async () => {
    if (!accessToken) {
      setError("Connect Google Sheets first.");
      return;
    }
    if (!title || !chapterNumber) {
      setError("Chapter number and title are required.");
      return;
    }
    setSaving(true);
    setError(null);
    try {
      const content = editor?.getHTML() ?? "";
      const values = [[novelSlug, chapterNumber.toString(), title, content, createdAt]];
      await appendSheetValues(accessToken, env.sheetsId, {
        range: `${env.chaptersSheet}!A:E`,
        values,
      });
      router.push(`/admin/novels/${novelSlug}`);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to add chapter";
      setError(message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="surface fade-in" style={{ padding: "2rem" }}>
      <div style={{ display: "grid", gap: "1rem" }}>
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
            New Chapter
          </h2>
          <button
            type="button"
            className="button secondary"
            onClick={() => router.back()}
          >
            Cancel
          </button>
        </div>
        <p style={{ color: "var(--muted)" }}>Adding chapter to {novelSlug}</p>
        <div className="grid-two">
          <label className="card" style={{ gap: "0.5rem" }}>
            <span style={{ fontWeight: 600 }}>Chapter Number</span>
            <input
              type="number"
              min={1}
              value={chapterNumber}
              onChange={(e) => setChapterNumber(Number(e.target.value))}
            />
          </label>
          <label className="card" style={{ gap: "0.5rem" }}>
            <span style={{ fontWeight: 600 }}>Title</span>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Chapter title"
            />
          </label>
          <label className="card" style={{ gap: "0.5rem" }}>
            <span style={{ fontWeight: 600 }}>Created At</span>
            <input
              value={createdAt}
              onChange={(e) => setCreatedAt(e.target.value)}
              placeholder="2026-05-27"
            />
          </label>
        </div>
        <EditorToolbar editor={editor} />
        <div
          className="surface"
          style={{
            padding: "1rem",
            borderRadius: "18px",
            background: "#fffefb",
          }}
        >
          <EditorContent editor={editor} />
        </div>
        <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
          <button
            type="button"
            className="button"
            onClick={handleCreate}
            disabled={saving}
          >
            {saving ? "Saving..." : "Create Chapter"}
          </button>
          {error ? (
            <span style={{ color: "var(--accent-strong)" }}>{error}</span>
          ) : null}
        </div>
      </div>
    </section>
  );
}
