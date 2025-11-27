import { useEffect, useState } from "react";
import { getLogs } from "../services/api";

export default function Logs() {
  const [logs, setLogs] = useState<string[]>([]);

  useEffect(() => {
    let mounted = true;
    const fetchLogs = async () => {
      const data = await getLogs();
      if (mounted && Array.isArray(data.logs)) {
        setLogs(data.logs);
      }
    };
    fetchLogs();
    const id = setInterval(fetchLogs, 1300);
    return () => {
      mounted = false;
      clearInterval(id);
    };
  }, []);

  return (
    <div className="space-y-4 fade-in-soft">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold mb-1">Live Log Stream</h2>
          <p className="text-muted">
            Every key action the bot takes is surfaced here in a scrollable console-style feed.
          </p>
        </div>
      </div>

      <div className="glass-scroll text-[0.8rem] leading-relaxed">
        {logs.length === 0 && (
          <div className="text-muted">No logs yet. Start the bot to see activity.</div>
        )}
        {logs.map((line, idx) => (
          <div
            key={idx}
            className="border-b border-slate-700/40 last:border-none py-1.5 flex gap-2"
          >
            <span className="mt-1 h-1 w-1 rounded-full bg-[var(--accent-soft)]" />
            <span className="whitespace-pre-wrap">{line}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
