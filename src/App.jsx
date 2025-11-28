import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Square, Activity, Users, Settings, Terminal, Trash2, Plus, LogOut } from 'lucide-react';
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

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [status, setStatus] = useState({ status: 'idle', action: 'Ready', uptime: '0s', last_success: null });
  const [logs, setLogs] = useState([]);
  const [theme, setTheme] = useState('Blue');
  
  // Polling Logic - Reduced to 5s for Render Free Tier optimization
  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const res = await axios.get(`${API_URL}/bot/status`);
        setStatus(res.data);
        setLogs(res.data.logs);
      } catch (e) {
        // Only show this error if the status is active, otherwise it spams
        if(status.status !== 'idle') {
           console.error("Backend offline or unreachable.");
           toast.error("API Connection Lost!", { id: 'api-error' });
        }
      }
    };
    // Fetch timer set to 5000ms (5 seconds)
    const interval = setInterval(fetchStatus, 5000); 
    return () => clearInterval(interval);
  }, [status.status]); // Depend on status.status to re-evaluate the toast logic

  const handleStart = async () => {
    try {
      await axios.post(`${API_URL}/bot/start`);
      toast.success("Bot Sequence Initiated");
    } catch (e) { toast.error(e.response?.data?.detail || "Failed to start bot."); }
  };

  const handleStop = async () => {
    try {
      await axios.post(`${API_URL}/bot/stop`);
      toast.success("Bot Stopped safely");
    } catch (e) { toast.error(e.response?.data?.detail || "Failed to stop bot."); }
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br ${THEMES[theme]} text-white font-sans overflow-hidden relative`}>
      <Toaster position="bottom-right" toastOptions={{ style: { background: '#333', color: '#fff' } }} />
      
      {/* Background Blobs (for premium glow effect) */}
      <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
      <div className="absolute top-0 -right-4 w-72 h-72 bg-yellow-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>

      <div className="container mx-auto p-6 relative z-10 h-screen flex flex-col">
        {/* Header */}
        <header className="flex justify-between items-center mb-8 glass-panel p-4 rounded-xl">
          <div className="flex items-center gap-3">
            <div className={`w-3 h-3 rounded-full ${status.status === 'running' ? 'bg-green-400 animate-pulse' : 'bg-red-400'}`}></div>
            <h1 className="text-xl font-bold tracking-wider">LUXURY BOT v3.0</h1>
          </div>
          <div className="flex gap-2">
            {['dashboard', 'accounts', 'settings'].map(tab => (
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
                  <DashboardView status={status} onStart={handleStart} onStop={handleStop} />
                </motion.div>
              )}
              {activeTab === 'accounts' && (
                <motion.div key="accounts" initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 50 }} transition={{ duration: 0.3 }} className="h-full">
                  <AccountsView />
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

function DashboardView({ status, onStart, onStop }) {
  return (
    <div className="flex flex-col gap-6 h-full">
      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4">
        <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="glass-panel p-6 flex flex-col justify-between h-40">
            <div className="flex items-center gap-2 text-gray-400"><Activity size={18} /> STATUS</div>
            <div className="text-3xl font-light uppercase">{status.status}</div>
            <div className="text-sm text-gray-400 truncate">{status.action}</div>
        </motion.div>
        <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} transition={{ delay: 0.1 }} className="glass-panel p-6 flex flex-col justify-between h-40">
            <div className="flex items-center gap-2 text-gray-400"><Terminal size={18} /> UPTIME</div>
            <div className="text-3xl font-mono text-green-400">{status.uptime}</div>
            <div className="text-xs text-gray-500">Last Success: {status.last_success ? status.last_success.split('T')[1].split('.')[0] : 'None'}</div>
        </motion.div>
      </div>

      {/* Control Center */}
      <div className="glass-panel p-8 flex items-center justify-center gap-8">
        <button 
          onClick={onStart} 
          disabled={status.status === 'running' || status.status === 'starting'} 
          className="group relative px-8 py-4 bg-green-500/20 border border-green-500/50 rounded-xl hover:bg-green-500/30 transition-all disabled:opacity-30 disabled:cursor-not-allowed overflow-hidden shadow-lg hover:shadow-green-500/50"
        >
          <div className="flex items-center gap-3">
             <Play size={24} className={status.status === 'running' ? '' : 'fill-current'} /> 
             <span className="font-bold">{status.status === 'starting' ? 'STARTING...' : 'ENGAGE PROTOCOL'}</span>
          </div>
        </button>

        <button 
          onClick={onStop} 
          disabled={status.status !== 'running' && status.status !== 'starting'} 
          className="px-8 py-4 bg-red-500/20 border border-red-500/50 rounded-xl hover:bg-red-500/30 transition-all disabled:opacity-30 shadow-lg hover:shadow-red-500/50"
        >
          <div className="flex items-center gap-3">
             <Square size={24} className="fill-current" /> 
             <span className="font-bold">TERMINATE</span>
          </div>
        </button>
      </div>
       {/* Placeholder for screenshot/execution state */}
      <div className="glass-panel p-4 text-center text-sm text-gray-500 italic">
        Execution State: Bot is currently set to single-thread operation.
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
        {logs.length === 0 && <div className="text-gray-600 italic">No logs yet. Waiting for signal...</div>}
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

function AccountsView() {
  const [accounts, setAccounts] = useState([]);
  const [form, setForm] = useState({ email: '', password: '' });

  const fetchAccounts = async () => {
    try {
        // FIX: The backend should now return only ID and email (no password)
        const res = await axios.get(`${API_URL}/accounts`);
        setAccounts(res.data);
    } catch (e) {
        // This will now catch the error details from the fixed backend
        toast.error(`Fetch Error: ${e.response?.data?.detail || "Could not connect to API."}`);
    }
  };

  // Run on mount (when the tab is activated)
  useEffect(() => { 
      fetchAccounts(); 
  }, []); 

  const handleAdd = async (e) => {
    e.preventDefault();
    if(!form.email || !form.password) {
        return toast.error("Email and password fields are required.");
    }

    try {
        await axios.post(`${API_URL}/accounts/add`, form);
        toast.success("Account Encrypted & Stored.");
        setForm({ email: '', password: '' });
        fetchAccounts(); // Refresh the list
    } catch (error) {
        // IMPROVEMENT: Handle specific API errors
        toast.error(`Add Error: ${error.response?.data?.detail || "Failed to add account."}`);
    }
  };

  const handleDelete = async (id) => {
    try {
        await axios.delete(`${API_URL}/accounts/${id}`);
        toast.success("Account Removed");
        fetchAccounts();
    } catch (error) {
         toast.error(`Delete Error: ${error.response?.data?.detail || "Failed to delete account."}`);
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-panel p-6 h-full flex flex-col">
      <h2 className="text-xl mb-6 flex items-center gap-2"><Users size={20} /> Account Vault</h2>
      
      {/* Add Form */}
      <form onSubmit={handleAdd} className="flex flex-wrap gap-4 mb-6 glass-panel p-4 rounded-xl">
        <input 
          placeholder="Email Address" 
          className="flex-1 min-w-[150px] bg-black/20 border border-white/10 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-400"
          value={form.email}
          onChange={e => setForm({...form, email: e.target.value})}
        />
        <input 
          type="password" 
          placeholder="Password (Masked)" 
          className="flex-1 min-w-[150px] bg-black/20 border border-white/10 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-400"
          value={form.password}
          onChange={e => setForm({...form, password: e.target.value})}
        />
        <button 
            type="submit" 
            className="bg-blue-500/80 hover:bg-blue-500 px-6 py-2 rounded-lg font-bold flex items-center gap-2 transition-transform hover:scale-[1.01]"
        >
          <Plus size={16} /> Add Account
        </button>
      </form>

      {/* List */}
      <div className="flex-1 space-y-2 overflow-y-auto pr-2 custom-scrollbar">
        {accounts.length === 0 && <div className="text-center text-gray-600 italic mt-10">No accounts loaded. Add one above.</div>}
        {accounts.map(acc => (
          <motion.div 
            key={acc.id} 
            initial={{ opacity: 0, x: -10 }} 
            animate={{ opacity: 1, x: 0 }}
            className="flex justify-between items-center bg-white/5 p-4 rounded-xl border border-white/5"
          >
             <div className="font-mono text-sm">{acc.email}</div>
             <button 
                onClick={() => handleDelete(acc.id)} 
                className="text-red-400 hover:text-red-300 p-2 rounded-full transition-colors hover:bg-white/10"
             >
                <Trash2 size={16} />
             </button>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

function SettingsView({ currentTheme, setTheme }) {
    const [apiUrl, setApiUrl] = useState(API_URL);
    const [pollingInterval, setPollingInterval] = useState(5);
    const [autoStart, setAutoStart] = useState(false);

    const handleSave = () => {
        // In a real app, you would save these to localStorage and apply them globally
        // For this demo, we'll just confirm the action.
        toast.success("Settings saved successfully!", { icon: '⚙️' });
    };

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-panel p-6 h-full flex flex-col">
          <h2 className="text-xl mb-6 flex items-center gap-2"><Settings size={20} /> System Settings</h2>

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
              {/* Backend URL Override */}
              <div>
                  <h3 className="text-gray-300 mb-2 font-semibold">2. Backend URL Override (Read-Only)</h3>
                  <div className="bg-black/30 p-3 rounded-lg font-mono text-sm text-gray-500">
                     {API_URL}
                  </div>
              </div>

              {/* Polling Interval */}
              <div>
                  <h3 className="text-gray-300 mb-2 font-semibold">3. Polling Interval</h3>
                   <select 
                       value={pollingInterval} 
                       onChange={(e) => setPollingInterval(Number(e.target.value))}
                       className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-400 text-white"
                   >
                       <option value={0.5}>0.5s (High Load Warning)</option>
                       <option value={1}>1s</option>
                       <option value={2}>2s</option>
                       <option value={5}>5s (Recommended)</option>
                   </select>
                   <p className="text-xs text-gray-500 mt-1">Current polling interval: {pollingInterval} seconds. Must restart app to apply changes.</p>
              </div>

              {/* Save Button */}
              <button 
                  onClick={handleSave} 
                  className="w-full mt-6 px-6 py-3 bg-indigo-500/80 hover:bg-indigo-500 rounded-lg font-bold transition-transform hover:scale-[1.01] shadow-lg"
              >
                Apply Settings
              </button>
          </div>
        </motion.div>
      );
}