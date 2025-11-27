import { useEffect } from "react";

export default function Toast({
  msg,
  clear,
}: {
  msg: string;
  clear: () => void;
}) {
  useEffect(() => {
    if (!msg) return;
    const t = setTimeout(clear, 2500);
    return () => clearTimeout(t);
  }, [msg]);

  if (!msg) return null;

  return (
    <div className="fixed bottom-6 right-6 z-[2000] glass-panel px-5 py-3 rounded-xl fade-in-soft">
      {msg}
    </div>
  );
}
