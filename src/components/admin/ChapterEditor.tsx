"use client";

import { useEffect, useMemo, useState } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import EditorToolbar from "@/components/admin/EditorToolbar";
import type { ChapterRow, NovelRow } from "@/lib/google/sheets";
import { updateSheetValues } from "@/lib/google/client";
import { env } from "@/lib/env";

type ChapterEditorProps = {
  novels: NovelRow[];
  chapters: ChapterRow[];
  accessToken: string | null;
};

export default function ChapterEditor({
  novels,
  chapters,
  accessToken,
}: ChapterEditorProps) {
  const [selectedNovel, setSelectedNovel] = useState(novels[0]?.slug ?? "");
  const [selectedChapter, setSelectedChapter] = useState<ChapterRow | null>(
    chapters.find((chapter) => chapter.novelSlug === novels[0]?.slug) ?? null,
  );
  const [status, setStatus] = useState<string | null>(null);

  const novelChapters = useMemo(
    () =>
      chapters.filter((chapter) => chapter.novelSlug === selectedNovel),
    [chapters, selectedNovel],
  );

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
    content: selectedChapter?.content ?? "",
    editorProps: {
      attributes: {
        class: "reader",
        style: "min-height: 220px;",
      },
    },
    onUpdate({ editor }) {
      setSelectedChapter((prev) =>
        prev ? { ...prev, content: editor.getHTML() } : prev,
      );
    },
  });

  useEffect(() => {
    if (novels.length && !selectedNovel) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSelectedNovel(novels[0]?.slug ?? "");
    }
  }, [novels, selectedNovel]);

  useEffect(() => {
    if (!selectedChapter && novelChapters.length) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSelectedChapter(novelChapters[0]);
    }
  }, [novelChapters, selectedChapter]);

  useEffect(() => {
    if (editor && selectedChapter) {
      editor.commands.setContent(selectedChapter.content);
    }
  }, [editor, selectedChapter?.rowNumber, selectedChapter]);

  const handleNovelChange = (slug: string) => {
    setSelectedNovel(slug);
    const chapter = chapters.find((item) => item.novelSlug === slug) ?? null;
    setSelectedChapter(chapter);
  };

  const handleChapterChange = (rowNumber: number) => {
    const chapter = chapters.find((item) => item.rowNumber === rowNumber) ?? null;
    setSelectedChapter(chapter);
  };

  const handleSave = async () => {
    if (!accessToken || !selectedChapter) {
      setStatus("Connect Google Sheets first.");
      return;
    }
    setStatus("Saving...");
    try {
      const range = `${env.chaptersSheet}!D${selectedChapter.rowNumber}`;
      await updateSheetValues(accessToken, env.sheetsId, {
        range,
        values: [[selectedChapter.content]],
      });
      setStatus("Saved to Google Sheets.");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Save failed";
      setStatus(message);
    }
  };

  return (
    <section className="surface fade-in" style={{ padding: "2rem" }}>
      <div style={{ display: "grid", gap: "1rem" }}>
        <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "1.8rem" }}>
          Chapter Editor
        </h2>
        <div style={{ display: "grid", gap: "1rem" }}>
          <label style={{ display: "grid", gap: "0.5rem" }}>
            <span style={{ fontWeight: 600 }}>Novel</span>
            <select
              value={selectedNovel}
              onChange={(event) => handleNovelChange(event.target.value)}
              style={{
                padding: "0.6rem",
                borderRadius: "12px",
                border: "1px solid var(--border)",
                background: "white",
              }}
            >
              {novels.map((novel) => (
                <option key={novel.slug} value={novel.slug}>
                  {novel.title}
                </option>
              ))}
            </select>
          </label>
          <label style={{ display: "grid", gap: "0.5rem" }}>
            <span style={{ fontWeight: 600 }}>Chapter</span>
            <select
              value={selectedChapter?.rowNumber ?? ""}
              onChange={(event) => handleChapterChange(Number(event.target.value))}
              style={{
                padding: "0.6rem",
                borderRadius: "12px",
                border: "1px solid var(--border)",
                background: "white",
              }}
            >
              {novelChapters.map((chapter) => (
                <option key={chapter.rowNumber} value={chapter.rowNumber}>
                  Chapter {chapter.chapterNumber}: {chapter.title}
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
          <button type="button" className="button" onClick={handleSave}>
            Save Chapter
          </button>
          {status ? <span style={{ color: "var(--muted)" }}>{status}</span> : null}
        </div>
      </div>
    </section>
  );
}
