import { useEffect, useState } from "react";
import { api } from "../services/api";

interface BotStatus {
  status: string;
  action: string;
  uptime: string;
  last_success: boolean | null;
}

export default function Dashboard() {
  const [st, setSt] = useState<BotStatus>({
    status: "idle",
    action: "waiting",
    uptime: "0s",
    last_success: null,
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const interval = setInterval(async () => {
      const res = await api.status();
      setSt(res);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  async function startBot() {
    setLoading(true);
    await api.start();
    setLoading(false);
  }

  async function stopBot() {
    setLoading(true);
    await api.stop();
    setLoading(false);
  }

  return (
    <div className="fade-in-soft">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

      {/* GRID */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        {/* STATUS CARD */}
        <div className="glass-panel p-6 rounded-xl">
          <h2 className="text-xl font-semibold mb-3">Bot Status</h2>

          <div
            className={`status-pill w-fit ${
              st.status === "running"
                ? "bg-green-500/30 border-green-400/50 text-green-200"
                : st.status === "starting"
                ? "bg-yellow-500/30 border-yellow-400/50 text-yellow-200"
                : "bg-slate-600/30 border-slate-500/50 text-slate-300"
            }`}
          >
            ● {st.status}
          </div>

          <div className="text-muted mt-3 text-sm">{st.action}</div>

          <div className="mt-4 text-sm">
            <span className="text-muted">Uptime:</span> {st.uptime}
          </div>
        </div>

        {/* START CARD */}
        <div className="glass-panel p-6 rounded-xl">
          <h2 className="text-xl font-semibold mb-4">Controls</h2>

          <div className="flex flex-col gap-4">

            <button
              onClick={startBot}
              disabled={loading}
              className="btn-primary flex items-center justify-center gap-2"
            >
              🚀 Start Bot
            </button>

            <button
              onClick={stopBot}
              disabled={loading}
              className="btn-ghost flex items-center justify-center gap-2"
            >
              🛑 Stop Bot
            </button>
          </div>
        </div>

        {/* LAST RESULT */}
        <div className="glass-panel p-6 rounded-xl">
          <h2 className="text-xl font-semibold mb-4">Last Run Result</h2>

          {st.last_success === null && (
            <div className="text-muted">No runs yet</div>
          )}

          {st.last_success === true && (
            <div className="status-pill bg-green-500/30 border-green-400/50 text-green-200">
              ✓ Success
            </div>
          )}

          {st.last_success === false && (
            <div className="status-pill bg-red-500/30 border-red-400/50 text-red-200">
              ✗ Failed
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
