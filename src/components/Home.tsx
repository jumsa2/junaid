import { motion } from "motion/react";
import { Link } from "react-router-dom";
import { Shield, Zap, Search, ArrowRight, Scan, Clock, Car, CheckCircle2, BarChart3 } from "lucide-react";

const features = [
  {
    title: "Instant Detection",
    desc: "Lightning fast number plate recognition using advanced AI vision models.",
    icon: Zap,
  },
  {
    title: "High Accuracy",
    desc: "Trained on diverse datasets to ensure correct extraction even in low light.",
    icon: Shield,
  },
  {
    title: "Detection History",
    desc: "Keep track of all previous detections with timestamps and confidence scores.",
    icon: Clock,
  },
];

export default function Home() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-16"
    >
      <section className="relative px-12 py-20 rounded-[40px] bg-slate-900 overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/4"></div>

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-bold uppercase tracking-widest"
            >
              <Zap size={14} /> Powered by Gemini Vision
            </motion.div>
            
            <h1 className="text-6xl md:text-7xl font-display font-black text-white leading-[1.05] tracking-tight">
              Enterprise <span className="text-indigo-400">Vision</span> for Plate Analytics
            </h1>
            
            <p className="text-slate-400 text-lg leading-relaxed max-w-lg">
              Automated vehicle registration extraction using advanced neural networks. Real-time OCR, historical tracking, and high-accuracy detection.
            </p>
            
            <div className="flex flex-wrap gap-4 pt-4">
              <Link
                to="/detect"
                className="px-8 py-4 rounded-2xl bg-indigo-600 text-white font-bold text-lg shadow-xl shadow-indigo-600/20 hover:bg-indigo-700 hover:-translate-y-1 transition-all flex items-center gap-2"
              >
                Launch Scanner <ArrowRight size={22} />
              </Link>
              <Link
                to="/history"
                className="px-8 py-4 rounded-2xl bg-white/5 border border-white/10 text-white font-bold text-lg hover:bg-white/10 transition-all"
              >
                Archival Logs
              </Link>
            </div>
          </div>

          <div className="hidden lg:block relative">
            <div className="relative bg-slate-800 rounded-3xl p-4 shadow-2xl border border-slate-700/50 aspect-video group">
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-transparent rounded-3xl"></div>
              <div className="w-full h-full bg-slate-900 bg-cover bg-center rounded-2xl flex items-center justify-center border border-white/5 overflow-hidden">
                <Car size={120} className="text-slate-800 animate-pulse" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-12 border-2 border-indigo-400 rounded ring-8 ring-indigo-400/10 flex items-center justify-center">
                  <div className="w-full h-full bg-indigo-400/20 backdrop-blur-sm"></div>
                </div>
                <div className="absolute top-[calc(50%-45px)] left-[calc(50%-96px)] bg-indigo-400 text-white px-2 py-0.5 text-[10px] font-bold rounded-t uppercase">License Plate Detected</div>
              </div>
            </div>
            {/* Floating Stats */}
            <motion.div 
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -bottom-8 -left-8 p-6 bg-white rounded-2xl shadow-xl border border-slate-100"
            >
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Processing</p>
              <p className="text-2xl font-bold text-slate-800">0.42s <span className="text-green-500 text-xs font-medium">Fast</span></p>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {features.map((feature, i) => (
          <motion.div
            key={feature.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="p-10 rounded-3xl bg-white border border-slate-200 hover:border-indigo-200 hover:shadow-xl hover:shadow-indigo-500/5 transition-all group"
          >
            <div className="bg-indigo-50 w-14 h-14 rounded-2xl flex items-center justify-center mb-8 text-indigo-600 group-hover:scale-110 group-hover:bg-indigo-600 group-hover:text-white transition-all">
              <feature.icon size={26} />
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-4">{feature.title}</h3>
            <p className="text-slate-500 leading-relaxed">{feature.desc}</p>
          </motion.div>
        ))}
      </section>

      <section className="flex flex-col md:flex-row items-center gap-12 py-12">
        <div className="flex-1 space-y-6">
          <h2 className="text-4xl font-display font-bold text-slate-800 leading-tight">Advanced Feature-Set for <br />Modern Environments</h2>
          <p className="text-slate-500 text-lg leading-relaxed">
            Designed for high-performance extraction, our system utilizes Google's latest multimodal models to ensure precision even in challenging lighting and angles.
          </p>
          <ul className="space-y-4">
            {['Sub-second OCR extraction', 'Normalized coordinate output', 'Persistent detection history', 'Confidence-based filtering'].map(item => (
              <li key={item} className="flex items-center gap-3 text-slate-700 font-medium">
                <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
                  <CheckCircle2 size={12} />
                </div>
                {item}
              </li>
            ))}
          </ul>
        </div>
        <div className="flex-1 grid grid-cols-2 gap-4">
          <div className="space-y-4 pt-12">
            <div className="aspect-square bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
              <BarChart3 className="text-indigo-400 mb-4" size={32} />
              <p className="text-2xl font-bold text-slate-800">98%</p>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Accuracy</p>
            </div>
            <div className="aspect-[4/5] bg-slate-900 rounded-3xl p-6 shadow-xl text-white">
              <Clock className="text-indigo-400 mb-4" size={32} />
              <p className="text-2xl font-bold">24/7</p>
              <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">Scanning</p>
            </div>
          </div>
          <div className="space-y-4">
            <div className="aspect-[4/5] bg-indigo-600 rounded-3xl p-6 shadow-xl text-white">
              <Shield className="text-white/80 mb-4" size={32} />
              <p className="text-2xl font-bold">Safe</p>
              <p className="text-xs text-indigo-200 font-bold uppercase tracking-widest">Data Store</p>
            </div>
            <div className="aspect-square bg-slate-100 rounded-3xl border border-slate-200 p-6 flex items-center justify-center">
              <Search className="text-slate-300" size={48} />
            </div>
          </div>
        </div>
      </section>
    </motion.div>
  );
}
