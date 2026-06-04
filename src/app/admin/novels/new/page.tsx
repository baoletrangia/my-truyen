"use client";

import { useGoogleAccessToken } from "@/components/admin/GoogleAuthButton";
import NovelCreator from "@/components/admin/NovelCreator";
import AdminGate from "@/components/admin/AdminGate";
import { useRouter } from "next/navigation";

export default function NewNovelPage() {
  const accessToken = useGoogleAccessToken();
  const router = useRouter();

  return (
    <main className="shell" style={{ paddingBottom: "4rem" }}>
      <section className="surface fade-in" style={{ padding: "2.5rem" }}>
        <div style={{ display: "grid", gap: "1rem" }}>
          <span className="chip">Admin Studio</span>
          <h1 style={{ fontFamily: "var(--font-serif)", fontSize: "2.4rem" }}>
            New Novel
          </h1>
          <p style={{ color: "var(--muted)" }}>
            Fill in the details to create a new novel.
          </p>
        </div>
      </section>
      <AdminGate>
        <NovelCreator
          accessToken={accessToken}
          onCreated={(novel) => router.push(`/admin/novels/${novel.slug}`)}
        />
      </AdminGate>
    </main>
  );
}
