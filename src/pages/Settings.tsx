export default function Settings() {
  return (
    <div className="space-y-4 fade-in-soft">
      <div>
        <h2 className="text-2xl font-semibold mb-1">Panel Settings</h2>
        <p className="text-muted">
          Theme selection is available from the top bar. Additional configuration hooks can be wired here later.
        </p>
      </div>

      <div className="glass-soft p-4 rounded-2xl text-[0.85rem] text-muted">
        <p>
          This page is a placeholder for future controls: toggling auto-start behaviors, tweaking
          polling intervals, or adding manual triggers you may need for your private workflows.
        </p>
      </div>
    </div>
  );
}
