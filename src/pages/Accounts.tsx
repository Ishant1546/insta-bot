import { useEffect, useState } from "react";
import { api } from "../services/api";

interface Account {
  id: string;
  email: string;
  password: string;
}

export default function Accounts() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [open, setOpen] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function load() {
    const res = await api.accounts();
    setAccounts(res.accounts || []);
  }

  async function add() {
    if (!email || !password) return;
    await api.addAccount({ email, password });
    setOpen(false);
    setEmail("");
    setPassword("");
    load();
  }

  async function remove(id: string) {
    await api.deleteAccount(id);
    load();
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="fade-in-soft">
      <h1 className="text-3xl font-bold mb-8">Accounts</h1>

      <button
        onClick={() => setOpen(true)}
        className="btn-primary mb-5"
      >
        ➕ Add Account
      </button>

      {/* Account List */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {accounts.map((acc) => (
          <div
            key={acc.id}
            className="glass-panel p-6 rounded-xl flex flex-col gap-2"
          >
            <div className="text-lg font-semibold">{acc.email}</div>
            <div className="text-muted text-sm">••••••••••</div>

            <button
              onClick={() => remove(acc.id)}
              className="btn-ghost text-red-400 mt-2"
            >
              🗑 Delete
            </button>
          </div>
        ))}

        {accounts.length === 0 && (
          <div className="text-muted">No accounts added yet…</div>
        )}
      </div>

      {/* Glass Add Modal */}
      {open && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center fade-in-soft z-[999]">
          <div className="glass-panel p-8 w-96 rounded-2xl z-[1000]">
            <h2 className="text-xl font-semibold mb-4">Add New Account</h2>

            <input
              className="w-full p-3 mb-3 rounded-lg bg-slate-800/50 border border-slate-600 outline-none"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <input
              className="w-full p-3 mb-5 rounded-lg bg-slate-800/50 border border-slate-600 outline-none"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <div className="flex gap-3 justify-end">
              <button
                className="btn-ghost"
                onClick={() => setOpen(false)}
              >
                Cancel
              </button>

              <button
                className="btn-primary"
                onClick={add}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
