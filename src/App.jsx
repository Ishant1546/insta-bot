import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Settings, Terminal, Zap, RefreshCw } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

// ------------------- CONFIG -------------------
// CRITICAL: Replace this with your live Render API URL!
const API_URL = "https://insta-bot-dvds.onrender.com"; 

const THEMES = {
  Violet: "from-indigo-900 via-purple-900 to-slate-900",
  Rose: "from-rose-900 via-pink-900 to-slate-900",
  Emerald: "from-emerald-900 via-teal-900 to-slate-900",
  Gold: "from-yellow-900 via-amber-900 to-slate-900",
  Blue: "from-blue-900 via-cyan-900 to-slate-900",
};

// Global CSS Fix: Ensures all text in inputs and placeholders is white/light
const GlobalStyle = () => (
    <style>{`
        input, textarea {
          color: white !important;
        }
        ::placeholder { 
          color: rgba(255, 255, 255, 0.4);
        }
        /* Custom scrollbar for log viewer */
        .custom-scrollbar::-webkit-scrollbar {
            width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
            background: #2d3748; /* Dark track */
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
            background: #4a5568; /* Gray thumb */
            border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
            background: #718096; /* Lighter on hover */
        }
    `}</style>
);


export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [status, setStatus] = useState({ status: 'Action Ready', action: 'Click \'Run Action\' to test bot.' });
  const [logs, setLogs] = useState([]);
  const [theme, setTheme] = useState('Blue');
  const [isRunningAction, setIsRunningAction] = useState(false);
  
  // Polling Logic: Only fetch logs and status every 5 seconds
  const fetchLogsAndStatus = async () => {
    try {
      const logRes = await axios.get(`${API_URL}/logs`);
      setLogs(logRes.data);
      const statusRes = await axios.get(`${API_URL}/status`);
      setStatus(statusRes.data);
    } catch (e) {
      console.error("Backend offline or unreachable.");
    }
  };

  useEffect(() => {
    fetchLogsAndStatus(); // Initial fetch
    const interval = setInterval(fetchLogsAndStatus, 5000); 
    return () => clearInterval(interval);
  }, []); 

  const handleRunAction = async () => {
    if (isRunningAction) return;

    setIsRunningAction(true);
    setStatus({ status: 'Running Action...', action: 'Playwright is executing synchronously.' });
    toast('Triggering synchronous action...', { icon: '🤖' });

    try {
      // Hits the new synchronous endpoint
      await axios.post(`${API_URL}/bot/run_action`);
      toast.success("Action completed! Check logs.");
    } catch (e) { 
      toast.error(e.response?.data?.detail || "Action failed. Check API console."); 
    } finally {
      setIsRunningAction(false);
      fetchLogsAndStatus(); // Fetch final logs immediately
    }
  };

  const handleRefreshLogs = () => {
      fetchLogsAndStatus();
      toast.success("Logs Refreshed.");
  }

  return (
    <div className={`min-h-screen bg-gradient-to-br ${THEMES[theme]} text-white font-sans overflow-hidden relative`}>
      <GlobalStyle />
      <Toaster position="bottom-right" toastOptions={{ style: { background: '#333', color: '#fff' } }} />
      
      {/* Background Blobs (for premium glow effect) */}
      <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
      <div className="absolute top-0 -right-4 w-72 h-72 bg-yellow-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>

      <div className="container mx-auto p-6 relative z-10 h-screen flex flex-col">
        {/* Header */}
        <header className="flex justify-between items-center mb-8 glass-panel p-4 rounded-xl">
          <div className="flex items-center gap-3">
            <div className={`w-3 h-3 rounded-full ${isRunningAction ? 'bg-yellow-400 animate-pulse' : 'bg-green-400'}`}></div>
            <h1 className="text-xl font-bold tracking-wider">SIMPLIFIED BOT CONTROLLER</h1>
          </div>
          <div className="flex gap-2">
            {['dashboard', 'settings'].map(tab => (
              <button 
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-lg transition-all capitalize ${activeTab === tab ? 'bg-white/20 shadow-lg font-semibold' : 'hover:bg-white/10'}`}
              >
                {tab}
              </button>
            ))}
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 grid gap-6 grid-cols-1 md:grid-cols-12 overflow-hidden">
          
          {/* Main Panel */}
          <div className="md:col-span-8 flex flex-col gap-6 h-full">
            <AnimatePresence mode="wait">
              {activeTab === 'dashboard' && (
                <motion.div key="dashboard" initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 50 }} transition={{ duration: 0.3 }} className="h-full">
                  <DashboardView 
                    status={status} 
                    onRunAction={handleRunAction} 
                    isRunningAction={isRunningAction}
                    onRefreshLogs={handleRefreshLogs}
                  />
                </motion.div>
              )}
              {activeTab === 'settings' && (
                <motion.div key="settings" initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 50 }} transition={{ duration: 0.3 }} className="h-full">
                  <SettingsView currentTheme={theme} setTheme={setTheme} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Logs Panel (Always Visible on Desktop) */}
          <div className="md:col-span-4 h-full">
             <LogViewer logs={logs} />
          </div>
        </div>
      </div>
    </div>
  );
}

// ------------------- SUB COMPONENTS -------------------

function DashboardView({ status, onRunAction, isRunningAction, onRefreshLogs }) {
  return (
    <div className="flex flex-col gap-6 h-full">
      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4">
        <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="glass-panel p-6 flex flex-col justify-between h-40">
            <div className="flex items-center gap-2 text-gray-400"><Zap size={18} /> CURRENT STATUS</div>
            <div className="text-3xl font-light uppercase">{status.status}</div>
            <div className="text-sm text-gray-400 truncate">{status.action}</div>
        </motion.div>
        <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} transition={{ delay: 0.1 }} className="glass-panel p-6 flex flex-col justify-between h-40">
            <div className="flex items-center gap-2 text-gray-400"><Terminal size={18} /> ACTIONS</div>
            <button 
                onClick={onRefreshLogs}
                className="px-4 py-2 bg-indigo-500/20 border border-indigo-500/50 rounded-lg hover:bg-indigo-500/30 transition-all text-sm font-semibold flex items-center justify-center gap-2 mt-4"
            >
                <RefreshCw size={16} /> Refresh Logs
            </button>
            <div className="text-xs text-gray-500">Manual log fetch from API.</div>
        </motion.div>
      </div>

      {/* Control Center */}
      <div className="glass-panel p-8 flex items-center justify-center gap-8 flex-1">
        <button 
          onClick={onRunAction} 
          disabled={isRunningAction} 
          className={`group relative px-10 py-6 text-xl rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden shadow-lg w-full max-w-sm
            ${isRunningAction ? 'bg-yellow-600/50 border border-yellow-500/50 text-white animate-pulse' : 'bg-green-500/30 border border-green-500/50 hover:bg-green-500/40 hover:shadow-green-500/50'}
          `}
        >
          <div className="flex items-center justify-center gap-3">
             <Zap size={28} className={isRunningAction ? 'animate-spin-slow' : ''} /> 
             <span className="font-bold">{isRunningAction ? 'ACTION IN PROGRESS...' : 'RUN SINGLE ACTION'}</span>
          </div>
        </button>
      </div>
    </div>
  );
}

function LogViewer({ logs }) {
  const endRef = useRef(null);
  // Auto-scroll when logs change
  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [logs]);

  return (
    <div className="glass-panel h-full p-4 flex flex-col">
      <h3 className="text-xs font-bold tracking-widest text-gray-400 mb-4 uppercase flex items-center gap-2">
        <Terminal size={14} /> System Logs
      </h3>
      <div className="flex-1 overflow-y-auto font-mono text-xs space-y-2 pr-2 custom-scrollbar">
        {logs.length === 0 && <div className="text-gray-600 italic">No logs yet. Click 'Run Action' to begin.</div>}
        {logs.map((log, i) => (
          <motion.div 
            key={i} 
            initial={{ opacity: 0, y: 10 }} 
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.1 }}
            className="border-l-2 border-white/10 pl-2 py-0.5 text-white/80"
          >
            {log}
          </motion.div>
        ))}
        <div ref={endRef} />
      </div>
    </div>
  );
}

function SettingsView({ currentTheme, setTheme }) {
    
    // Theme options remain
    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-panel p-6 h-full flex flex-col">
          <h2 className="text-xl mb-6 flex items-center gap-2"><Settings size={20} /> Interface Settings</h2>

          {/* Theme Selector */}
          <div className="mb-8">
            <h3 className="text-gray-300 mb-3 font-semibold">1. Interface Theme</h3>
            <div className="grid grid-cols-5 gap-3">
                {Object.keys(THEMES).map(t => (
                  <button 
                    key={t}
                    onClick={() => setTheme(t)}
                    className={`h-16 rounded-xl border-2 transition-all shadow-md ${currentTheme === t ? 'border-white scale-105 shadow-xl ring-2 ring-white/50' : 'border-transparent opacity-70 hover:opacity-100'} bg-gradient-to-br ${THEMES[t]}`}
                  >
                    <span className="font-bold text-sm">{t}</span>
                  </button>
                ))}
            </div>
          </div>
          
          <div className="flex-1 space-y-6 pt-4 border-t border-white/10">
              {/* API URL Display */}
              <div>
                  <h3 className="text-gray-300 mb-2 font-semibold">2. Backend URL (Read-Only)</h3>
                  <div className="bg-black/30 p-3 rounded-lg font-mono text-sm text-gray-500">
                     {API_URL}
                  </div>
              </div>
          </div>
          <p className="text-sm text-gray-500 mt-4">Note: The system is optimized for quick, one-off synchronous actions to comply with free-tier resource limits.</p>
        </motion.div>
      );
}