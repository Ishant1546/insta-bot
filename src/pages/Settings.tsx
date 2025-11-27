import { useEffect, useState } from "react";
import Toast from "../components/ui/Toast";

export default function Settings() {
  const [theme, setTheme] = useState<string>(
    localStorage.getItem("lux-theme") || "theme-soft-blue"
  );
  const [backend, setBackend] = useState<string>(
    localStorage.getItem("lux-backend") ||
      "https://insta-bot-dvds.onrender.com"
  );
  const [autoStart, setAutoStart] = useState<boolean>(
    localStorage.getItem("lux-auto-start") === "true"
  );
  const [interval, setIntervalMs] = useState<number>(
    Number(localStorage.getItem("lux-interval") ?? 1000)
  );

  const [toast, setToast] = useState("");
  function showToast(t: string) {
    setToast(t);
  }

  useEffect(() => {
    document.body.className = theme;
  }, [theme]);

  const saveAll = () => {
    localStorage.setItem("lux-theme", theme);
    localStorage.setItem("lux-backend", backend);
    localStorage.setItem("lux-auto-start", autoStart.toString());
    localStorage.setItem("lux-interval", interval.toString());

    showToast("Settings saved!");
  };

  const resetAll = () => {
    localStorage.clear();
    showToast("Settings reset!");

    setTheme("theme-soft-blue");
    setBackend("https://insta-bot-dvds.onrender.com");
    setAutoStart(false);
    setIntervalMs(1000);
    document.body.className = "theme-soft-blue";
  };

  return (
    <div className="fade-in-soft relative z-0">
      <Toast msg={toast} clear={() => setToast("")} />

      <h1 className="text-3xl font-bold mb-8">Settings</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

        {/* Theme */}
        <div className="glass-panel p-6 rounded-xl">
          <h2 className="text-xl font-semibold mb-4">Theme</h2>
          <select
            className="glass-soft px-4 py-3 rounded-xl w-full"
            value={theme}
            onChange={(e) => {
              setTheme(e.target.value);
              document.body.className = e.target.value;
            }}
          >
            <option value="theme-soft-blue">Soft Blue</option>
            <option value="theme-soft-violet">Violet</option>
            <option value="theme-soft-rose">Blush Rose</option>
            <option value="theme-soft-emerald">Emerald</option>
            <option value="theme-soft-gold">Soft Gold</option>
          </select>
        </div>

        {/* Backend */}
        <div className="glass-panel p-6 rounded-xl">
          <h2 className="text-xl font-semibold mb-4">Backend URL</h2>
          <input
            className="w-full p-3 rounded-xl bg-slate-800/50 border border-slate-600 outline-none"
            value={backend}
            onChange={(e) => setBackend(e.target.value)}
          />
        </div>

        {/* Auto Start */}
        <div className="glass-panel p-6 rounded-xl">
          <h2 className="text-xl font-semibold mb-4">Auto-Start Bot</h2>
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={autoStart}
              onChange={(e) => setAutoStart(e.target.checked)}
              className="w-5 h-5"
            />
            <span>Start bot automatically when Dashboard opens</span>
          </label>
        </div>

        {/* Polling Interval */}
        <div className="glass-panel p-6 rounded-xl">
          <h2 className="text-xl font-semibold mb-4">Polling Interval</h2>
          <select
            className="glass-soft px-4 py-3 rounded-xl w-full"
            value={interval}
            onChange={(e) => setIntervalMs(Number(e.target.value))}
          >
            <option value={500}>Fast (0.5s)</option>
            <option value={1000}>Standard (1s)</option>
            <option value={2000}>Relaxed (2s)</option>
            <option value={5000}>Slow (5s)</option>
          </select>
        </div>
      </div>

      <div className="flex gap-4 mt-10">
        <button className="btn-primary" onClick={saveAll}>
          💾 Save Settings
        </button>

        <button className="btn-ghost" onClick={resetAll}>
          🔄 Reset to Defaults
        </button>
      </div>
    </div>
  );
}
s