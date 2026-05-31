import Link from "next/link";
import { env } from "@/lib/env";
import { getNovels } from "@/lib/google/sheets";
import NovelCard from "@/components/site/NovelCard";

export const revalidate = 600;

export default async function Home() {
  const novels = await getNovels();
  const featured = novels.slice(0, 4);

  return (
    <main className="shell" style={{ paddingBottom: "4rem" }}>
      <section
        className="surface fade-in"
        style={{ padding: "3rem", display: "grid", gap: "2rem" }}
      >
        <div style={{ display: "grid", gap: "1rem" }}>
          <span className="chip">Open-source reading platform</span>
          <h1
            style={{
              fontSize: "clamp(2.4rem, 4vw, 3.6rem)",
              fontFamily: "var(--font-serif)",
              fontWeight: 600,
              lineHeight: 1.1,
            }}
          >
            {env.siteName} is built for translators, writers, and long-form
            readers.
          </h1>
          <p style={{ maxWidth: 560, color: "var(--muted)", fontSize: "1.05rem" }}>
            Launch a beautiful novel site in minutes. Use Google Sheets as your
            CMS, publish from anywhere, and deliver a calm, immersive reading
            experience for every device.
          </p>
        </div>
        <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
          <Link className="button" href="/novels">
            Explore Library
          </Link>
          <Link className="button secondary" href="/admin">
            Open Admin
          </Link>
        </div>
        <div className="grid-two">
          {featured.map((novel) => (
            <NovelCard key={novel.slug} novel={novel} />
          ))}
        </div>
      </section>

      <section
        className="fade-in"
        style={{ display: "grid", gap: "1.5rem" }}
      >
        <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "2rem" }}>
          Why creators pick this stack
        </h2>
        <div className="grid-two">
          {[
            {
              title: "No backend, no database",
              description:
                "All content lives in Google Sheets. Fork, paste sheet ID, deploy.",
            },
            {
              title: "Editorial reading experience",
              description:
                "Typography-forward layout, mobile-first pacing, and reader controls.",
            },
            {
              title: "Open-source by default",
              description:
                "Designed for forks, community themes, and easy customization.",
            },
            {
              title: "Static-first, fast everywhere",
              description:
                "Pre-rendered pages with lightweight revalidation every 10 minutes.",
            },
          ].map((item) => (
            <div key={item.title} className="card">
              <h3>{item.title}</h3>
              <p style={{ color: "var(--muted)" }}>{item.description}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
