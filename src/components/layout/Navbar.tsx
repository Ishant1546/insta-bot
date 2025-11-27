import { useEffect, useState } from "react";

const themes = [
  { id: "theme-soft-blue", label: "Soft Blue" },
  { id: "theme-soft-violet", label: "Soft Violet" },
  { id: "theme-soft-rose", label: "Blush Rose" },
  { id: "theme-soft-emerald", label: "Emerald" },
  { id: "theme-soft-gold", label: "Soft Gold" },
];

export default function Navbar() {
  const [theme, setTheme] = useState("theme-soft-blue");

  useEffect(() => {
    const stored = localStorage.getItem("lux-theme");
    if (stored) {
      setTheme(stored);
      document.body.className = stored;
    }
  }, []);

  function changeTheme(id: string) {
    setTheme(id);
    document.body.className = id;
    localStorage.setItem("lux-theme", id);
  }

  return (
    <header className="mb-6">
      <div className="glass-panel px-5 py-3 flex items-center justify-between gap-4 fade-in-soft">
        <div className="space-y-0.5">
          <div className="text-[0.75rem] uppercase tracking-[0.18em] text-muted">
            Insta Bot Dashboard
          </div>
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-semibold">Automation Control Room</h1>
            <span className="status-pill text-[0.7rem]">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              Connected
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={theme}
            onChange={(e) => changeTheme(e.target.value)}
            className="text-[0.8rem] rounded-full border border-slate-600/70 bg-slate-900/80 px-3 py-1.5 text-slate-200 outline-none focus:border-[var(--accent-soft)] focus:ring-1 focus:ring-[var(--accent-soft)]"
          >
            {themes.map((t) => (
              <option key={t.id} value={t.id}>
              {t.label}
            </option>
            ))}
          </select>

          <button className="btn-ghost">
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent-strong)]" />
            <span>Private Mode</span>
          </button>
        </div>
      </div>
    </header>
  );
}
