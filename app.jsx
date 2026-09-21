const { useState, useEffect, useMemo } = React;

// Recharts components from window
const Recharts = window.Recharts || {};
const {
  PieChart, Pie, Cell, ResponsiveContainer, LineChart, Line,
  Tooltip, XAxis, YAxis, CartesianGrid, BarChart, Bar
} = Recharts;

// Icon SVG map for flawless rendering without bundle dependencies
const iconPaths = {
  LayoutDashboard: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 5a1 1 0 011-1h4a1 1 0 011 1v5a1 1 0 01-1 1H5a1 1 0 01-1-1V5zm10 0a1 1 0 011-1h4a1 1 0 011 1v2a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM4 15a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1v-4zm10-4a1 1 0 011-1h4a1 1 0 011 1v8a1 1 0 01-1 1h-4a1 1 0 01-1-1v-8z" />,
  ArrowLeftRight: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />,
  Landmark: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10zm3 3h2v5H7v-5zm4 0h2v5h-2v-5zm4 0h2v5h-2v-5z" />,
  PieChart: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z M20.488 9A9.002 9.002 0 0012 3.055V9h8.488z" />,
  Target: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />,
  TrendingUp: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />,
  FileText: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />,
  Lightbulb: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 01-2 2h-4a2 2 0 01-2-2v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />,
  BellRing: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />,
  Settings: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z" />,
  Wallet: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />,
  ArrowDownCircle: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13l-3 3m0 0l-3-3m3 3V8m0 13a9 9 0 110-18 9 9 0 010 18z" />,
  ArrowUpRight: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 17L17 7M17 7H7M17 7v10" />,
  Percent: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19l10-14M9 5a2 2 0 100 4 2 2 0 000-4zm10 10a2 2 0 100 4 2 2 0 000-4z" />,
  Bell: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />,
  ChevronDown: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />,
  MessageCircle: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />,
  Sparkles: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />,
  ArrowRight: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />,
  Info: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />,
  Plus: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />,
  Trash2: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />,
  Search: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />,
  Filter: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />,
  Moon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />,
  Sun: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />,
  Download: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />,
  X: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />,
  Check: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />,
  Send: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
};

function Icon({ name, size = 18, className = "" }) {
  const path = iconPaths[name] || iconPaths.Info;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      className={className}
    >
      {path}
    </svg>
  );
}

// Initial Data
const initialTransactions = [
  { id: 1, name: "Swiggy", cat: "Food & Snacks", date: "26 July ", amt: -245, color: "#FC8019", initial: "S" },
  { id: 2, name: "Pocket Money", cat: "Received from Home", date: "25 July 2026", amt: 3000, color: "#059669", initial: "₹" },
  { id: 3, name: "Campus Canteen", cat: "Food & Snacks", date: "24 July 2026", amt: -85, color: "#EA580C", initial: "C" },
  { id: 4, name: "Uber", cat: "Transportation", date: "24 July 2026", amt: -120, color: "#000000", initial: "U" },
  { id: 5, name: "Bookstore", cat: "Stationery", date: "23 July 2026", amt: -320, color: "#7C3AED", initial: "B" },
  { id: 6, name: "Zara Sale", cat: "Shopping", date: "22 July 2026", amt: -450, color: "#F59E0B", initial: "Z" },
  { id: 7, name: "Cinema Movie", cat: "Entertainment", date: "21 July 2026", amt: -380, color: "#EC4899", initial: "M" },
];

const categoryColors = {
  "Food & Snacks": "#4F46E5",
  "Transportation": "#10B981",
  "Shopping": "#F59E0B",
  "Entertainment": "#EC4899",
  "Stationery": "#8B5CF6",
  "Others": "#CBD5E1"
};

const navItems = [
  { icon: "LayoutDashboard", label: "Dashboard", active: true },
  { icon: "ArrowLeftRight", label: "Transactions" },
  { icon: "Landmark", label: "Accounts" },
  { icon: "PieChart", label: "Budgets" },
  { icon: "Target", label: "Goals" },
  { icon: "TrendingUp", label: "Savings" },
  { icon: "FileText", label: "Reports" },
  { icon: "Lightbulb", label: "Insights", badge: "New" },
  { icon: "BellRing", label: "Reminders" },
  { icon: "Settings", label: "Settings" },
];

const trendData = [
  { day: "Mon", balance: 5200 },
  { day: "Tue", balance: 5450 },
  { day: "Wed", balance: 6100 },
  { day: "Thu", balance: 5850 },
  { day: "Fri", balance: 6300 },
  { day: "Sat", balance: 7400 },
  { day: "Sun", balance: 7900 },
];

