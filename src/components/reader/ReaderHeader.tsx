import Link from "next/link";

type ReaderHeaderProps = {
  title: string;
  novelTitle: string;
  novelSlug: string;
  chapterNumber: number;
  previousChapter?: number;
  nextChapter?: number;
};

export default function ReaderHeader({
  title,
  novelTitle,
  novelSlug,
  chapterNumber,
  previousChapter,
  nextChapter,
}: ReaderHeaderProps) {
  return (
    <header
      className="surface fade-in"
      style={{
        padding: "1.75rem",
        display: "grid",
        gap: "1rem",
        marginBottom: "2rem",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Link href={`/novel/${novelSlug}`} className="chip">
          {novelTitle}
        </Link>
        <Link href="/settings" className="chip">
          Reader Settings
        </Link>
      </div>
      <div>
        <h1
          style={{
            fontFamily: "var(--font-serif)",
            fontSize: "clamp(2rem, 3.5vw, 2.8rem)",
            marginBottom: "0.4rem",
          }}
        >
          Chapter {chapterNumber}: {title}
        </h1>
        <div style={{ color: "var(--muted)", fontSize: "0.95rem" }}>
          Continue reading with calm focus.
        </div>
      </div>
      <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
        {previousChapter ? (
          <Link
            className="button secondary"
            href={`/novel/${novelSlug}/chapter/${previousChapter}`}
          >
            Previous
          </Link>
        ) : null}
        {nextChapter ? (
          <Link
            className="button"
            href={`/novel/${novelSlug}/chapter/${nextChapter}`}
          >
            Next Chapter
          </Link>
        ) : null}
      </div>
    </header>
  );
}
