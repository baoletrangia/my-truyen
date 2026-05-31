"use client";

import { useMemo, useState } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import EditorToolbar from "@/components/admin/EditorToolbar";
import type { NovelStatus } from "@/lib/types";
import type { NovelRow } from "@/lib/google/sheets";
import { appendSheetValues } from "@/lib/google/client";
import { env } from "@/lib/env";

type NovelCreatorProps = {
  accessToken: string | null;
  onCreated: (novel: NovelRow) => void;
};

const statusOptions: NovelStatus[] = ["ongoing", "completed", "hiatus", "dropped"];

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export default function NovelCreator({ accessToken, onCreated }: NovelCreatorProps) {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [cover, setCover] = useState("");
  const [tags, setTags] = useState("");
  const [status, setStatus] = useState<NovelStatus>("ongoing");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const slug = useMemo(() => slugify(title), [title]);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [2, 3, 4],
        },
      }),
      Underline,
      Link.configure({ openOnClick: false }),
    ],
    content: "",
    editorProps: {
      attributes: {
        class: "reader",
        style: "min-height: 180px;",
      },
    },
  });


  const handleCreate = async () => {
    if (!accessToken) {
      setError("Connect Google Sheets first.");
      return;
    }
    if (!slug || !title) {
      setError("Title is required.");
      return;
    }
    setSaving(true);
    setError(null);
    try {
      if (!slug) {
        throw new Error("Slug is required.");
      }
      const summary = editor?.getHTML() ?? "";
      const values = [[slug, title, author, cover, summary, tags, status]];
      const response = (await appendSheetValues(accessToken, env.sheetsId, {
        range: `${env.novelsSheet}!A:G`,
        values,
      })) as { updates?: { updatedRange?: string } };
      const updatedRange = response.updates?.updatedRange ?? "";
      const rowNumber = Number(updatedRange.match(/\d+/)?.[0] ?? 0);
      onCreated({
        rowNumber,
        slug,
        title,
        author,
        cover,
        summary,
        tags: tags
          ? tags.split(",").map((tag) => tag.trim()).filter(Boolean)
          : [],
        status,
      });
      setTitle("");
      setAuthor("");
      setCover("");
      setTags("");
      setStatus("ongoing");
      editor?.commands.setContent("");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to create novel";
      setError(message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="surface fade-in" style={{ padding: "2rem" }}>
      <div style={{ display: "grid", gap: "1rem" }}>
        <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "1.8rem" }}>
          Create Novel
        </h2>
        <div className="grid-two">
          <label className="card" style={{ gap: "0.5rem" }}>
            <span style={{ fontWeight: 600 }}>Title</span>
            <input
              value={title}
              onChange={(event) => setTitle(event.target.value)}
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
              onChange={(event) => setAuthor(event.target.value)}
              placeholder="Author name"
            />
          </label>
          <label className="card" style={{ gap: "0.5rem" }}>
            <span style={{ fontWeight: 600 }}>Cover URL</span>
            <input
              value={cover}
              onChange={(event) => setCover(event.target.value)}
              placeholder="https://..."
            />
          </label>
          <label className="card" style={{ gap: "0.5rem" }}>
            <span style={{ fontWeight: 600 }}>Tags</span>
            <input
              value={tags}
              onChange={(event) => setTags(event.target.value)}
              placeholder="romance, fantasy"
            />
          </label>
          <label className="card" style={{ gap: "0.5rem" }}>
            <span style={{ fontWeight: 600 }}>Status</span>
            <select value={status} onChange={(event) => setStatus(event.target.value as NovelStatus)}>
              {statusOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
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
          <button type="button" className="button" onClick={handleCreate} disabled={saving}>
            {saving ? "Creating..." : "Create Novel"}
          </button>
          {error ? <span style={{ color: "var(--accent-strong)" }}>{error}</span> : null}
        </div>
      </div>
    </section>
  );
}