function StatCard({ icon, iconBg, iconColor, label, value, delta, up, sparkline }) {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700/60 shadow-sm p-5 flex flex-col justify-between transition-all hover:shadow-md">
      <div className="flex items-center gap-3 mb-4">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${iconBg}`}>
          <Icon name={icon} size={18} className={iconColor} />
        </div>
        <span className="text-slate-500 dark:text-slate-400 text-sm font-medium">{label}</span>
      </div>
      <div className="flex items-end justify-between">
        <div>
          <div className="text-2xl font-bold text-slate-800 dark:text-slate-100 tabular-nums">{value}</div>
          <div className={`text-xs font-medium flex items-center gap-1 mt-1 ${up ? "text-emerald-600 dark:text-emerald-400" : "text-rose-500 dark:text-rose-400"}`}>
            {up ? "↑" : "↓"} {delta}
          </div>
        </div>
        <svg width="70" height="32" viewBox="0 0 70 32" className="opacity-80">
          <polyline
            points={sparkline}
            fill="none"
            stroke={up ? "#10B981" : "#EF4444"}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </div>
  );
}

function MainApp() {
  // Persistence State
  const [transactions, setTransactions] = useState(() => {
    const saved = localStorage.getItem("fintrack_txs");
    return saved ? JSON.parse(saved) : initialTransactions;
  });

  const [activeTab, setActiveTab] = useState("Dashboard");
  const [range, setRange] = useState("This Week");
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("fintrack_dark") === "true";
  });

  // Modals & Drawers
  const [isAddTxOpen, setIsAddTxOpen] = useState(false);
  const [isAIChatOpen, setIsAIChatOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  // New Transaction Form State
  const [newTx, setNewTx] = useState({
    name: "",
    cat: "Food & Snacks",
    amt: "",
    type: "expense",
    date: new Date().toISOString().split("T")[0]
  });

  // AI Chat Messages
  const [aiChatInput, setAiChatInput] = useState("");
  const [aiMessages, setAiMessages] = useState([
    { sender: "ai", text: "Hi Sneha! 👋 I'm your AI Money Buddy. How can I help you budget or save money today?" }
  ]);

  // Goal Progress State
  const [goalSaved, setGoalSaved] = useState(1600);
  const goalTarget = 4000;

  // Dynamic Date Ranges
  const currentWeekRange = useMemo(() => {
    const now = new Date();
    const currentDay = now.getDay();
    const distanceToMonday = currentDay === 0 ? -6 : 1 - currentDay;
    const monday = new Date(now);
    monday.setDate(now.getDate() + distanceToMonday);
    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);

    const formatDayMonth = (d) => {
      const day = d.getDate();
      const month = d.toLocaleString('en-GB', { month: 'short' });
      return `${day} ${month}`;
    };

    return `${formatDayMonth(monday)} – ${formatDayMonth(sunday)} ${sunday.getFullYear()}`;
  }, []);

  const lastWeekRange = useMemo(() => {
    const now = new Date();
    const currentDay = now.getDay();
    const distanceToMonday = currentDay === 0 ? -6 : 1 - currentDay;
    const monday = new Date(now);
    monday.setDate(now.getDate() + distanceToMonday - 7);
    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);

    const formatDayMonth = (d) => {
      const day = d.getDate();
      const month = d.toLocaleString('en-GB', { month: 'short' });
      return `${day} ${month}`;
    };

    return `${formatDayMonth(monday)} – ${formatDayMonth(sunday)} ${sunday.getFullYear()}`;
  }, []);

  const currentMonthRange = useMemo(() => {
    return new Date().toLocaleString('en-GB', { month: 'long', year: 'numeric' });
  }, []);

  // Sync LocalStorage & Dark Mode
  useEffect(() => {
    localStorage.setItem("fintrack_txs", JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem("fintrack_dark", darkMode);
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  // Dynamic Spending Data calculation
  const spendingData = useMemo(() => {
    const categories = {
      "Food & Snacks": 0,
      "Transportation": 0,
      "Shopping": 0,
      "Entertainment": 0,
      "Stationery": 0,
      "Others": 0
    };

    transactions.forEach(t => {
      if (t.amt < 0) {
        const catKey = categories.hasOwnProperty(t.cat) ? t.cat : "Others";
        categories[catKey] += Math.abs(t.amt);
      }
    });

    return Object.keys(categories).map(cat => ({
      name: cat,
      value: categories[cat],
      color: categoryColors[cat] || "#CBD5E1"
    })).filter(c => c.value > 0);
  }, [transactions]);

  const totalSpent = useMemo(() => {
    return spendingData.reduce((acc, curr) => acc + curr.value, 0);
  }, [spendingData]);

  const totalReceived = useMemo(() => {
    return transactions
      .filter(t => t.amt > 0)
      .reduce((acc, t) => acc + t.amt, 0);
  }, [transactions]);

  const currentBalance = useMemo(() => {
    return 7900 + (totalReceived - 3000) - (totalSpent - 2645);
  }, [totalReceived, totalSpent]);

  // Add Transaction Handler
  const handleAddTransaction = (e) => {
    e.preventDefault();
    if (!newTx.name || !newTx.amt) return;

    const parsedAmt = parseFloat(newTx.amt);
    const finalAmt = newTx.type === "expense" ? -Math.abs(parsedAmt) : Math.abs(parsedAmt);

    const createdTx = {
      id: Date.now(),
      name: newTx.name,
      cat: newTx.type === "income" ? "Received Money" : newTx.cat,
      date: new Date(newTx.date).toLocaleDateString("en-GB", { day: '2-digit', month: 'short', year: 'numeric' }),
      amt: finalAmt,
      color: newTx.type === "income" ? "#059669" : (categoryColors[newTx.cat] || "#6366F1"),
      initial: newTx.name.charAt(0).toUpperCase()
    };

    setTransactions([createdTx, ...transactions]);
    setIsAddTxOpen(false);
    setNewTx({ name: "", cat: "Food & Snacks", amt: "", type: "expense", date: new Date().toISOString().split("T")[0] });
  };

  // Delete Transaction
  const handleDeleteTx = (id) => {
    setTransactions(transactions.filter(t => t.id !== id));
  };

  // Export CSV
  const handleExportCSV = () => {
    const headers = "Name,Category,Date,Amount (INR)\n";
    const rows = transactions.map(t => `"${t.name}","${t.cat}","${t.date}",${t.amt}`).join("\n");
    const blob = new Blob([headers + rows], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `FinTrack_Transactions_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  // AI Chat Handler
  const handleSendAIChat = (textToSend) => {
    const query = textToSend || aiChatInput;
    if (!query.trim()) return;

    const newMessages = [...aiMessages, { sender: "user", text: query }];
    setAiMessages(newMessages);
    setAiChatInput("");

    // Simulated Smart AI responses
    setTimeout(() => {
      let reply = "Based on your spending patterns, you are doing great! Keep track of smaller expenses like campus snacks to save even more.";
      const lower = query.toLowerCase();
      if (lower.includes("food") || (lower.includes("swiggy") || lower.includes("canteen"))) {
        reply = `You've spent ₹${spendingData.find(s => s.name === "Food & Snacks")?.value || 330} on Food & Snacks recently. Ordering in 2 fewer times could save you ₹450 per week!`;
      } else if (lower.includes("headphones") || lower.includes("save")) {
        reply = `Your 'New Headphones' goal is currently at ${Math.round((goalSaved / goalTarget) * 100)}% (₹${goalSaved}/₹${goalTarget}). If you save ₹300 per week, you'll hit your target in just 8 weeks!`;
      } else if (lower.includes("budget") || lower.includes("score")) {
        reply = `Your Financial Health Score is 88/100 🌟. Excellent savings rate (36%) and healthy pocket money balance of ₹${currentBalance.toLocaleString("en-IN")}.`;
      }

      setAiMessages([...newMessages, { sender: "ai", text: reply }]);
    }, 600);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex text-slate-800 dark:text-slate-100 font-sans transition-colors duration-200">

      {/* Sidebar Navigation */}
      <aside className="w-64 bg-white dark:bg-slate-800 border-r border-slate-100 dark:border-slate-700/60 flex flex-col shrink-0 transition-colors duration-200">
        <div className="flex items-center justify-between px-6 py-6 border-b border-slate-100 dark:border-slate-700/40">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-emerald-400 flex items-center justify-center shadow-sm">
              <Icon name="TrendingUp" size={18} className="text-white" />
            </div>
            <div>
              <div className="font-bold text-lg leading-none text-slate-800 dark:text-white">FinTrack</div>
              <div className="text-[11px] text-slate-400 dark:text-slate-400 leading-none mt-1 font-medium">Student Pocket Money</div>
            </div>
          </div>
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-500 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600 transition"
            title="Toggle Dark Mode"
          >
            <Icon name={darkMode ? "Sun" : "Moon"} size={16} />
          </button>
        </div>

        <nav className="flex-1 px-3 space-y-1 mt-4 overflow-y-auto">
          {navItems.map((item) => (
            <div
              key={item.label}
              onClick={() => setActiveTab(item.label)}
              className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium cursor-pointer transition-all ${activeTab === item.label
                ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/20 font-semibold"
                : "text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700/50 hover:text-slate-800 dark:hover:text-slate-200"
                }`}
            >
              <Icon name={item.icon} size={18} />
              <span className="flex-1">{item.label}</span>
              {item.badge && (
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${activeTab === item.label ? "bg-white/20 text-white" : "bg-indigo-100 dark:bg-indigo-900/60 text-indigo-600 dark:text-indigo-300"
                  }`}>
                  {item.badge}
                </span>
              )}
            </div>
          ))}
        </nav>

        {/* AI Buddy Card Sidebar */}
        <div className="mx-4 mb-4 p-4 rounded-2xl bg-indigo-50/80 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/50">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-lg bg-white dark:bg-slate-800 flex items-center justify-center shadow-sm">
              <Icon name="Sparkles" size={15} className="text-indigo-500" />
            </div>
            <span className="text-sm font-bold text-slate-800 dark:text-indigo-200">AI Money Buddy</span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-3 leading-relaxed">
            Need help budgeting pocket money or saving for a goal?
          </p>
          <button
            onClick={() => setIsAIChatOpen(true)}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold py-2.5 rounded-xl flex items-center justify-center gap-1.5 shadow-sm transition active:scale-95"
          >
            <Icon name="MessageCircle" size={14} /> Chat with AI
          </button>
        </div>

        {/* User Profile Footer */}
        <div className="flex items-center gap-2.5 px-6 py-4 border-t border-slate-100 dark:border-slate-700/60">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-amber-300 to-pink-500 flex items-center justify-center text-white text-xs font-bold shadow-sm">
            SN
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-bold text-slate-800 dark:text-slate-100 truncate">Sneha</div>
            <div className="text-[11px] text-slate-400 dark:text-slate-400 truncate font-medium">B.Tech CS · AI/ML</div>
          </div>
          <Icon name="ChevronDown" size={14} className="text-slate-400" />
        </div>
      </aside>

      {/* Main Workspace Area */}
      <main className="flex-1 p-8 max-w-[1400px] overflow-y-auto">

        {/* Header Bar */}
        <div className="flex items-center justify-between mb-7">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-800 dark:text-white tracking-tight">
              {activeTab === "Dashboard" ? "Good morning, Sneha 👋" : activeTab}
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
              {activeTab === "Dashboard"
                ? "Here's how your student pocket money is performing this week."
                : `Manage your financial ${activeTab.toLowerCase()} with smart AI analytics.`}
            </p>
          </div>
          <div className="flex items-center gap-3">
            {/* Action Button */}
            <button
              onClick={() => setIsAddTxOpen(true)}
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-4 py-2.5 rounded-xl text-sm shadow-sm transition active:scale-95"
            >
              <Icon name="Plus" size={16} /> Add Transaction
            </button>

            {/* Date Selector */}
            <div className="relative">
              <select
                value={range}
                onChange={(e) => setRange(e.target.value)}
                className="appearance-none bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 pr-8 text-sm font-semibold text-slate-600 dark:text-slate-300 shadow-sm cursor-pointer focus:outline-none"
              >
                <option value="This Week">{currentWeekRange}</option>
                <option value="Last Week">{lastWeekRange}</option>
                <option value="This Month">{currentMonthRange}</option>
              </select>
              <Icon name="ChevronDown" size={14} className="absolute right-3 top-3.5 text-slate-400 pointer-events-none" />
            </div>

            {/* Notifications Bell */}
            <div className="relative">
              <button
                onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                className="w-10 h-10 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl flex items-center justify-center shadow-sm cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700 transition"
              >
                <Icon name="Bell" size={17} className="text-slate-500 dark:text-slate-300" />
                <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">2</span>
              </button>

              {/* Notifications Popover */}
              {isNotificationsOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl shadow-xl p-4 z-50 animate-fade-in">
                  <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100 dark:border-slate-700">
                    <span className="font-bold text-sm text-slate-800 dark:text-white">Notifications</span>
                    <span className="text-xs text-indigo-600 font-semibold cursor-pointer" onClick={() => setIsNotificationsOpen(false)}>Mark read</span>
                  </div>
                  <div className="space-y-2.5">
                    <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-900/50 flex gap-2.5">
                      <Icon name="ArrowDownCircle" size={18} className="text-emerald-600 shrink-0 mt-0.5" />
                      <div>
                        <div className="text-xs font-bold text-slate-800 dark:text-emerald-200">Pocket Money Received</div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400">₹3,000 credited from Home</div>
                      </div>
                    </div>
                    <div className="p-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/50 flex gap-2.5">
                      <Icon name="Target" size={18} className="text-indigo-600 shrink-0 mt-0.5" />
                      <div>
                        <div className="text-xs font-bold text-slate-800 dark:text-indigo-200">Savings Goal Update</div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400">Headphones goal reached 40%!</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Dynamic Tab Views */}
        {activeTab === "Dashboard" && (
          <div className="space-y-6 animate-fade-in">
            {/* Stat cards grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
              <StatCard
                icon="Wallet" iconBg="bg-indigo-50 dark:bg-indigo-950/60" iconColor="text-indigo-600 dark:text-indigo-400"
                label="Pocket Money Balance" value={`₹${currentBalance.toLocaleString("en-IN")}`} delta="8.2% from last week" up
                sparkline="0,26 12,22 24,24 36,16 48,18 60,8 70,6"
              />
              <StatCard
                icon="ArrowDownCircle" iconBg="bg-emerald-50 dark:bg-emerald-950/60" iconColor="text-emerald-600 dark:text-emerald-400"
                label="Pocket Money Received" value={`₹${totalReceived.toLocaleString("en-IN")}`} delta="Received Sat" up
                sparkline="0,24 12,20 24,22 36,12 48,14 60,10 70,4"
              />
              <StatCard
                icon="ArrowUpRight" iconBg="bg-rose-50 dark:bg-rose-950/60" iconColor="text-rose-500 dark:text-rose-400"
                label="Money Spent" value={`₹${totalSpent.toLocaleString("en-IN")}`} delta="12.4% from last week" up={false}
                sparkline="0,10 12,14 24,12 36,18 48,16 60,22 70,20"
              />
              <StatCard
                icon="Percent" iconBg="bg-purple-50 dark:bg-purple-950/60" iconColor="text-purple-600 dark:text-purple-400"
                label="Savings Rate" value={`${Math.round(((currentBalance - 5000) / currentBalance) * 100) || 36}%`} delta="6% from last week" up
                sparkline="0,28 12,24 24,20 36,18 48,12 60,10 70,4"
              />
            </div>

            {/* Middle Section: Spending Overview & AI Insights */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

              {/* Spending Overview Pie Chart */}
              <div className="lg:col-span-2 bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700/60 shadow-sm p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-bold text-slate-800 dark:text-white text-base">Spending Overview</h2>
                  <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg px-3 py-1.5">
                    {range}
                  </span>
                </div>
                <div className="flex flex-col sm:flex-row items-center gap-8">
                  <div className="w-56 h-56 relative shrink-0">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={spendingData}
                          dataKey="value"
                          innerRadius={65}
                          outerRadius={100}
                          paddingAngle={3}
                          stroke="none"
                        >
                          {spendingData.map((entry, i) => (
                            <Cell key={i} fill={entry.color} />
                          ))}
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                      <div className="text-xl font-extrabold text-slate-800 dark:text-white">₹{totalSpent.toLocaleString("en-IN")}</div>
                      <div className="text-xs text-slate-400 font-medium">Total Spent</div>
                    </div>
                  </div>
                  <div className="flex-1 w-full space-y-3.5">
                    {spendingData.map((item) => (
                      <div key={item.name} className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2.5">
                          <span className="w-3 h-3 rounded-full" style={{ background: item.color }} />
                          <span className="text-slate-600 dark:text-slate-300 font-medium">{item.name}</span>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="font-bold text-slate-800 dark:text-white">₹{item.value.toLocaleString("en-IN")}</span>
                          <span className="text-slate-400 text-xs w-9 text-right font-medium">
                            {totalSpent > 0 ? Math.round((item.value / totalSpent) * 100) : 0}%
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* AI Insights Card */}
              <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700/60 shadow-sm p-6 flex flex-col justify-between">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-bold text-slate-800 dark:text-white text-base">AI Insights</h2>
                  <span className="text-[10px] bg-indigo-100 dark:bg-indigo-900/60 text-indigo-600 dark:text-indigo-300 px-2 py-0.5 rounded-full font-extrabold">New</span>
                </div>
                <div className="flex-1 bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-900/50 rounded-2xl p-5 flex flex-col justify-between">
                  <div>
                    <div className="w-10 h-10 rounded-full bg-white dark:bg-slate-800 flex items-center justify-center mb-4 shadow-sm">
                      <Icon name="Sparkles" size={18} className="text-emerald-500" />
                    </div>
                    <p className="text-sm text-slate-700 dark:text-slate-200 leading-relaxed mb-3 font-medium">
                      Nice work! You spent <span className="font-bold text-emerald-600 dark:text-emerald-400">18% less</span> on Food & Snacks this week compared to last.
                    </p>
                    <p className="text-sm text-slate-700 dark:text-slate-200 leading-relaxed font-medium">
                      Keep it up and you could save an extra <span className="font-extrabold text-slate-900 dark:text-white">₹800</span> by month end.
                    </p>
                  </div>
                  <button
                    onClick={() => setIsAIChatOpen(true)}
                    className="mt-5 flex items-center gap-1.5 text-sm font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
                  >
                    View More Insights <Icon name="ArrowRight" size={14} />
                  </button>
                </div>
                <div className="flex justify-center gap-1.5 mt-4">
                  <span className="w-2 h-2 rounded-full bg-indigo-500" />
                  <span className="w-2 h-2 rounded-full bg-slate-200 dark:bg-slate-700" />
                  <span className="w-2 h-2 rounded-full bg-slate-200 dark:bg-slate-700" />
                </div>
              </div>
            </div>

            {/* Recent Transactions & Balance Trend */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

              {/* Recent Transactions list */}
              <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700/60 shadow-sm p-6 flex flex-col">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-bold text-slate-800 dark:text-white text-base">Recent Transactions</h2>
                  <span
                    onClick={() => setActiveTab("Transactions")}
                    className="text-xs font-bold text-indigo-600 dark:text-indigo-400 cursor-pointer hover:underline"
                  >
                    View All
                  </span>
                </div>
                <div className="space-y-4 flex-1">
                  {transactions.slice(0, 5).map((t) => (
                    <div key={t.id} className="flex items-center gap-3 p-1.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700/40 transition">
                      <div
                        className="w-9 h-9 rounded-xl flex items-center justify-center text-white text-sm font-bold shrink-0 shadow-sm"
                        style={{ background: t.color }}
                      >
                        {t.initial}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-bold text-slate-800 dark:text-slate-100 truncate">{t.name}</div>
                        <div className="text-xs text-slate-400 truncate font-medium">{t.cat}</div>
                      </div>
                      <div className="text-right shrink-0">
                        <div className={`text-sm font-bold ${t.amt > 0 ? "text-emerald-600 dark:text-emerald-400" : "text-slate-800 dark:text-slate-200"}`}>
                          {t.amt > 0 ? "+" : "-"}₹{Math.abs(t.amt).toLocaleString("en-IN")}
                        </div>
                        <div className="text-[11px] text-slate-400">{t.date}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Balance Trend Line Chart */}
              <div className="lg:col-span-2 bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700/60 shadow-sm p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-bold text-slate-800 dark:text-white text-base">Balance Trend</h2>
                  <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg px-3 py-1.5">
                    This Week
                  </span>
                </div>
                <ResponsiveContainer width="100%" height={230}>
                  <LineChart data={trendData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={darkMode ? "#334155" : "#F1F5F9"} />
                    <XAxis dataKey="day" tick={{ fontSize: 12, fill: darkMode ? "#94A3B8" : "#64748B" }} axisLine={false} tickLine={false} />
                    <YAxis
                      tick={{ fontSize: 12, fill: darkMode ? "#94A3B8" : "#64748B" }}
                      axisLine={false}
                      tickLine={false}
                      tickFormatter={(v) => `₹${v / 1000}k`}
                    />
                    <Tooltip
                      formatter={(v) => [`₹${v.toLocaleString("en-IN")}`, "Balance"]}
                      contentStyle={{
                        borderRadius: 12,
                        border: darkMode ? "1px solid #334155" : "1px solid #E2E8F0",
                        backgroundColor: darkMode ? "#1E293B" : "#FFFFFF",
                        color: darkMode ? "#F8FAFC" : "#0F172A",
                        fontSize: 12
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="balance"
                      stroke="#4F46E5"
                      strokeWidth={3}
                      dot={{ r: 4, fill: "#4F46E5" }}
                      activeDot={{ r: 7 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Savings Goal Card Widget */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700/60 shadow-sm p-6 flex flex-col md:flex-row items-center gap-6">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 flex items-center justify-center shrink-0 shadow-sm">
                <Icon name="Target" size={22} className="text-emerald-600 dark:text-emerald-400" />
              </div>
              <div className="w-52 shrink-0">
                <div className="font-bold text-slate-800 dark:text-white text-base">New Headphones</div>
                <div className="text-xs text-slate-400 font-medium">Primary Savings Goal</div>
              </div>
              <div className="w-40 shrink-0">
                <div className="font-extrabold text-slate-800 dark:text-white">₹{goalSaved.toLocaleString("en-IN")} saved</div>
                <div className="text-xs text-slate-400 font-medium">of ₹{goalTarget.toLocaleString("en-IN")} target</div>
              </div>
              <div className="flex-1 w-full h-3 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-emerald-400 to-emerald-600 rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(100, Math.round((goalSaved / goalTarget) * 100))}%` }}
                />
              </div>
              <span className="text-xs font-bold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 px-3 py-1 rounded-full shrink-0">
                {Math.round((goalSaved / goalTarget) * 100)}%
              </span>
              <button
                onClick={() => setGoalSaved(prev => Math.min(goalTarget, prev + 200))}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-3.5 py-2 rounded-xl transition shadow-sm active:scale-95"
              >
                + Add ₹200
              </button>
              <div className="text-right shrink-0">
                <div className="text-xs text-slate-400 font-medium">Target Date</div>
                <div className="text-sm font-bold text-slate-800 dark:text-slate-200">31 Dec 2024</div>
              </div>
            </div>

            <div className="flex items-center justify-center gap-1.5 text-xs text-slate-400 font-medium mt-6">
              <Icon name="Info" size={13} /> All transactions and amounts are in Indian Rupees (₹)
            </div>
          </div>
        )}

        {/* Transactions Tab View */}
        {activeTab === "Transactions" && (
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700/60 shadow-sm p-6 animate-fade-in space-y-5">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-2 border-b border-slate-100 dark:border-slate-700">
              <h2 className="font-bold text-slate-800 dark:text-white text-lg">Transaction History</h2>
              <div className="flex items-center gap-3">
                <button
                  onClick={handleExportCSV}
                  className="flex items-center gap-2 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 text-slate-700 dark:text-slate-200 font-bold px-3.5 py-2 rounded-xl text-xs transition"
                >
                  <Icon name="Download" size={14} /> Export CSV
                </button>
                <button
                  onClick={() => setIsAddTxOpen(true)}
                  className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-3.5 py-2 rounded-xl text-xs transition"
                >
                  <Icon name="Plus" size={14} /> Add New
                </button>
              </div>
            </div>

            {/* Transactions Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="text-slate-400 dark:text-slate-400 text-xs font-semibold uppercase border-b border-slate-100 dark:border-slate-700">
                    <th className="py-3 px-4">Transaction</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">Date</th>
                    <th className="py-3 px-4 text-right">Amount</th>
                    <th className="py-3 px-4 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-700/60 text-sm">
                  {transactions.map((t) => (
                    <tr key={t.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition">
                      <td className="py-3.5 px-4 flex items-center gap-3">
                        <div
                          className="w-9 h-9 rounded-xl flex items-center justify-center text-white text-sm font-bold shadow-sm"
                          style={{ background: t.color }}
                        >
                          {t.initial}
                        </div>
                        <span className="font-bold text-slate-800 dark:text-slate-100">{t.name}</span>
                      </td>
                      <td className="py-3.5 px-4 text-slate-500 dark:text-slate-400 font-medium">{t.cat}</td>
                      <td className="py-3.5 px-4 text-slate-400 font-medium text-xs">{t.date}</td>
                      <td className={`py-3.5 px-4 text-right font-extrabold ${t.amt > 0 ? "text-emerald-600 dark:text-emerald-400" : "text-slate-800 dark:text-slate-200"}`}>
                        {t.amt > 0 ? "+" : "-"}₹{Math.abs(t.amt).toLocaleString("en-IN")}
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <button
                          onClick={() => handleDeleteTx(t.id)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition"
                          title="Delete transaction"
                        >
                          <Icon name="Trash2" size={15} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Placeholder tab views for other tabs */}
        {activeTab !== "Dashboard" && activeTab !== "Transactions" && (
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700/60 shadow-sm p-12 text-center animate-fade-in">
            <div className="w-16 h-16 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto mb-4 shadow-sm">
              <Icon name={navItems.find(i => i.label === activeTab)?.icon || "Sparkles"} size={28} />
            </div>
            <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-2">{activeTab} Feature Hub</h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm max-w-md mx-auto mb-6">
              Track and optimize your {activeTab.toLowerCase()} with AI recommendations and automated pocket money budgeting.
            </p>
            <button
              onClick={() => setActiveTab("Dashboard")}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-sm transition"
            >
              Back to Dashboard
            </button>
          </div>
        )}

      </main>

      {/* Add Transaction Modal */}
      {isAddTxOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-2xl w-full max-w-md p-6">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100 dark:border-slate-700">
              <h3 className="font-extrabold text-lg text-slate-800 dark:text-white">Add New Transaction</h3>
              <button
                onClick={() => setIsAddTxOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition"
              >
                <Icon name="X" size={18} />
              </button>
            </div>

            <form onSubmit={handleAddTransaction} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1.5">Transaction Type</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setNewTx({ ...newTx, type: "expense" })}
                    className={`py-2 rounded-xl text-xs font-bold transition ${newTx.type === "expense"
                      ? "bg-rose-500 text-white shadow-sm"
                      : "bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300"
                      }`}
                  >
                    Expense (-)
                  </button>
                  <button
                    type="button"
                    onClick={() => setNewTx({ ...newTx, type: "income" })}
                    className={`py-2 rounded-xl text-xs font-bold transition ${newTx.type === "income"
                      ? "bg-emerald-600 text-white shadow-sm"
                      : "bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300"
                      }`}
                  >
                    Income (+)
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1.5">Title / Merchant</label>
                <input
                  type="text"
                  placeholder="e.g. Swiggy, Book Store, Pocket Money"
                  value={newTx.name}
                  onChange={(e) => setNewTx({ ...newTx, name: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:border-indigo-500 dark:text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1.5">Amount (₹)</label>
                <input
                  type="number"
                  placeholder="e.g. 250"
                  value={newTx.amt}
                  onChange={(e) => setNewTx({ ...newTx, amt: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:border-indigo-500 dark:text-white"
                  required
                />
              </div>

              {newTx.type === "expense" && (
                <div>
                  <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1.5">Category</label>
                  <select
                    value={newTx.cat}
                    onChange={(e) => setNewTx({ ...newTx, cat: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:border-indigo-500 dark:text-white cursor-pointer"
                  >
                    <option value="Food & Snacks">Food & Snacks</option>
                    <option value="Transportation">Transportation</option>
                    <option value="Shopping">Shopping</option>
                    <option value="Entertainment">Entertainment</option>
                    <option value="Stationery">Stationery</option>
                    <option value="Others">Others</option>
                  </select>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1.5">Date</label>
                <input
                  type="date"
                  value={newTx.date}
                  onChange={(e) => setNewTx({ ...newTx, date: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:border-indigo-500 dark:text-white cursor-pointer"
                />
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddTxOpen(false)}
                  className="flex-1 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs py-3 rounded-xl transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs py-3 rounded-xl shadow-md transition"
                >
                  Save Transaction
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* AI Assistant Chat Drawer / Modal */}
      {isAIChatOpen && (
        <div className="fixed inset-y-0 right-0 w-full sm:w-96 bg-white dark:bg-slate-800 border-l border-slate-100 dark:border-slate-700 shadow-2xl z-50 flex flex-col animate-slide-in-right">
          <div className="flex items-center justify-between p-5 border-b border-slate-100 dark:border-slate-700 bg-indigo-600 text-white">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
                <Icon name="Sparkles" size={16} className="text-white" />
              </div>
              <div>
                <div className="font-bold text-sm leading-none">AI Money Buddy</div>
                <div className="text-[10px] text-indigo-200 leading-none mt-1">Smart Pocket Money Advisor</div>
              </div>
            </div>
            <button
              onClick={() => setIsAIChatOpen(false)}
              className="p-1 rounded-lg text-white/80 hover:text-white transition"
            >
              <Icon name="X" size={18} />
            </button>
          </div>

          {/* Chat message thread */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-50/50 dark:bg-slate-900/50">
            {aiMessages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-3 text-xs leading-relaxed font-medium shadow-sm ${msg.sender === "user"
                    ? "bg-indigo-600 text-white rounded-br-none"
                    : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-100 dark:border-slate-700 rounded-bl-none"
                    }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
          </div>

          {/* Quick Prompts */}
          <div className="p-3 bg-white dark:bg-slate-800 border-t border-slate-100 dark:border-slate-700 space-y-2">
            <div className="text-[10px] font-bold uppercase text-slate-400">Quick Prompts</div>
            <div className="flex flex-wrap gap-1.5">
              {[
                "How can I save ₹500?",
                "Analyze Swiggy spend",
                "Headphones goal update"
              ].map((chip) => (
                <button
                  key={chip}
                  onClick={() => handleSendAIChat(chip)}
                  className="text-[11px] bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-300 px-2.5 py-1 rounded-lg font-semibold border border-indigo-100 dark:border-indigo-900/40 hover:bg-indigo-100 transition"
                >
                  {chip}
                </button>
              ))}
            </div>
          </div>

          {/* Input Box */}
          <div className="p-3 bg-white dark:bg-slate-800 border-t border-slate-100 dark:border-slate-700 flex gap-2">
            <input
              type="text"
              placeholder="Ask AI money buddy..."
              value={aiChatInput}
              onChange={(e) => setAiChatInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSendAIChat()}
              className="flex-1 px-3.5 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs focus:outline-none focus:border-indigo-500 dark:text-white"
            />
            <button
              onClick={() => handleSendAIChat()}
              className="w-10 h-10 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl flex items-center justify-center shrink-0 shadow-sm transition"
            >
              <Icon name="Send" size={15} />
            </button>
          </div>
        </div>
      )}

    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<MainApp />);
