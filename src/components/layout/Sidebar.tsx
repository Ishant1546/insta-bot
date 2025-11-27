
import { Link } from "react-router-dom";

export default function Sidebar() {
  return (
    <div className="w-60 h-screen fixed top-0 left-0 glass p-6">
      <h1 className="text-2xl font-bold mb-6">Bot Panel</h1>
      <nav className="space-y-4">
        <Link to="/" className="block hover:text-cyan-300">Dashboard</Link>
        <Link to="/logs" className="block hover:text-cyan-300">Logs</Link>
        <Link to="/accounts" className="block hover:text-cyan-300">Accounts</Link>
        <Link to="/settings" className="block hover:text-cyan-300">Settings</Link>
      </nav>
    </div>
  );
}
