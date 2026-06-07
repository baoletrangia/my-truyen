import { notFound } from "next/navigation";
import Link from "next/link";
import ReaderShell from "@/components/reader/ReaderShell";
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

  const chapterList = novelChapters.map((ch) => ({
    number: ch.chapterNumber,
    title: ch.title,
  }));

  return (
    <ReaderShell
      novelSlug={slug}
      novelTitle={novel.title}
      currentChapter={chapterNumber}
      chapters={chapterList}
      previousChapter={previous}
      nextChapter={next}
    >
      <main style={{ padding: "2rem 1rem 4rem", maxWidth: "var(--reader-width)", margin: "0 auto", width: "100%" }}>
        <h1
          style={{
            fontFamily: "var(--font-serif)",
            fontSize: "clamp(1.8rem, 3vw, 2.4rem)",
            marginBottom: "0.4rem",
            color: "var(--surface-ink)",
          }}
        >
          Chapter {current.chapterNumber}: {current.title}
        </h1>
        <p style={{ color: "var(--muted)", fontSize: "0.9rem", marginBottom: "2rem" }}>
          {novel.title}
        </p>

        <article
          className="reader"
          dangerouslySetInnerHTML={{
            __html: sanitizeContent(current.content),
          }}
        />

        <div
          style={{
            display: "flex",
            gap: "1rem",
            flexWrap: "wrap",
            marginTop: "3rem",
            paddingTop: "2rem",
            borderTop: "1px solid var(--border)",
          }}
        >
          <Link href={`/novel/${slug}`} className="chip" style={{ alignSelf: "flex-start" }}>
            ← {novel.title}
          </Link>
          <div style={{ display: "flex", gap: "0.75rem", flex: 1, justifyContent: "flex-end" }}>
            {previous ? (
              <Link
                className="button secondary"
                href={`/novel/${slug}/chapter/${previous}`}
              >
                ◀ Previous
              </Link>
            ) : null}
            {next ? (
              <Link
                className="button"
                href={`/novel/${slug}/chapter/${next}`}
              >
                Next Chapter ▶
              </Link>
            ) : null}
          </div>
        </div>
      </main>
    </ReaderShell>
  );
}
