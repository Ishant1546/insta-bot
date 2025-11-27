import { useEffect } from "react";

export default function Toast({ msg, clear }: { msg: string; clear: () => void }) {
  useEffect(() => {
    const t = setTimeout(clear, 2500);
    return () => clearTimeout(t);
  }, []);

  if (!msg) return null;

  return (
    <div className="fixed bottom-6 right-6 glass-panel px-5 py-3 rounded-xl z-[2000] fade-in-soft">
      {msg}
    </div>
  );
}
