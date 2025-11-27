export default function Navbar() {
  function setTheme(theme: string) {
    document.body.className = theme;
    localStorage.setItem("lux-theme", theme);
  }

  return (
    <div
      className="glass-panel flex items-center justify-between px-6 py-4
      border-b border-slate-700/40 backdrop-blur-xl"
    >
      <h1 className="text-xl font-semibold tracking-wide">Bot Dashboard</h1>

      {/* Theme Switcher */}
      <div className="flex gap-3 items-center">
        <select
          className="glass-soft px-3 py-2 rounded-lg text-sm outline-none"
          defaultValue={localStorage.getItem("lux-theme") ?? "theme-soft-blue"}
          onChange={(e) => setTheme(e.target.value)}
        >
          <option value="theme-soft-blue">Soft Blue</option>
          <option value="theme-soft-violet">Violet</option>
          <option value="theme-soft-rose">Rose</option>
          <option value="theme-soft-emerald">Emerald</option>
          <option value="theme-soft-gold">Gold</option>
        </select>

        <div className="w-3 h-3 rounded-full bg-[var(--lux-accent)] shadow-glow"></div>
      </div>
    </div>
  );
}
