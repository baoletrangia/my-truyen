import ReaderControls from "@/components/reader/ReaderControls";

export default function SettingsPage() {
  return (
    <main className="shell" style={{ paddingBottom: "4rem" }}>
      <section className="surface fade-in" style={{ padding: "2.5rem" }}>
        <h1 style={{ fontFamily: "var(--font-serif)", fontSize: "2.4rem" }}>
          Reader Settings
        </h1>
        <p style={{ color: "var(--muted)", marginTop: "0.75rem" }}>
          Tune typography, spacing, and theme for a calm reading flow.
        </p>
      </section>
      <div style={{ marginTop: "2rem" }}>
        <ReaderControls />
      </div>
    </main>
  );
}
