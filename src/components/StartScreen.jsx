import React from 'react';
import { Globe, Activity } from 'lucide-react';
import { useSearch } from '../contexts';

// --- Sub-Component: Language Ticker ---
const LanguageTicker = () => {
  const connections = [
    { from: 'UA', to: 'JP', time: '0.2s' },
    { from: 'EN', to: 'ES', time: '0.1s' },
    { from: 'FR', to: 'KR', time: '0.3s' },
    { from: 'DE', to: 'PT', time: '0.2s' },
    { from: 'CN', to: 'IT', time: '0.4s' },
    { from: 'TR', to: 'RU', time: '0.1s' },
  ];

  return (
    <div className="w-full bg-slate-900/50 border-y border-white/5 overflow-hidden py-3 backdrop-blur-sm relative z-20">
      <div className="flex w-[200%] animate-marquee">
        {[...connections, ...connections, ...connections].map((conn, i) => (
          <div key={i} className="flex items-center gap-3 px-12 opacity-60 hover:opacity-100 transition-opacity cursor-default">
            <span className="text-[10px] font-mono text-cyan-500 uppercase tracking-widest">Bridging</span>
            <div className="flex items-center gap-2 px-3 py-1 rounded bg-slate-900 border border-slate-800">
              <span className="font-semibold text-slate-200 text-xs">{conn.from}</span>
              <Activity className="w-3 h-3 text-purple-400 animate-pulse" />
              <span className="font-semibold text-slate-200 text-xs">{conn.to}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// --- Sub-Component: SoftSphere Visual ---
const SoftSphere = () => {
  return (
    <div className="relative w-full h-[500px] md:h-[600px] flex items-center justify-center perspective-1000">
      {/* Abstract Glowing Gradient Behind */}
      <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/20 via-purple-500/20 to-transparent blur-[100px] rounded-full animate-pulse" />

      {/* The Sphere Representation */}
      <div className="relative w-64 h-64 md:w-96 md:h-96 animate-slow-spin transform-style-3d">
        {/* Rings */}
        <div className="absolute inset-0 border border-cyan-400/30 rounded-full shadow-[0_0_30px_rgba(6,182,212,0.1)]" />
        <div className="absolute inset-0 border border-purple-500/30 rounded-full rotate-45 shadow-[0_0_30px_rgba(168,85,247,0.1)]" />
        <div className="absolute inset-0 border border-white/10 rounded-full rotate-90" />

        {/* Orbiting Satellites (Language Tags) */}
        {/* Satellite 1: JP */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-6 w-12 h-12 animate-orbit-1">
          <div className="w-full h-full bg-slate-900/90 backdrop-blur-md border border-cyan-400 p-2 rounded-xl shadow-[0_0_25px_rgba(6,182,212,0.4)] flex items-center justify-center animate-counter-spin">
            <span className="text-cyan-300 font-bold text-xs">JP</span>
          </div>
        </div>

        {/* Satellite 2: UA */}
        <div className="absolute bottom-10 right-0 w-12 h-12 animate-orbit-2">
          <div className="w-full h-full bg-slate-900/90 backdrop-blur-md border border-purple-500 p-2 rounded-xl shadow-[0_0_25px_rgba(168,85,247,0.4)] flex items-center justify-center animate-counter-spin">
            <span className="text-purple-300 font-bold text-xs">UA</span>
          </div>
        </div>

        {/* Satellite 3: EN */}
        <div className="absolute top-1/2 left-0 -translate-x-6 w-auto h-auto animate-orbit-3">
          <div className="bg-emerald-900/90 backdrop-blur-md border border-emerald-500 px-3 py-1 rounded-full shadow-[0_0_25px_rgba(16,185,129,0.4)] animate-counter-spin">
            <span className="text-emerald-300 font-mono text-[10px] font-bold">+50 XP</span>
          </div>
        </div>

        {/* Central Core */}
        <div className="absolute inset-0 m-auto w-32 h-32 bg-slate-900/60 backdrop-blur-md rounded-full border border-white/20 flex items-center justify-center shadow-[inset_0_0_30px_rgba(255,255,255,0.1)]">
          <Globe className="w-16 h-16 text-white/90 drop-shadow-[0_0_15px_rgba(255,255,255,0.6)] animate-pulse" />
        </div>
      </div>
    </div>
  );
};

// --- Sub-Component: Hero Section ---
const Hero = ({ onOpenModal, onLogin, supabase, onSearch, onResultClick }) => {
  return (
    <section className="relative pt-32 pb-20 px-6 flex flex-col items-center justify-center overflow-hidden">

      {/* Background Decor */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-cyan-500/10 rounded-full blur-[120px] mix-blend-screen animate-pulse" style={{ animationDuration: '4s' }}></div>
        <div className="absolute bottom-0 right-[-10%] w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-[120px] mix-blend-screen animate-pulse" style={{ animationDuration: '7s' }}></div>
      </div>

      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none z-0"></div>

      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">

        {/* Text Content */}
        <div className="text-left space-y-8">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md shadow-[0_0_15px_rgba(6,182,212,0.15)] animate-fade-in">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
            </span>
            <span className="text-xs font-mono text-cyan-300 tracking-wider font-bold">HYBRID INTELLIGENCE NETWORK</span>
          </div>

          {/* Headlines */}
          <div className="space-y-4 animate-slide-in">
            <h1 className="text-6xl md:text-8xl font-bold tracking-tighter text-white leading-[0.9]">
              Global Mind.<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-blue-400 to-purple-500 drop-shadow-[0_0_30px_rgba(6,182,212,0.3)]">
                Zero Barriers.
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-slate-300 max-w-xl leading-relaxed font-light">
              Ask about <span className="text-white font-semibold border-b border-cyan-500/50">Life</span> or <span className="text-white font-semibold border-b border-purple-500/50">Tech</span>.
              Get answers from everywhere.
            </p>
          </div>

          {/* Search Bar */}
          <div className="hero-search animate-slide-in" style={{ animationDelay: '0.2s' }}>
            <SearchBar
              supabase={supabase}
              onSearch={onSearch}
              onResultClick={onResultClick}
            />
            <p className="text-center text-sm text-slate-500 mt-3">
              Search across <strong className="text-cyan-400">12k+</strong> questions in <strong className="text-cyan-400">40+</strong> languages
            </p>
          </div>

          {/* Social Proof */}
          <div className="pt-10 flex items-center gap-10 border-t border-white/10 animate-fade-in" style={{ animationDelay: '0.4s' }}>
            <div>
              <p className="text-3xl font-mono font-bold text-white drop-shadow-md">12k+</p>
              <p className="text-xs text-cyan-200/70 uppercase tracking-widest font-semibold">Active Nodes</p>
            </div>
            <div>
              <p className="text-3xl font-mono font-bold text-white drop-shadow-md">40+</p>
              <p className="text-xs text-cyan-200/70 uppercase tracking-widest font-semibold">Languages</p>
            </div>
            <div>
              <p className="text-3xl font-mono font-bold text-white drop-shadow-md">∞XP</p>
              <p className="text-xs text-cyan-200/70 uppercase tracking-widest font-semibold">Knowledge Mined</p>
            </div>
          </div>
        </div>

        {/* Visual Hook Area */}
        <div className="relative">
          <SoftSphere />
        </div>
      </div>
    </section>
  );
};

// --- Main Export: StartScreen ---
const StartScreen = ({ onOpenModal }) => {
  return (
    <>
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 30s linear infinite;
        }
        @keyframes slow-spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-slow-spin {
          animation: slow-spin 20s linear infinite;
        }
        @keyframes slide-in-top {
          0% { transform: translateY(-20px); opacity: 0; }
          100% { transform: translateY(0); opacity: 1; }
        }
        .animate-slide-in {
          animation: slide-in-top 0.5s cubic-bezier(0.250, 0.460, 0.450, 0.940) both;
        }
        @keyframes fade-in {
          0% { opacity: 0; }
          100% { opacity: 1; }
        }
        .animate-fade-in {
          animation: fade-in 0.5s ease-out forwards;
        }
        @keyframes orbit-1 {
          0% { transform: rotate(0deg) translateX(120px) rotate(0deg); }
          100% { transform: rotate(360deg) translateX(120px) rotate(-360deg); }
        }
        @keyframes orbit-2 {
          0% { transform: rotate(120deg) translateX(150px) rotate(-120deg); }
          100% { transform: rotate(480deg) translateX(150px) rotate(-480deg); }
        }
        @keyframes orbit-3 {
          0% { transform: rotate(240deg) translateX(100px) rotate(-240deg); }
          100% { transform: rotate(600deg) translateX(100px) rotate(-600deg); }
        }
        .animate-orbit-1 { animation: orbit-1 20s linear infinite; }
        .animate-orbit-2 { animation: orbit-2 25s linear infinite; }
        .animate-orbit-3 { animation: orbit-3 18s linear infinite; }
        
        /* Helper to keep orbiting elements upright if needed */
        @keyframes counter-spin {
           from { transform: rotate(360deg); }
           to { transform: rotate(0deg); }
        }
        .animate-counter-spin {
           animation: counter-spin 20s linear infinite; 
        }
      `}</style>

      <Hero
        onOpenModal={onOpenModal}
      />
      <LanguageTicker />
    </>
  );
};

export default StartScreen;