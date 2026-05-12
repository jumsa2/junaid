/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { 
  Camera, 
  History as HistoryIcon, 
  Home as HomeIcon, 
  Upload, 
  Moon, 
  Sun, 
  Car, 
  Search,
  ScanLine,
  CheckCircle2,
  AlertCircle,
  Clock
} from "lucide-react";
import { cn } from "./lib/utils";
import PlateDetector from "./components/PlateDetector";
import History from "./components/History";
import Home from "./components/Home";

function NavLink({ to, children, icon: Icon }: { to: string; children: React.ReactNode; icon: any }) {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Link
      to={to}
      className={cn(
        "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200",
        isActive 
          ? "bg-slate-100 text-indigo-600 font-semibold shadow-sm" 
          : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
      )}
    >
      <Icon size={20} />
      <span>{children}</span>
    </Link>
  );
}

function Layout({ children }: { children: React.ReactNode }) {
  const [isDark, setIsDark] = useState(false); // Design shows light sidebar by default
  const location = useLocation();

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDark]);

  const getPageTitle = () => {
    switch (location.pathname) {
      case "/": return "Dashboard Overview";
      case "/detect": return "Analysis / Current Detection";
      case "/history": return "Detection Archives";
      default: return "SmartPlate AI";
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 font-sans text-slate-900 overflow-hidden">
      {/* Sidebar */}
      <nav className="w-72 bg-white border-r border-slate-200 flex flex-col p-8 h-full">
        <div className="flex items-center gap-3 mb-12">
          <div className="w-11 h-11 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-200">
            <Car className="text-white" size={24} />
          </div>
          <span className="font-bold text-2xl tracking-tight text-slate-800 font-display">SmartPlate</span>
        </div>

        <div className="flex flex-col gap-2 flex-1">
          <NavLink to="/" icon={HomeIcon}>Dashboard</NavLink>
          <NavLink to="/detect" icon={Upload}>Detection</NavLink>
          <NavLink to="/history" icon={HistoryIcon}>History</NavLink>
        </div>

        <div className="mt-auto pt-6 border-t border-slate-100">
          <div className="p-5 bg-indigo-50 rounded-2xl">
            <div className="text-[10px] text-indigo-400 font-bold uppercase mb-2 tracking-widest">System Status</div>
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.5)]"></div>
              <span className="text-sm font-semibold text-indigo-900">AI Engine Online</span>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-10 flex-shrink-0">
          <div className="flex items-center gap-4">
            <span className="text-sm font-semibold text-slate-500">{getPageTitle()}</span>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 bg-slate-100 p-1.5 rounded-full">
              <button 
                onClick={() => setIsDark(false)}
                className={cn("w-9 h-9 flex items-center justify-center rounded-full transition-all", !isDark ? "bg-white shadow-sm text-slate-800" : "text-slate-400 hover:text-slate-600")}
              >
                <Sun size={18} />
              </button>
              <button 
                onClick={() => setIsDark(true)}
                className={cn("w-9 h-9 flex items-center justify-center rounded-full transition-all", isDark ? "bg-slate-800 shadow-sm text-slate-100" : "text-slate-400 hover:text-slate-600")}
              >
                <Moon size={18} />
              </button>
            </div>
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 border-2 border-white shadow-md"></div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-10">
          <AnimatePresence mode="wait">
            {children}
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/detect" element={<PlateDetector />} />
          <Route path="/history" element={<History />} />
        </Routes>
      </Layout>
    </Router>
  );
}

