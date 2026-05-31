import Link from "next/link";
import { notFound } from "next/navigation";
import { sanitizeContent } from "@/lib/sanitize";
import { formatDate } from "@/lib/utils";
import { getChapterRows, getNovelRows } from "@/lib/google/sheets";

export const revalidate = 600;
export const dynamicParams = true;

export async function generateStaticParams() {
  const novels = await getNovelRows();
  return novels.map((novel) => ({ slug: novel.slug }));
}

export default async function NovelDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const novels = await getNovelRows();
  const novel = novels.find((item) => item.slug === slug);
  if (!novel) {
    notFound();
  }
  const chapters = await getChapterRows();
  const novelChapters = chapters.filter((chapter) => chapter.novelSlug === slug);

  return (
    <main className="shell" style={{ paddingBottom: "4rem" }}>
      <section
        className="surface fade-in"
        style={{ padding: "2.5rem", display: "grid", gap: "2rem" }}
      >
        <div style={{ display: "grid", gap: "1.5rem" }}>
          <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
            <span className="chip">{novel.status}</span>
            {novel.tags.map((tag) => (
              <span className="chip" key={tag}>
                {tag}
              </span>
            ))}
          </div>
          <h1
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: "clamp(2.2rem, 4vw, 3.2rem)",
            }}
          >
            {novel.title}
          </h1>
          <p style={{ color: "var(--muted)", fontSize: "1.05rem" }}>
            By {novel.author}
          </p>
          <div
            className="reader"
            style={{ maxWidth: 760 }}
            dangerouslySetInnerHTML={{
              __html: sanitizeContent(novel.summary),
            }}
          />
        </div>
        {novel.cover ? (
          <img
            src={novel.cover}
            alt={novel.title}
            style={{
              width: "100%",
              maxWidth: 320,
              borderRadius: "20px",
              border: "1px solid var(--border)",
              boxShadow: "0 18px 40px var(--shadow)",
            }}
          />
        ) : null}
      </section>

      <section
        className="surface fade-in"
        style={{ marginTop: "2rem", padding: "2rem" }}
      >
        <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "1.8rem" }}>
          Chapters
        </h2>
        <div style={{ marginTop: "1.5rem", display: "grid", gap: "1rem" }}>
          {novelChapters.map((chapter) => (
            <Link
              key={`${chapter.novelSlug}-${chapter.chapterNumber}`}
              href={`/novel/${chapter.novelSlug}/chapter/${chapter.chapterNumber}`}
              className="card"
            >
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span>
                  Chapter {chapter.chapterNumber}: {chapter.title}
                </span>
                <span style={{ color: "var(--muted)", fontSize: "0.9rem" }}>
                  {formatDate(chapter.createdAt)}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
