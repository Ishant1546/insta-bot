
import { Link } from "react-router-dom";

export default function Sidebar() {
  return (
    <div className="w-60 fixed left-0 top-0 h-screen glass">
      <h1 className="text-2xl font-bold mb-6">Bot Panel</h1>
      <nav className="space-y-4">
        <Link to="/" className="block hover:text-[var(--accent)]">Dashboard</Link>
        <Link to="/logs" className="block hover:text-[var(--accent)]">Logs</Link>
        <Link to="/accounts" className="block hover:text-[var(--accent)]">Accounts</Link>
        <Link to="/settings" className="block hover:text-[var(--accent)]">Settings</Link>
      </nav>
    </div>
  );
}
