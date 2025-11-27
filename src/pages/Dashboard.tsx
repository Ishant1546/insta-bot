
import StatusCard from "../components/cards/StatusCard";

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <h1 className="text-4xl font-bold">Dashboard</h1>

      <div className="grid grid-cols-3 gap-6">
        <StatusCard title="Bot Status" value="Online" />
        <StatusCard title="Uptime" value="0s" />
        <StatusCard title="Current Action" value="Idle" />
      </div>

      <button className="px-6 py-3 bg-cyan-600 hover:bg-cyan-700 rounded-xl mt-6">
        Start Bot
      </button>
    </div>
  );
}
