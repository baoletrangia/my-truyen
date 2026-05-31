import Link from "next/link";
import type { Novel } from "@/lib/types";
import { stripHtml, truncateText } from "@/lib/utils";

type NovelCardProps = {
  novel: Novel;
};

export default function NovelCard({ novel }: NovelCardProps) {
  return (
    <Link href={`/novel/${novel.slug}`} className="card">
      {novel.cover ? (
        <img
          src={novel.cover}
          alt={novel.title}
          style={{
            borderRadius: "16px",
            border: "1px solid var(--border)",
            boxShadow: "0 10px 30px var(--shadow)",
            aspectRatio: "3 / 4",
            objectFit: "cover",
          }}
        />
      ) : null}
      <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
        <span className="chip">{novel.status}</span>
        <h3>{novel.title}</h3>
        <p style={{ color: "var(--muted)", fontSize: "0.95rem" }}>
          {truncateText(stripHtml(novel.summary), 140)}
        </p>
        <span style={{ fontSize: "0.9rem", color: "var(--muted)" }}>
          {novel.author}
        </span>
      </div>
    </Link>
  );
}
