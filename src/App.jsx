import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Square, Activity, Users, Settings, Terminal, Trash2, Plus } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

// ------------------- CONFIG -------------------
// In production, set this to your Render URL via .env
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
  const [accounts, setAccounts] = useState([]);
  const [theme, setTheme] = useState('Blue');
  const [showModal, setShowModal] = useState(false);
  
  // Polling Logic
  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const res = await axios.get(`${API_URL}/bot/status`);
        setStatus(res.data);
        setLogs(res.data.logs);
      } catch (e) {
        console.error("Backend offline");
      }
    };
    const interval = setInterval(fetchStatus, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleStart = async () => {
    try {
      await axios.post(`${API_URL}/bot/start`);
      toast.success("Bot Sequence Initiated");
    } catch (e) { toast.error("Failed to start"); }
  };

  const handleStop = async () => {
    try {
      await axios.post(`${API_URL}/bot/stop`);
      toast.success("Bot Stopped safely");
    } catch (e) { toast.error("Failed to stop"); }
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br ${THEMES[theme]} text-white font-sans overflow-hidden relative`}>
      <Toaster position="bottom-right" toastOptions={{ style: { background: '#333', color: '#fff' } }} />
      
      {/* Background Blobs */}
      <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
      <div className="absolute top-0 -right-4 w-72 h-72 bg-yellow-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>

      <div className="container mx-auto p-6 relative z-10 h-screen flex flex-col">
        {/* Header */}
        <header className="flex justify-between items-center mb-8 glass-panel p-4">
          <div className="flex items-center gap-3">
            <div className={`w-3 h-3 rounded-full ${status.status === 'running' ? 'bg-green-400 animate-pulse' : 'bg-red-400'}`}></div>
            <h1 className="text-xl font-bold tracking-wider">LUXURY BOT v3.0</h1>
          </div>
          <div className="flex gap-2">
            {['dashboard', 'accounts', 'settings'].map(tab => (
              <button 
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-lg transition-all capitalize ${activeTab === tab ? 'bg-white/10 shadow-lg' : 'hover:bg-white/5'}`}
              >
                {tab}
              </button>
            ))}
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 grid gap-6 grid-cols-1 md:grid-cols-12 overflow-hidden">
          
          {/* Main Panel */}
          <div className="md:col-span-8 flex flex-col gap-6">
            {activeTab === 'dashboard' && (
              <DashboardView 
                status={status} 
                onStart={handleStart} 
                onStop={handleStop} 
              />
            )}
            {activeTab === 'accounts' && <AccountsView />}
            {activeTab === 'settings' && <SettingsView currentTheme={theme} setTheme={setTheme} />}
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
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4">
        <div className="glass-panel p-6 flex flex-col justify-between h-40">
            <div className="flex items-center gap-2 text-gray-400"><Activity size={18} /> STATUS</div>
            <div className="text-3xl font-light uppercase">{status.status}</div>
            <div className="text-sm text-gray-400">{status.action}</div>
        </div>
        <div className="glass-panel p-6 flex flex-col justify-between h-40">
            <div className="flex items-center gap-2 text-gray-400"><Terminal size={18} /> UPTIME</div>
            <div className="text-3xl font-mono text-green-400">{status.uptime}</div>
            <div className="text-xs text-gray-500">Last Success: {status.last_success ? status.last_success.split('T')[1].split('.')[0] : 'None'}</div>
        </div>
      </div>

      {/* Control Center */}
      <div className="glass-panel p-8 flex items-center justify-center gap-8">
        <button onClick={onStart} disabled={status.status === 'running'} className="group relative px-8 py-4 bg-green-500/20 border border-green-500/50 rounded-xl hover:bg-green-500/30 transition-all disabled:opacity-30 disabled:cursor-not-allowed overflow-hidden">
          <div className="flex items-center gap-3">
             <Play size={24} className={status.status === 'running' ? '' : 'fill-current'} /> 
             <span className="font-bold">ENGAGE PROTOCOL</span>
          </div>
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:animate-shimmer" />
        </button>

        <button onClick={onStop} disabled={status.status !== 'running'} className="px-8 py-4 bg-red-500/20 border border-red-500/50 rounded-xl hover:bg-red-500/30 transition-all disabled:opacity-30">
          <div className="flex items-center gap-3">
             <Square size={24} className="fill-current" /> 
             <span className="font-bold">TERMINATE</span>
          </div>
        </button>
      </div>
    </motion.div>
  );
}

