type Props = {
  title: string;
  value: string;
  hint?: string;
};

export default function StatusCard({ title, value, hint }: Props) {
  return (
    <div className="glass-soft p-4 rounded-2xl border border-slate-600/50 shadow-[0_16px_40px_rgba(15,23,42,0.92)] hover:border-[var(--accent-soft)] hover:shadow-[0_20px_50px_rgba(15,23,42,0.98)] transition-all duration-200">
      <div className="text-xs uppercase tracking-[0.16em] text-muted mb-2">
        {title}
      </div>
      <div className="text-2xl font-semibold mb-1 text-slate-50">
        {value}
      </div>
      {hint && <div className="text-[0.75rem] text-muted">{hint}</div>}
    </div>
  );
}
