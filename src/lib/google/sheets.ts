import { assertSheetsConfig, env } from "@/lib/env";
import type { Chapter, Novel } from "@/lib/types";

type SheetFetchOptions = {
  sheetId: string;
  sheetName: string;
  revalidate?: number;
};

const defaultRevalidate = 600;

async function fetchSheetValues({
  sheetId,
  sheetName,
  revalidate = defaultRevalidate,
}: SheetFetchOptions) {
  const range = encodeURIComponent(`'${sheetName}'`);
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${range}?key=${env.googleApiKey}`;

  const response = await fetch(url, {
    next: { revalidate },
  });
  if (!response.ok) {
    const body = await response.text().catch(() => "");
    console.error(
      `[sheets] fetch ${sheetName} failed: ${response.status} ${response.statusText}`,
      body,
    );
    throw new Error(`Failed to fetch sheet ${sheetName}`);
  }
  const data = await response.json();
  return (data.values as string[][]) ?? [];
}

function normalizeHeader(value: string) {
  return value.trim().toLowerCase();
}

function mapRowsToObjects(rows: string[][]) {
  const [headerRow, ...body] = rows;
  if (!headerRow) {
    return [];
  }
  const headers = headerRow.map(normalizeHeader);
  return body.map((row) => {
    const entry: Record<string, string> = {};
    headers.forEach((header, index) => {
      entry[header] = row[index]?.trim() ?? "";
    });
    return entry;
  });
}

function mapRowsToObjectsWithRow(rows: string[][]) {
  const [headerRow, ...body] = rows;
  if (!headerRow) {
    return [];
  }
  const headers = headerRow.map(normalizeHeader);
  return body.map((row, index) => {
    const entry: Record<string, string> = {};
    headers.forEach((header, columnIndex) => {
      entry[header] = row[columnIndex]?.trim() ?? "";
    });
    return {
      rowNumber: index + 2,
      data: entry,
    };
  });
}

export async function getNovels(revalidate?: number): Promise<Novel[]> {
  assertSheetsConfig();
  const rows = await fetchSheetValues({
    sheetId: env.sheetsId,
    sheetName: env.novelsSheet,
    revalidate,
  });
  const items = mapRowsToObjects(rows);
  return items
    .filter((item) => item.slug)
    .map((item) => {
      const status = (item.status as Novel["status"]) || "ongoing";
      return {
        slug: item.slug,
        title: item.title,
        author: item.author,
        cover: item.cover,
        summary: item.summary,
        tags: item.tags
          ? item.tags
              .split(",")
              .map((tag) => tag.trim())
              .filter(Boolean)
          : [],
        status,
      };
    });
}

export async function getChapters(revalidate?: number): Promise<Chapter[]> {
  assertSheetsConfig();
  const rows = await fetchSheetValues({
    sheetId: env.sheetsId,
    sheetName: env.chaptersSheet,
    revalidate,
  });
  const items = mapRowsToObjects(rows);
  return items
    .filter((item) => item.novel_slug)
    .map((item) => ({
      novelSlug: item.novel_slug,
      chapterNumber: Number(item.chapter_number) || 0,
      title: item.title,
      content: item.content,
      createdAt: item.created_at,
    }))
    .sort((a, b) => a.chapterNumber - b.chapterNumber);
}

export async function getNovelBySlug(slug: string) {
  const novels = await getNovels();
  return novels.find((novel) => novel.slug === slug) ?? null;
}

export async function getChaptersByNovel(slug: string) {
  const chapters = await getChapters();
  return chapters.filter((chapter) => chapter.novelSlug === slug);
}

export async function getChapter(slug: string, chapterNumber: number) {
  const chapters = await getChaptersByNovel(slug);
  return (
    chapters.find((chapter) => chapter.chapterNumber === chapterNumber) ?? null
  );
}

export type NovelRow = Novel & { rowNumber: number };
export type ChapterRow = Chapter & { rowNumber: number };

export async function getNovelRows(revalidate?: number): Promise<NovelRow[]> {
  assertSheetsConfig();
  const rows = await fetchSheetValues({
    sheetId: env.sheetsId,
    sheetName: env.novelsSheet,
    revalidate,
  });
  const items = mapRowsToObjectsWithRow(rows);
  return items
    .filter((item) => item.data.slug)
    .map((item) => {
      const status = (item.data.status as Novel["status"]) || "ongoing";
      return {
        rowNumber: item.rowNumber,
        slug: item.data.slug,
        title: item.data.title,
        author: item.data.author,
        cover: item.data.cover,
        summary: item.data.summary,
        tags: item.data.tags
          ? item.data.tags
              .split(",")
              .map((tag) => tag.trim())
              .filter(Boolean)
          : [],
        status,
      };
    });
}

export async function getChapterRows(
  revalidate?: number,
): Promise<ChapterRow[]> {
  assertSheetsConfig();
  const rows = await fetchSheetValues({
    sheetId: env.sheetsId,
    sheetName: env.chaptersSheet,
    revalidate,
  });
  const items = mapRowsToObjectsWithRow(rows);
  return items
    .filter((item) => item.data.novel_slug)
    .map((item) => ({
      rowNumber: item.rowNumber,
      novelSlug: item.data.novel_slug,
      chapterNumber: Number(item.data.chapter_number) || 0,
      title: item.data.title,
      content: item.data.content,
      createdAt: item.data.created_at,
    }))
    .sort((a, b) => a.chapterNumber - b.chapterNumber);
}
