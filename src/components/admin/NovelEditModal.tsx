"use client";

import { useMemo, useState } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import EditorToolbar from "@/components/admin/EditorToolbar";
import type { NovelRow } from "@/lib/google/sheets";
import type { NovelStatus } from "@/lib/types";
import { updateSheetValues } from "@/lib/google/client";
import { env } from "@/lib/env";

type NovelEditModalProps = {
  novel: NovelRow;
  accessToken: string | null;
  onClose: () => void;
  onSaved: (novel: NovelRow) => void;
};

const statusOptions: NovelStatus[] = ["ongoing", "completed", "hiatus", "dropped"];

export default function NovelEditModal({
  novel,
  accessToken,
  onClose,
  onSaved,
}: NovelEditModalProps) {
  const [title, setTitle] = useState(novel.title);
  const [author, setAuthor] = useState(novel.author);
  const [cover, setCover] = useState(novel.cover);
  const [tags, setTags] = useState(novel.tags.join(", "));
  const [status, setStatus] = useState<NovelStatus>(novel.status);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const slug = useMemo(
    () =>
      title
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, ""),
    [title],
  );

  const editor = useEditor({
    extensions: [
      StarterKit.configure({ heading: { levels: [2, 3, 4] } }),
      Underline,
      Link.configure({ openOnClick: false }),
    ],
    content: novel.summary,
    editorProps: {
      attributes: {
        class: "reader",
        style: "min-height: 180px;",
      },
    },
  });

  const handleSave = async () => {
    if (!accessToken) {
      setError("Connect Google Sheets first.");
      return;
    }
    setSaving(true);
    setError(null);
    try {
      const summary = editor?.getHTML() ?? "";
      const range = `${env.novelsSheet}!A${novel.rowNumber}:G${novel.rowNumber}`;
      await updateSheetValues(accessToken, env.sheetsId, {
        range,
        values: [[
          slug,
          title,
          author,
          cover,
          summary,
          tags
            .split(",")
            .map((t) => t.trim())
            .filter(Boolean)
            .join(","),
          status,
        ]],
      });
      onSaved({
        ...novel,
        slug,
        title,
        author,
        cover,
        summary,
        tags: tags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
        status,
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to save";
      setError(message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.4)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 100,
        padding: "1rem",
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="surface"
        style={{
          width: "100%",
          maxWidth: 720,
          maxHeight: "90vh",
          overflowY: "auto",
          padding: "2rem",
        }}
      >
        <div style={{ display: "grid", gap: "1.5rem" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "1.8rem" }}>
              Edit Novel
            </h2>
            <button
              type="button"
              className="button secondary"
              onClick={onClose}
              style={{ padding: "0.5rem 1rem" }}
            >
              Cancel
            </button>
          </div>

          <div className="grid-two">
            <label className="card" style={{ gap: "0.5rem" }}>
              <span style={{ fontWeight: 600 }}>Title</span>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Novel title"
              />
            </label>
            <label className="card" style={{ gap: "0.5rem" }}>
              <span style={{ fontWeight: 600 }}>Slug (auto)</span>
              <input value={slug} readOnly placeholder="auto-generated" />
            </label>
            <label className="card" style={{ gap: "0.5rem" }}>
              <span style={{ fontWeight: 600 }}>Author</span>
              <input
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                placeholder="Author name"
              />
            </label>
            <label className="card" style={{ gap: "0.5rem" }}>
              <span style={{ fontWeight: 600 }}>Cover URL</span>
              <input
                value={cover}
                onChange={(e) => setCover(e.target.value)}
                placeholder="https://..."
              />
            </label>
            <label className="card" style={{ gap: "0.5rem" }}>
              <span style={{ fontWeight: 600 }}>Tags</span>
              <input
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="romance, fantasy"
              />
            </label>
            <label className="card" style={{ gap: "0.5rem" }}>
              <span style={{ fontWeight: 600 }}>Status</span>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as NovelStatus)}
              >
                {statusOptions.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
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
              onClick={handleSave}
              disabled={saving}
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
            <button type="button" className="button secondary" onClick={onClose}>
              Cancel
            </button>
            {error ? (
              <span style={{ color: "var(--accent-strong)" }}>{error}</span>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
