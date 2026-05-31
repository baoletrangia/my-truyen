import GoogleAuthButton from "@/components/admin/GoogleAuthButton";
import { getChapterRows, getNovelRows } from "@/lib/google/sheets";
import EditorShell from "@/components/admin/EditorShell";
import AdminGate from "@/components/admin/AdminGate";

export const revalidate = 600;

export default async function AdminEditorPage() {
  const novels = await getNovelRows();
  const chapters = await getChapterRows();

  return (
    <main className="shell" style={{ paddingBottom: "4rem" }}>
      <section className="surface fade-in" style={{ padding: "2.5rem" }}>
        <div style={{ display: "grid", gap: "1rem" }}>
          <span className="chip">Admin Studio</span>
          <h1 style={{ fontFamily: "var(--font-serif)", fontSize: "2.4rem" }}>
            Editor Workspace
          </h1>
          <p style={{ color: "var(--muted)" }}>
            Manage novels and chapters from your Google Sheet.
          </p>
          <GoogleAuthButton />
        </div>
      </section>

      <AdminGate>
        <EditorShell novels={novels} chapters={chapters} />
      </AdminGate>
    </main>
  );
}
