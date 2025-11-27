import { useEffect, useState } from "react";
import { getStatus, startBot, stopBot } from "../services/api";
import StatusCard from "../components/cards/StatusCard";

type Status = {
  status?: string;
  uptime?: string;
  action?: string;
};

export default function Dashboard() {
  const [status, setStatus] = useState<Status>({});
  const [starting, setStarting] = useState(false);

  useEffect(() => {
    let mounted = true;
    const fetchStatus = async () => {
      const data = await getStatus();
      if (mounted) setStatus(data);
    };
    fetchStatus();
    const id = setInterval(fetchStatus, 1200);
    return () => {
      mounted = false;
      clearInterval(id);
    };
  }, []);

  async function handleStart() {
    setStarting(true);
    await startBot();
    setStarting(false);
  }

  async function handleStop() {
    await stopBot();
  }

  const prettyStatus = status.status ?? "offline";
  const prettyUptime = status.uptime ?? "0s";
  const prettyAction = status.action ?? "idle";

  return (
    <div className="space-y-6 fade-in-soft">
      <section className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold mb-1">Live Bot Overview</h2>
          <p className="text-muted">
            Monitor uptime, current action and quickly start or stop your private bot.
          </p>
        </div>
        <div className="flex gap-3">
          <button
            className="btn-primary"
            onClick={handleStart}
            disabled={starting}
          >
            {starting ? "Starting…" : "Start Bot"}
          </button>
          <button className="btn-ghost" onClick={handleStop}>
            Stop
          </button>
        </div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <StatusCard
          title="Bot Status"
          value={prettyStatus.toUpperCase()}
          hint="Online status synced from backend"
        />
        <StatusCard
          title="Uptime"
          value={prettyUptime}
          hint="Time since last start"
        />
        <StatusCard
          title="Current Action"
          value={prettyAction || "Idle"}
          hint="Backend-reported current step"
        />
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="glass-soft p-4 rounded-2xl">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-semibold text-slate-100">
              Quick Insights
            </h3>
            <span className="text-[0.7rem] text-muted">Realtime</span>
          </div>
          <p className="text-[0.85rem] text-muted leading-relaxed">
            This dashboard is wired directly to your Render backend. Actions taken here call{" "}
            <span className="text-[var(--accent-strong)]">/bot/start</span>,{" "}
            <span className="text-[var(--accent-strong)]">/bot/stop</span> and{" "}
            <span className="text-[var(--accent-strong)]">/bot/status</span> to keep everything in sync.
          </p>
        </div>

        <div className="glass-soft p-4 rounded-2xl">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-semibold text-slate-100">
              Activity Snapshot
            </h3>
            <span className="text-[0.7rem] text-muted">Soft animation</span>
          </div>
          <p className="text-[0.85rem] text-muted leading-relaxed">
            Use the Logs and Accounts sections from the sidebar to inspect detailed actions and manage
            stored credentials in Supabase.
          </p>
        </div>
      </section>
    </div>
  );
}
