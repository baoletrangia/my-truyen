import { notFound } from "next/navigation";
import ReaderHeader from "@/components/reader/ReaderHeader";
import ReaderPreferences from "@/components/reader/ReaderPreferences";
import { sanitizeContent } from "@/lib/sanitize";
import { getChapterRows, getNovelRows } from "@/lib/google/sheets";

export const revalidate = 600;
export const dynamicParams = true;

export async function generateStaticParams() {
  const chapters = await getChapterRows();
  return chapters.map((chapter) => ({
    slug: chapter.novelSlug,
    chapter: chapter.chapterNumber.toString(),
  }));
}

export default async function ChapterPage({
  params,
}: {
  params: Promise<{ slug: string; chapter: string }>;
}) {
  const { slug, chapter } = await params;
  const chapterNumber = Number(chapter);
  if (!Number.isFinite(chapterNumber)) {
    notFound();
  }

  const chapters = await getChapterRows();
  const current = chapters.find(
    (item) => item.novelSlug === slug && item.chapterNumber === chapterNumber,
  );
  if (!current) {
    notFound();
  }
  const novel = (await getNovelRows()).find((item) => item.slug === slug);
  if (!novel) {
    notFound();
  }

  const novelChapters = chapters.filter((item) => item.novelSlug === slug);
  const index = novelChapters.findIndex(
    (item) => item.chapterNumber === chapterNumber,
  );
  const previous = index > 0 ? novelChapters[index - 1]?.chapterNumber : undefined;
  const next =
    index >= 0 && index < novelChapters.length - 1
      ? novelChapters[index + 1]?.chapterNumber
      : undefined;

  return (
    <ReaderPreferences>
      <main className="shell" style={{ paddingBottom: "4rem" }}>
        <ReaderHeader
          title={current.title}
          novelTitle={novel.title}
          novelSlug={novel.slug}
          chapterNumber={current.chapterNumber}
          previousChapter={previous}
          nextChapter={next}
        />
        <section className="surface fade-in" style={{ padding: "2rem" }}>
          <article
            className="reader"
            dangerouslySetInnerHTML={{
              __html: sanitizeContent(current.content),
            }}
          />
        </section>
      </main>
    </ReaderPreferences>
  );
}
