"use client";

import { useEffect, useMemo, useState } from "react";
import { useGoogleAccessToken } from "@/components/admin/GoogleAuthButton";
import { ensureSheetHeaders } from "@/lib/google/client";
import { env } from "@/lib/env";
import type { ChapterRow, NovelRow } from "@/lib/google/sheets";
import NovelEditor from "@/components/admin/NovelEditor";
import ChapterEditor from "@/components/admin/ChapterEditor";
import NovelCreator from "@/components/admin/NovelCreator";
import ChapterCreator from "@/components/admin/ChapterCreator";

type EditorShellProps = {
  novels: NovelRow[];
  chapters: ChapterRow[];
};

export default function EditorShell({ novels, chapters }: EditorShellProps) {
  const accessToken = useGoogleAccessToken();
  const [novelList, setNovelList] = useState<NovelRow[]>(novels);
  const [chapterList, setChapterList] = useState<ChapterRow[]>(chapters);

  useEffect(() => {
    if (!accessToken) return;

    Promise.all([
      ensureSheetHeaders(accessToken, env.sheetsId, env.novelsSheet, [
        "slug",
        "title",
        "author",
        "cover",
        "summary",
        "tags",
        "status",
      ]),
      ensureSheetHeaders(accessToken, env.sheetsId, env.chaptersSheet, [
        "novel_slug",
        "chapter_number",
        "title",
        "content",
        "created_at",
      ]),
    ]).then(([novelsAdded, chaptersAdded]) => {
      if (novelsAdded || chaptersAdded) {
        window.location.reload();
      }
    });
  }, [accessToken]);

  const sortedChapters = useMemo(
    () =>
      [...chapterList].sort((a, b) =>
        a.novelSlug === b.novelSlug
          ? a.chapterNumber - b.chapterNumber
          : a.novelSlug.localeCompare(b.novelSlug),
      ),
    [chapterList],
  );

  return (
    <div style={{ display: "grid", gap: "2rem", marginTop: "2rem" }}>
      <NovelCreator
        accessToken={accessToken}
        onCreated={(novel) => setNovelList((prev) => [...prev, novel])}
      />
      <ChapterCreator
        accessToken={accessToken}
        novels={novelList}
        onCreated={(chapter) => setChapterList((prev) => [...prev, chapter])}
      />
      <NovelEditor novels={novelList} accessToken={accessToken} />
      <ChapterEditor
        novels={novelList}
        chapters={sortedChapters}
        accessToken={accessToken}
      />
    </div>
  );
}
