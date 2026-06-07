"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { env } from "@/lib/env";

export default function TopNav() {
  const pathname = usePathname();
  const isReader = pathname.startsWith("/novel/") && pathname.includes("/chapter/");

  if (isReader) return null;

  return (
    <header className="shell fade-in" style={{ padding: "2rem 0 1.5rem" }}>
      <div
        className="surface"
        style={{
          padding: "1rem 1.5rem",
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "1rem",
        }}
      >
        <Link href="/" style={{ fontWeight: 700, fontSize: "1.15rem" }}>
          {env.siteName}
        </Link>
        <nav style={{ display: "flex", gap: "1rem", fontWeight: 500 }}>
          <Link href="/novels">Library</Link>
          <Link href="/admin">Admin</Link>
        </nav>
      </div>
    </header>
  );
}
