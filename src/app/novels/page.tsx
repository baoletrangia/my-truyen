import NovelCard from "@/components/site/NovelCard";
import { getNovels } from "@/lib/google/sheets";

export const revalidate = 600;

export default async function NovelsPage() {
  const novels = await getNovels();

  console.log("novels", novels);

  return (
    <main className="shell" style={{ paddingBottom: "4rem" }}>
      <section className="surface fade-in" style={{ padding: "2.5rem" }}>
        <div style={{ display: "grid", gap: "1rem" }}>
          <h1 style={{ fontFamily: "var(--font-serif)", fontSize: "2.5rem" }}>
            Library
          </h1>
          <p style={{ color: "var(--muted)" }}>
            Discover ongoing and completed stories curated by the site owner.
          </p>
        </div>
      </section>

      <section className="fade-in" style={{ marginTop: "2rem" }}>
        <div className="grid-two">
          {novels.map((novel) => (
            <NovelCard key={novel.slug} novel={novel} />
          ))}
        </div>
      </section>
    </main>
  );
}
