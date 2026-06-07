"use client";

import { usePathname } from "next/navigation";

export default function Footer() {
  const pathname = usePathname();
  const isReader = pathname.startsWith("/novel/") && pathname.includes("/chapter/");

  if (isReader) return null;

  return (
    <footer className="shell" style={{ padding: "2rem 0 3rem" }}>
      <div
        className="surface"
        style={{
          padding: "1.5rem",
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "space-between",
          gap: "1rem",
          fontSize: "0.95rem",
          color: "var(--muted)",
        }}
      >
        <span>Open-source novel platform.</span>
        <span>Built for translators and indie authors.</span>
      </div>
    </footer>
  );
}
