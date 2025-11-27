
export default function StatusCard({ title, value }) {
  return (
    <div className="glass p-5 rounded-xl">
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-2xl" style={{color:"var(--accent)"}}>{value}</p>
    </div>
  );
}
