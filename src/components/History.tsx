import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Search, 
  Calendar, 
  Car, 
  ExternalLink, 
  Cpu, 
  Trash2,
  Filter,
  BarChart3,
  Hash,
  Activity
} from "lucide-react";
import { cn } from "../lib/utils";

interface DetectionRecord {
  id: number;
  vehicle_number: string;
  confidence: number;
  original_image_path: string;
  processed_image_path: string;
  timestamp: string;
}

export default function History() {
  const [history, setHistory] = useState<DetectionRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [stats, setStats] = useState({ total: 0, avgConfidence: 0 });

  const fetchHistory = async (search = "") => {
    try {
      setLoading(true);
      const res = await fetch(`/api/history?search=${search}`);
      const data = await res.json();
      setHistory(data);
      
      if (data.length > 0) {
        const totalConf = data.reduce((acc: number, item: any) => acc + item.confidence, 0);
        setStats({
          total: data.length,
          avgConfidence: Math.round(totalConf / data.length)
        });
      } else {
        setStats({ total: 0, avgConfidence: 0 });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchHistory(searchTerm);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className="space-y-8"
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-3xl font-display font-bold text-slate-800 tracking-tight">Detection Logs</h1>
          <p className="text-slate-500 text-sm mt-1">Review archival data and AI extraction snapshots.</p>
        </div>

        <form onSubmit={handleSearch} className="relative w-full md:w-96 group">
          <input
            type="text"
            placeholder="Search registrations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-white border border-slate-200 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all shadow-sm group-hover:border-slate-300"
          />
          <Search className="absolute left-4 top-3.5 text-slate-400 group-hover:text-indigo-500 transition-colors" size={20} />
        </form>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: "Total Analysis", val: stats.total, icon: Activity, color: "text-indigo-600", bg: "bg-indigo-50" },
          { label: "Avg. Confidence", val: `${stats.avgConfidence}%`, icon: BarChart3, color: "text-purple-600", bg: "bg-purple-50" },
          { label: "AI Up-time", val: "99.9%", icon: Cpu, color: "text-emerald-600", bg: "bg-emerald-50" }
        ].map((stat, i) => (
          <div key={i} className="p-8 rounded-3xl border border-slate-200 bg-white shadow-sm flex items-center justify-between group hover:border-indigo-100 transition-colors">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
              <p className="text-3xl font-display font-bold text-slate-800">{stat.val}</p>
            </div>
            <div className={cn("p-4 rounded-2xl shadow-sm group-hover:scale-110 transition-transform", stat.bg, stat.color)}>
              <stat.icon size={24} />
            </div>
          </div>
        ))}
      </div>

      {/* Data Table */}
      <div className="rounded-3xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50 border-b border-slate-100 text-slate-400 text-[10px] font-bold uppercase tracking-widest">
              <tr>
                <th className="px-8 py-5">Visual Evidence</th>
                <th className="px-8 py-5">Plate ID</th>
                <th className="px-8 py-5">Score</th>
                <th className="px-8 py-5">Scan Time</th>
                <th className="px-8 py-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan={5} className="px-8 py-8 bg-slate-50/50"></td>
                  </tr>
                ))
              ) : history.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-8 py-24 text-center">
                    <div className="flex flex-col items-center gap-4">
                      <div className="p-6 rounded-full bg-slate-100 text-slate-300">
                        <Search size={48} />
                      </div>
                      <p className="font-bold text-slate-400">No records matching your search criteria.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                history.map((record) => (
                  <motion.tr 
                    key={record.id} 
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="hover:bg-slate-50/80 transition-colors group"
                  >
                    <td className="px-8 py-5">
                      <div className="w-24 aspect-video rounded-xl overflow-hidden border border-slate-100 bg-slate-900 flex items-center justify-center">
                        <img 
                          src={record.original_image_path} 
                          alt="Vehicle" 
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        />
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-indigo-500"></div>
                        <span className="font-mono font-bold text-lg text-slate-800 tracking-tight">{record.vehicle_number}</span>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-3">
                        <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div 
                            className={cn(
                              "h-full rounded-full transition-all duration-1000",
                              record.confidence > 90 ? "bg-emerald-500" : record.confidence > 70 ? "bg-indigo-500" : "bg-amber-500"
                            )}
                            style={{ width: `${record.confidence}%` }}
                          />
                        </div>
                        <span className={cn(
                          "text-xs font-bold",
                          record.confidence > 90 ? "text-emerald-600" : record.confidence > 70 ? "text-indigo-600" : "text-amber-600"
                        )}>{record.confidence}%</span>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <div className="text-xs font-bold text-slate-800 mb-0.5">
                        {new Date(record.timestamp).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                      </div>
                      <div className="text-[10px] text-slate-400 font-medium">
                        {new Date(record.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                      </div>
                    </td>
                    <td className="px-8 py-5 text-right">
                      <button className="w-10 h-10 rounded-xl bg-slate-100 text-slate-500 hover:bg-indigo-600 hover:text-white hover:shadow-lg hover:shadow-indigo-200 transition-all flex items-center justify-center ml-auto">
                        <ExternalLink size={18} />
                      </button>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
}
