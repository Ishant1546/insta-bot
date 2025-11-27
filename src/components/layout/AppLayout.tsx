import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import type { ReactNode } from "react";

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex">
      <Sidebar />
      <main className="ml-60 flex-1 px-7 py-6">
        <Navbar />
        {children}
      </main>
    </div>
  );
}