function LogViewer({ logs }) {
  const endRef = useRef(null);
  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [logs]);

  return (
    <div className="glass-panel h-full p-4 flex flex-col">
      <h3 className="text-xs font-bold tracking-widest text-gray-400 mb-4 uppercase flex items-center gap-2">
        <Terminal size={14} /> System Logs
      </h3>
      <div className="flex-1 overflow-y-auto font-mono text-xs space-y-2 pr-2">
        {logs.length === 0 && <div className="text-gray-600 italic">Waiting for signal...</div>}
        {logs.map((log, i) => (
          <div key={i} className="border-l-2 border-white/10 pl-2 py-1 hover:bg-white/5 rounded-r transition-colors">
            {log}
          </div>
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
        const res = await axios.get(`${API_URL}/accounts`);
        setAccounts(res.data);
    } catch (e) {
        toast.error("Failed to fetch accounts from DB.");
    }
  };

  // FIX: Fetch accounts ONCE when the component loads (when the tab is active)
  useEffect(() => { 
      fetchAccounts(); 
  }, []); // Empty dependency array means run once on mount

  const handleAdd = async (e) => {
    e.preventDefault();
    if(!form.email || !form.password) {
        return toast.error("Email and password fields are required.");
    }

    try {
        // FIX: Ensure API response handles errors and success correctly
        await axios.post(`${API_URL}/accounts/add`, form);
        toast.success("Account Encrypted & Stored.");
        setForm({ email: '', password: '' });
        fetchAccounts(); // Refresh the list
    } catch (error) {
        // IMPROVEMENT: Handle specific API errors
        if (error.response && error.response.data && error.response.data.detail) {
             toast.error(`Add Error: ${error.response.data.detail}`);
        } else {
             toast.error("Failed to add account. Check backend console.");
        }
    }
  };

  const handleDelete = async (id) => {
    await axios.delete(`${API_URL}/accounts/${id}`);
    toast.success("Account Removed");
    fetchAccounts();
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-panel p-6">
      <h2 className="text-xl mb-6">Account Vault</h2>
      
      {/* Add Form */}
      <form onSubmit={handleAdd} className="flex gap-4 mb-8">
        <input 
          placeholder="Email Address" 
          className="flex-1 bg-black/20 border border-white/10 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-400"
          value={form.email}
          onChange={e => setForm({...form, email: e.target.value})}
        />
        <input 
          type="password" 
          placeholder="Password" 
          className="flex-1 bg-black/20 border border-white/10 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-400"
          value={form.password}
          onChange={e => setForm({...form, password: e.target.value})}
        />
        <button type="submit" className="bg-blue-500/80 hover:bg-blue-500 px-6 rounded-lg font-bold flex items-center gap-2">
          <Plus size={16} /> Add
        </button>
      </form>

      {/* List */}
      <div className="space-y-2 max-h-[400px] overflow-y-auto">
        {accounts.map(acc => (
          <div key={acc.id} className="flex justify-between items-center bg-white/5 p-4 rounded-lg border border-white/5">
             <div className="font-mono">{acc.email}</div>
             <button onClick={() => handleDelete(acc.id)} className="text-red-400 hover:text-red-300 p-2"><Trash2 size={16} /></button>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

function SettingsView({ currentTheme, setTheme }) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-panel p-6">
      <h2 className="text-xl mb-6">Visual Interface</h2>
      <div className="grid grid-cols-5 gap-4">
        {Object.keys(THEMES).map(t => (
          <button 
            key={t}
            onClick={() => setTheme(t)}
            className={`h-24 rounded-xl border-2 transition-all ${currentTheme === t ? 'border-white scale-105 shadow-xl' : 'border-transparent opacity-60 hover:opacity-100'} bg-gradient-to-br ${THEMES[t]}`}
          >
            <span className="font-bold text-shadow">{t}</span>
          </button>
        ))}
      </div>
      
      <div className="mt-8 border-t border-white/10 pt-6">
          <h3 className="text-gray-400 mb-4">Backend Connection</h3>
          <div className="bg-black/30 p-4 rounded-lg font-mono text-sm text-gray-500">
             Current Endpoint: {API_URL}
          </div>
      </div>
    </motion.div>
  );
}