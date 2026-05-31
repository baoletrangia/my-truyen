"use client";

import { useEffect, useMemo, useState } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import EditorToolbar from "@/components/admin/EditorToolbar";
import type { NovelRow } from "@/lib/google/sheets";
import { updateSheetValues } from "@/lib/google/client";
import { env } from "@/lib/env";

type NovelEditorProps = {
  novels: NovelRow[];
  accessToken: string | null;
};

export default function NovelEditor({ novels, accessToken }: NovelEditorProps) {
  const [selectedNovel, setSelectedNovel] = useState<NovelRow | null>(
    novels[0] ?? null,
  );
  const [status, setStatus] = useState<string | null>(null);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [2, 3, 4],
        },
      }),
      Underline,
      Link.configure({
        openOnClick: false,
      }),
    ],
    content: selectedNovel?.summary ?? "",
    editorProps: {
      attributes: {
        class: "reader",
        style: "min-height: 180px;",
      },
    },
    onUpdate({ editor }) {
      setSelectedNovel((prev) =>
        prev ? { ...prev, summary: editor.getHTML() } : prev,
      );
    },
  });

  useEffect(() => {
    if (!selectedNovel && novels.length) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSelectedNovel(novels[0]);
    }
  }, [novels, selectedNovel]);

  useEffect(() => {
    if (editor && selectedNovel) {
      editor.commands.setContent(selectedNovel.summary);
    }
  }, [editor, selectedNovel?.rowNumber, selectedNovel]);

  const handleNovelChange = (slug: string) => {
    const novel = novels.find((item) => item.slug === slug) ?? null;
    setSelectedNovel(novel);
  };

  const handleSave = async () => {
    if (!accessToken || !selectedNovel) {
      setStatus("Connect Google Sheets first.");
      return;
    }
    setStatus("Saving...");
    try {
      const range = `${env.novelsSheet}!E${selectedNovel.rowNumber}`;
      await updateSheetValues(accessToken, env.sheetsId, {
        range,
        values: [[selectedNovel.summary]],
      });
      setStatus("Saved to Google Sheets.");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Save failed";
      setStatus(message);
    }
  };

  const list = useMemo(() => novels, [novels]);

  return (
    <section className="surface fade-in" style={{ padding: "2rem" }}>
      <div style={{ display: "grid", gap: "1rem" }}>
        <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "1.8rem" }}>
          Novel Summary Editor
        </h2>
        <label style={{ display: "grid", gap: "0.5rem" }}>
          <span style={{ fontWeight: 600 }}>Novel</span>
          <select
            value={selectedNovel?.slug ?? ""}
            onChange={(event) => handleNovelChange(event.target.value)}
            style={{
              padding: "0.6rem",
              borderRadius: "12px",
              border: "1px solid var(--border)",
              background: "white",
            }}
          >
            {list.map((novel) => (
              <option key={novel.slug} value={novel.slug}>
                {novel.title}
              </option>
            ))}
          </select>
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
          <button type="button" className="button" onClick={handleSave}>
            Save Summary
          </button>
          {status ? <span style={{ color: "var(--muted)" }}>{status}</span> : null}
        </div>
      </div>
    </section>
  );
}
