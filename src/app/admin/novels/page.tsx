import { getChapterRows, getNovelRows } from "@/lib/google/sheets";
import AdminGate from "@/components/admin/AdminGate";
import GoogleAuthButton from "@/components/admin/GoogleAuthButton";
import NovelList from "@/components/admin/NovelList";

export const revalidate = 600;

export default async function AdminNovelsPage() {
  const novels = await getNovelRows();
  const chapters = await getChapterRows();

  return (
    <main className="shell" style={{ paddingBottom: "4rem" }}>
      <section className="surface fade-in" style={{ padding: "2.5rem" }}>
        <div style={{ display: "grid", gap: "1rem" }}>
          <span className="chip">Admin Studio</span>
          <h1 style={{ fontFamily: "var(--font-serif)", fontSize: "2.4rem" }}>
            Novels
          </h1>
          <p style={{ color: "var(--muted)" }}>
            Manage your novel collection.
          </p>
          <GoogleAuthButton />
        </div>
      </section>
      <AdminGate>
        <NovelList novels={novels} chapters={chapters} />
      </AdminGate>
    </main>
  );
}
