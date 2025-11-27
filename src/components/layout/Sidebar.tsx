import { NavLink } from "react-router-dom";

const navItems = [
  { to: "/", label: "Dashboard" },
  { to: "/logs", label: "Logs" },
  { to: "/accounts", label: "Accounts" },
  { to: "/settings", label: "Settings" },
];

export default function Sidebar() {
  return (
    <aside className="fixed left-0 top-0 h-screen w-60 px-4 py-5">
      <div className="glass-panel h-full flex flex-col justify-between fade-in-soft">
        <div className="space-y-6 px-2 pt-2">
          <div className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-2xl bg-gradient-to-br from-slate-50/80 to-slate-300/80 flex items-center justify-center shadow-lg shadow-slate-900/60">
              <span className="text-xs font-bold text-slate-900">IB</span>
            </div>
            <div>
              <div className="text-sm font-semibold tracking-wide">
                InstaBot Control
              </div>
              <div className="text-[0.7rem] text-muted">
                Private automation console
              </div>
            </div>
          </div>

          <nav className="space-y-1 text-sm">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end
                className={({ isActive }) =>
                  [
                    "flex items-center justify-between rounded-xl px-3 py-2 transition-all",
                    "border border-transparent bg-transparent",
                    "hover:bg-slate-900/70 hover:border-slate-700/80",
                    isActive
                      ? "bg-slate-900/80 border-[var(--accent-soft)] text-[var(--accent-strong)] shadow-[0_8px_24px_rgba(15,23,42,0.9)]"
                      : "text-slate-200/90",
                  ].join(" ")
                }
              >
                <span>{item.label}</span>
                <span className="h-1 w-1 rounded-full bg-[var(--accent-soft)]" />
              </NavLink>
            ))}
          </nav>
        </div>

        <div className="border-t border-slate-700/50 px-4 py-3 text-[0.75rem] text-muted">
          <div className="flex items-center justify-between">
            <span>Backend</span>
            <span className="status-pill">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(74,222,128,0.9)]" />
              Live
            </span>
          </div>
          <div className="mt-1 truncate text-[0.7rem] opacity-80">
            https://insta-bot-dvds.onrender.com
          </div>
        </div>
      </div>
    </aside>
  );
}
