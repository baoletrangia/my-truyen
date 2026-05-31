"use client";

import { useMemo, useState } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import EditorToolbar from "@/components/admin/EditorToolbar";
import type { ChapterRow, NovelRow } from "@/lib/google/sheets";
import { appendSheetValues } from "@/lib/google/client";
import { env } from "@/lib/env";

type ChapterCreatorProps = {
  accessToken: string | null;
  novels: NovelRow[];
  onCreated: (chapter: ChapterRow) => void;
};

export default function ChapterCreator({
  accessToken,
  novels,
  onCreated,
}: ChapterCreatorProps) {
  const [novelSlug, setNovelSlug] = useState(novels[0]?.slug ?? "");
  const [chapterNumber, setChapterNumber] = useState(1);
  const [title, setTitle] = useState("");
  const [createdAt, setCreatedAt] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3, 4] },
      }),
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

  const activeNovel = useMemo(
    () => novels.find((novel) => novel.slug === novelSlug),
    [novels, novelSlug],
  );

  const handleCreate = async () => {
    if (!accessToken) {
      setError("Connect Google Sheets first.");
      return;
    }
    if (!novelSlug || !title || !chapterNumber) {
      setError("Novel, chapter number, and title are required.");
      return;
    }
    setSaving(true);
    setError(null);
    try {
      if (novels.length === 0) {
        throw new Error("Create a novel first.");
      }
      const content = editor?.getHTML() ?? "";
      const values = [[
        novelSlug,
        chapterNumber.toString(),
        title,
        content,
        createdAt,
      ]];
      const response = (await appendSheetValues(accessToken, env.sheetsId, {
        range: `${env.chaptersSheet}!A:E`,
        values,
      })) as { updates?: { updatedRange?: string } };
      const updatedRange = response.updates?.updatedRange ?? "";
      const rowNumber = Number(updatedRange.match(/\d+/)?.[0] ?? 0);
      onCreated({
        rowNumber,
        novelSlug,
        chapterNumber,
        title,
        content,
        createdAt,
      });
      setTitle("");
      setChapterNumber(chapterNumber + 1);
      setCreatedAt("");
      editor?.commands.setContent("");
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
        <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "1.8rem" }}>
          Add Chapter
        </h2>
        <div className="grid-two">
          <label className="card" style={{ gap: "0.5rem" }}>
            <span style={{ fontWeight: 600 }}>Novel</span>
            <select
              value={novelSlug}
              onChange={(event) => setNovelSlug(event.target.value)}
              disabled={novels.length === 0}
            >
              {novels.map((novel) => (
                <option key={novel.slug} value={novel.slug}>
                  {novel.title}
                </option>
              ))}
            </select>
            <span style={{ color: "var(--muted)", fontSize: "0.9rem" }}>
              {activeNovel?.title}
            </span>
          </label>
          <label className="card" style={{ gap: "0.5rem" }}>
            <span style={{ fontWeight: 600 }}>Chapter Number</span>
            <input
              type="number"
              min={1}
              value={chapterNumber}
              onChange={(event) => setChapterNumber(Number(event.target.value))}
            />
          </label>
          <label className="card" style={{ gap: "0.5rem" }}>
            <span style={{ fontWeight: 600 }}>Title</span>
            <input
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="Chapter title"
            />
          </label>
          <label className="card" style={{ gap: "0.5rem" }}>
            <span style={{ fontWeight: 600 }}>Created At</span>
            <input
              value={createdAt}
              onChange={(event) => setCreatedAt(event.target.value)}
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
          <button type="button" className="button" onClick={handleCreate} disabled={saving}>
            {saving ? "Saving..." : "Add Chapter"}
          </button>
          {error ? <span style={{ color: "var(--accent-strong)" }}>{error}</span> : null}
        </div>
      </div>
    </section>
  );
}
