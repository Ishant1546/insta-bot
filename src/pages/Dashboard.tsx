export default function Dashboard() {
  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-4xl font-bold mb-6">Bot Dashboard</h1>

      <div className="bg-white/10 backdrop-blur-lg p-6 rounded-xl shadow-lg border border-white/10">
        <h2 className="text-2xl font-semibold mb-4">Status</h2>

        <div className="space-y-2">
          <p>Bot: <span className="text-green-400">Online</span></p>
          <p>Uptime: 0s</p>
          <p>Current Action: Idle</p>
        </div>

        <button className="mt-5 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg">
          Start Bot
        </button>
      </div>
    </div>
  );
}
