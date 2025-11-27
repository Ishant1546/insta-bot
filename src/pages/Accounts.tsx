import { useEffect, useState } from "react";
import { getAccounts } from "../services/api";

type Account = {
  id?: string;
  email?: string;
  created_at?: string;
};

export default function Accounts() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    const fetchAccounts = async () => {
      setLoading(true);
      const data = await getAccounts();
      if (mounted && Array.isArray(data.accounts)) {
        setAccounts(data.accounts);
      }
      setLoading(false);
    };
    fetchAccounts();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="space-y-4 fade-in-soft">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-semibold mb-1">Stored Accounts</h2>
          <p className="text-muted">
            These entries are loaded from your Supabase <code>accounts</code> table.
          </p>
        </div>
        <button className="btn-ghost text-[0.78rem] opacity-80">
          Add / manage coming soon
        </button>
      </div>

      <div className="glass-soft p-3 rounded-2xl">
        <div className="border-b border-slate-700/60 px-2 pb-2 text-[0.75rem] text-muted flex justify-between">
          <span>Email</span>
          <span>Created</span>
        </div>
        <div className="glass-scroll mt-1 text-[0.8rem]">
          {loading && <div className="text-muted">Loading accounts…</div>}
          {!loading && accounts.length === 0 && (
            <div className="text-muted">No accounts yet. Insert rows into Supabase.</div>
          )}
          {accounts.map((acc) => (
            <div
              key={acc.id || acc.email}
              className="flex items-center justify-between border-b border-slate-700/35 last:border-none py-1.5 px-1"
            >
              <div className="truncate max-w-xs">{acc.email}</div>
              <div className="text-[0.7rem] text-muted">
                {acc.created_at ? new Date(acc.created_at).toLocaleString() : "--"}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
