import { notFound } from "next/navigation";
import { getChapterRows } from "@/lib/google/sheets";
import AdminGate from "@/components/admin/AdminGate";
import ChapterEditForm from "@/components/admin/ChapterEditForm";
import GoogleAuthButton from "@/components/admin/GoogleAuthButton";

export const revalidate = 600;
export const dynamicParams = true;

export default async function EditChapterPage({
  params,
}: {
  params: Promise<{ slug: string; chapterNumber: string }>;
}) {
  const { slug, chapterNumber } = await params;
  const chapters = await getChapterRows();
  const chapter = chapters.find(
    (c) => c.novelSlug === slug && c.chapterNumber === Number(chapterNumber),
  );
  if (!chapter) notFound();

  return (
    <main className="shell" style={{ paddingBottom: "4rem" }}>
      <section className="surface fade-in" style={{ padding: "2.5rem" }}>
        <div style={{ display: "grid", gap: "1rem" }}>
          <span className="chip">Admin Studio</span>
          <h1 style={{ fontFamily: "var(--font-serif)", fontSize: "2.4rem" }}>
            Edit Chapter {chapter.chapterNumber}
          </h1>
          <p style={{ color: "var(--muted)" }}>
            {chapter.title} &mdash; {slug}
          </p>
          <GoogleAuthButton />
        </div>
      </section>
      <AdminGate>
        <ChapterEditForm chapter={chapter} />
      </AdminGate>
    </main>
  );
}
