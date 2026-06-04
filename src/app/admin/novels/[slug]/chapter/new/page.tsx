import { notFound } from "next/navigation";
import { getNovelRows } from "@/lib/google/sheets";
import AdminGate from "@/components/admin/AdminGate";
import GoogleAuthButton from "@/components/admin/GoogleAuthButton";
import ChapterNewForm from "@/components/admin/ChapterNewForm";

export const revalidate = 600;
export const dynamicParams = true;

export async function generateStaticParams() {
  const novels = await getNovelRows();
  return novels.map((novel) => ({ slug: novel.slug }));
}

export default async function NewChapterPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const novels = await getNovelRows();
  const novel = novels.find((n) => n.slug === slug);
  if (!novel) notFound();

  return (
    <main className="shell" style={{ paddingBottom: "4rem" }}>
      <section className="surface fade-in" style={{ padding: "2.5rem" }}>
        <div style={{ display: "grid", gap: "1rem" }}>
          <span className="chip">Admin Studio</span>
          <h1 style={{ fontFamily: "var(--font-serif)", fontSize: "2.4rem" }}>
            New Chapter
          </h1>
          <p style={{ color: "var(--muted)" }}>
            for {novel.title}
          </p>
          <GoogleAuthButton />
        </div>
      </section>
      <AdminGate>
        <ChapterNewForm novelSlug={slug} />
      </AdminGate>
    </main>
  );
}
