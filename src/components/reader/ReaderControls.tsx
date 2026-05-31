"use client";

import { useEffect } from "react";
import { useReaderStore, type ReaderSettings } from "@/stores/reader";
import { cx } from "@/lib/utils";

export default function ReaderControls() {
  const { settings, setSettings, hydrate } = useReaderStore();

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  return (
    <section
      className="surface fade-in"
      style={{ padding: "1.5rem", display: "grid", gap: "1rem" }}
    >
      <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "1.6rem" }}>
        Reader Preferences
      </h2>
      <div className="grid-two">
        <label className="card" style={{ gap: "0.75rem" }}>
          <span style={{ fontWeight: 600 }}>Font</span>
          <select
            value={settings.fontFamily}
            onChange={(event) =>
              setSettings({
                fontFamily: event.target.value as ReaderSettings["fontFamily"],
              })
            }
            style={{
              padding: "0.5rem",
              borderRadius: "12px",
              border: "1px solid var(--border)",
              background: "white",
            }}
          >
            <option value="literata">Literata</option>
            <option value="spectral">Spectral</option>
            <option value="inter">Inter</option>
          </select>
        </label>
        <label className="card" style={{ gap: "0.75rem" }}>
          <span style={{ fontWeight: 600 }}>Font size</span>
          <input
            type="range"
            min={14}
            max={24}
            value={settings.fontSize}
            onChange={(event) =>
              setSettings({ fontSize: Number(event.target.value) })
            }
          />
          <span>{settings.fontSize}px</span>
        </label>
        <label className="card" style={{ gap: "0.75rem" }}>
          <span style={{ fontWeight: 600 }}>Line spacing</span>
          <input
            type="range"
            min={1.4}
            max={2.2}
            step={0.1}
            value={settings.lineHeight}
            onChange={(event) =>
              setSettings({ lineHeight: Number(event.target.value) })
            }
          />
          <span>{settings.lineHeight.toFixed(1)}</span>
        </label>
        <label className="card" style={{ gap: "0.75rem" }}>
          <span style={{ fontWeight: 600 }}>Reading width</span>
          <input
            type="range"
            min={560}
            max={900}
            step={20}
            value={settings.contentWidth}
            onChange={(event) =>
              setSettings({ contentWidth: Number(event.target.value) })
            }
          />
          <span>{settings.contentWidth}px</span>
        </label>
      </div>
      <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
        {(["paper", "sepia", "midnight"] as const).map((theme) => (
          <button
            key={theme}
            type="button"
            className={cx("chip", settings.theme === theme && "active")}
            onClick={() => setSettings({ theme })}
          >
            {theme}
          </button>
        ))}
      </div>
    </section>
  );
}
