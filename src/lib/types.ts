export type NovelStatus = "ongoing" | "completed" | "hiatus" | "dropped";

export type Novel = {
  slug: string;
  title: string;
  author: string;
  cover: string;
  summary: string;
  tags: string[];
  status: NovelStatus;
};

export type Chapter = {
  novelSlug: string;
  chapterNumber: number;
  title: string;
  content: string;
  createdAt: string;
};

export type SheetConfig = {
  sheetId: string;
  novelsSheet?: string;
  chaptersSheet?: string;
};

export type SheetsRange = {
  range: string;
  values: string[][];
};
