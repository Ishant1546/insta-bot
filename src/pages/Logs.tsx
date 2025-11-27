import { useEffect, useRef, useState } from "react";
import { api } from "../services/api";

export default function Logs() {
  const [logs, setLogs] = useState<string[]>([]);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  // Auto-scroll function
  const scrollToBottom = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  };

  // Poll logs every second
  useEffect(() => {
    const interval = setInterval(async () => {
      const res = await api.logs();
      const updated = res?.logs ?? [];

      // Only auto-scroll if new logs came
      if (updated.length !== logs.length) {
        setLogs(updated);
        setTimeout(scrollToBottom, 100);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [logs]);

  return (
    <div className="fade-in-soft">
      <h1 className="text-3xl font-bold mb-6">Bot Logs</h1>

      {/* Glass scroll container */}
      <div
        ref={scrollRef}
        className="glass-scroll mt-4 rounded-xl border border-slate-700/40"
        style={{ height: "480px" }}
      >
        {logs.length === 0 && (
          <div className="text-muted text-center mt-10">No logs yet…</div>
        )}

        {logs.map((line, i) => (
          <div
            key={i}
            className="flex items-start gap-3 py-2 fade-in-soft"
          >
            <div className="w-2 h-2 rounded-full bg-[var(--lux-accent)] mt-2 shadow-lg" />

            <div className="text-sm leading-relaxed">
              {line}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
