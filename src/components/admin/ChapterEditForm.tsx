"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import EditorToolbar from "@/components/admin/EditorToolbar";
import { useGoogleAccessToken } from "@/components/admin/GoogleAuthButton";
import type { ChapterRow } from "@/lib/google/sheets";
import { updateSheetValues } from "@/lib/google/client";
import { env } from "@/lib/env";

type ChapterEditFormProps = {
  chapter: ChapterRow;
};

export default function ChapterEditForm({ chapter }: ChapterEditFormProps) {
  const accessToken = useGoogleAccessToken();
  const [title, setTitle] = useState(chapter.title);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const router = useRouter();

  const editor = useEditor({
    extensions: [
      StarterKit.configure({ heading: { levels: [2, 3, 4] } }),
      Underline,
      Link.configure({ openOnClick: false }),
    ],
    content: chapter.content,
    editorProps: {
      attributes: {
        class: "reader",
        style: "min-height: 220px;",
      },
    },
  });

  const handleSave = async () => {
    if (!accessToken) {
      setStatus("Connect Google Sheets first.");
      return;
    }
    setSaving(true);
    setStatus(null);
    try {
      const content = editor?.getHTML() ?? "";
      await updateSheetValues(accessToken, env.sheetsId, {
        range: `${env.chaptersSheet}!C${chapter.rowNumber}:D${chapter.rowNumber}`,
        values: [[title, content]],
      });
      setStatus("Saved.");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Save failed";
      setStatus(message);
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
            Edit Chapter {chapter.chapterNumber}
          </h2>
          <button
            type="button"
            className="button secondary"
            onClick={() => router.push(`/admin/novels/${chapter.novelSlug}`)}
          >
            &larr; Back to Novel
          </button>
        </div>

        <label className="card" style={{ gap: "0.5rem" }}>
          <span style={{ fontWeight: 600 }}>Title</span>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Chapter title"
          />
        </label>

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
          {status ? (
            <span style={{ color: "var(--muted)" }}>{status}</span>
          ) : null}
        </div>
      </div>
    </section>
  );
}
