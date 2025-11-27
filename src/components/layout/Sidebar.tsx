import { NavLink } from "react-router-dom";
import { useState } from "react";

interface NavData {
  isActive: boolean;
}

const links = [
  { name: "Dashboard", path: "/", icon: "📊" },
  { name: "Logs", path: "/logs", icon: "📜" },
  { name: "Accounts", path: "/accounts", icon: "👤" },
  { name: "Settings", path: "/settings", icon: "⚙️" },
];

export default function Sidebar() {
  const [open, setOpen] = useState(true);

  return (
    <div
      className={`glass-panel h-screen transition-all duration-300
      ${open ? "w-64" : "w-20"} flex flex-col`}
    >
      <div className="flex items-center justify-between px-4 py-5 border-b border-slate-700/40">
        <div className="flex items-center gap-2">
          <div className="text-3xl">🤖</div>
          {open && <div className="text-lg font-semibold">Luxury Bot</div>}
        </div>

        <button
          onClick={() => setOpen(!open)}
          className="text-slate-400 hover:text-white text-xl"
        >
          {open ? "⟨" : "⟩"}
        </button>
      </div>

      <div className="flex flex-col mt-3">
        {links.map((l) => (
          <NavLink
            key={l.path}
            to={l.path}
            end
            className={({ isActive }: NavData) =>
              `
              flex items-center gap-3 px-5 py-3 my-1 rounded-lg 
              transition-all duration-200 cursor-pointer
              ${
                isActive
                  ? "bg-[var(--lux-accent-soft)] text-[var(--lux-accent-strong)] shadow"
                  : "text-slate-300 hover:bg-slate-700/40"
              }
              `
            }
          >
            <span className="text-xl">{l.icon}</span>
            {open && <span className="font-medium">{l.name}</span>}
          </NavLink>
        ))}
      </div>
    </div>
  );
}
