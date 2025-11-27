
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

export default function AppLayout({ children }) {
  return (
    <div className="flex">
      <Sidebar />
      <div className="ml-60 w-full p-6">
        <Navbar />
        {children}
      </div>
    </div>
  );
}
