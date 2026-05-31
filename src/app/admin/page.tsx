import AdminLogin from "@/components/admin/AdminLogin";
import { env } from "@/lib/env";

export default function AdminLoginPage() {
  return (
    <main className="shell" style={{ paddingBottom: "4rem" }}>
      {env.googleClientId ? null : (
        <section className="surface" style={{ padding: "2rem", marginBottom: "2rem" }}>
          <div className="card" style={{ color: "var(--accent-strong)" }}>
            Missing `NEXT_PUBLIC_GOOGLE_CLIENT_ID`. Add it to your env to enable
            admin login.
          </div>
        </section>
      )}
      <AdminLogin />
    </main>
  );
}
