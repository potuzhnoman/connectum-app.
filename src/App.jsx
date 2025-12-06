import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { 
  Cpu, Plus, Loader2, ArrowRight, AlertTriangle 
} from 'lucide-react';

// --- Component Imports ---
import Navbar from './components/Navbar';
import StartScreen from './components/StartScreen';
import QuestionCard from './components/QuestionCard';
import AskQuestionModal from './components/AskQuestionModal';
import LeaderboardModal from './components/LeaderboardModal';
import UserProfileModal from './components/UserProfileModal';
import XPToast from './components/XPToast';

// --- Supabase Configuration ---
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// --- Helpers ---
const formatTimeAgo = (dateString) => {
  if (!dateString) return 'Just now';
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now - date) / 1000);
  if (seconds < 60) return 'Just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return ${minutes}m ago;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return ${hours}h ago;
  const days = Math.floor(hours / 24);
  return ${days}d ago;
};

case 'German': return { flag: '🇩🇪', country: 'DE' };
case 'French': return { flag: '🇫🇷', country: 'FR' };
case 'Chinese': return { flag: '🇨🇳', country: 'CN' };
default: return { flag: '🇺🇸', country: 'US' };
}
};

// --- COMPONENTS (Merged for Preview Compatibility) ---

// 1. Navbar
const Navbar = ({ onOpenModal, onOpenLeaderboard, onOpenProfile, xp, level, xpProgress, session, onLoginGithub, onLoginGoogle, onLogout }) => {
const [isScrolled, setIsScrolled] = useState(false);
const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

useEffect(() => {
const handleScroll = () => setIsScrolled(window.scrollY > 20);
window.addEventListener('scroll', handleScroll);
return () => window.removeEventListener('scroll', handleScroll);
}, []);

return (
<nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b ${isScrolled ? 'bg-slate-950/80 backdrop-blur-xl border-cyan-500/20 py-3 shadow-[0_0_20px_rgba(6,182,212,0.1)]' : 'bg-transparent border-transparent py-5'}`}>
  <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
    <div className="flex items-center gap-2 group cursor-pointer" onClick={() => window.scrollTo(0,0)}>
      <div className="relative flex items-center justify-center w-10 h-10 bg-cyan-500/10 rounded-xl border border-cyan-500/30 group-hover:border-cyan-400 transition-colors">
        <Cpu className="w-6 h-6 text-cyan-400 group-hover:animate-pulse" />
      </div>
      <span className="text-xl font-bold tracking-tight text-white">Connectum<span className="text-cyan-400">.</span></span>
    </div>
    <div className="hidden md:flex items-center gap-8">
      {['Explore', 'Community', 'Manifesto'].map((item) => <a key={item} href="#" className="text-sm font-medium text-slate-400 hover:text-cyan-300 transition-colors">{item}</a>)}
      <button onClick={onOpenLeaderboard} className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400 hover:bg-amber-500/20 transition-all"><Trophy className="w-4 h-4" /><span className="text-xs font-bold uppercase tracking-wide">Leaders</span></button>
      {session ? (
        <div className="flex items-center gap-4 pl-4 border-l border-slate-800">
          <div className="flex flex-col items-end">
            <div className="flex items-center gap-2 mb-1"><span className="text-[10px] font-bold text-cyan-400 tracking-widest uppercase">Lvl {level} Node</span><span className="text-[10px] font-mono text-slate-500">{xp}/1000 XP</span></div>
            <div className="w-32 h-1.5 bg-slate-800 rounded-full overflow-hidden"><div className="h-full bg-gradient-to-r from-cyan-500 to-purple-500 transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(6,182,212,0.5)]" style={{ width: `${xpProgress}%` }} /></div>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative group cursor-pointer" onClick={onOpenProfile}>
              <div className="w-10 h-10 rounded-full bg-slate-900 p-0.5 ring-2 ring-cyan-500/30 group-hover:ring-cyan-400 transition-all overflow-hidden">
                 <img src={session.user.user_metadata.avatar_url} alt="User" className="w-full h-full rounded-full object-cover bg-slate-950" />
              </div>
              <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-emerald-500 border-2 border-slate-950 rounded-full animate-pulse"></div>
            </div>
            <button onClick={onLogout} className="p-2 text-slate-500 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"><LogOut className="w-5 h-5" /></button>
          </div>
          <button onClick={onOpenModal} className="ml-2 w-10 h-10 flex items-center justify-center rounded-xl bg-gradient-to-br from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white shadow-lg shadow-cyan-500/20 transition-all hover:scale-105"><Plus className="w-5 h-5" /></button>
        </div>
      ) : (
        <div className="flex items-center gap-3 pl-8 border-l border-slate-800">
           <button onClick={onLoginGoogle} className="flex items-center justify-center w-10 h-10 bg-white hover:bg-slate-200 text-slate-900 rounded-xl transition-all shadow-lg hover:scale-105"><Mail className="w-5 h-5" /></button>
           <button onClick={onLoginGithub} className="flex items-center gap-2 px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-white text-sm font-bold rounded-xl border border-slate-700 transition-all group hover:border-cyan-500/50"><Github className="w-4 h-4 group-hover:text-cyan-400 transition-colors" />Login</button>
        </div>
      )}
    </div>
    <button className="md:hidden text-slate-300" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>{mobileMenuOpen ? <X /> : <Menu />}</button>
  </div>
  {mobileMenuOpen && (
    <div className="absolute top-full left-0 w-full bg-slate-950/95 backdrop-blur-xl border-b border-slate-800 p-6 md:hidden flex flex-col gap-4 shadow-2xl animate-fade-in">
      {session ? (
        <>
          <div className="flex items-center gap-4 pb-4 border-b border-slate-800" onClick={() => { onOpenProfile(); setMobileMenuOpen(false); }}>
             <div className="w-12 h-12 rounded-full bg-indigo-600 overflow-hidden"><img src={session.user.user_metadata.avatar_url} alt="User" className="w-full h-full object-cover" /></div>
             <div><div className="text-white font-bold">{session.user.user_metadata.full_name}</div><div className="text-cyan-400 text-xs font-bold">Lvl {level} • {xp} XP</div></div>
          </div>
          <button onClick={() => { onOpenModal(); setMobileMenuOpen(false); }} className="w-full py-3 bg-cyan-600 text-white rounded-lg font-bold">Ask Question</button>
          <button onClick={() => { onOpenLeaderboard(); setMobileMenuOpen(false); }} className="w-full py-3 bg-amber-600/20 text-amber-400 border border-amber-600/50 rounded-lg font-bold flex items-center justify-center gap-2"><Trophy className="w-4 h-4" /> Leaderboard</button>
          <button onClick={() => { onLogout(); setMobileMenuOpen(false); }} className="w-full py-3 bg-slate-800 text-slate-300 rounded-lg font-bold">Log Out</button>
        </>
      ) : (
        <div className="flex flex-col gap-3">
          <button onClick={() => { onLoginGoogle(); setMobileMenuOpen(false); }} className="w-full py-3 bg-white text-slate-900 rounded-lg font-bold flex items-center justify-center gap-2"><Mail className="w-5 h-5" /> Login with Google</button>
          <button onClick={() => { onLoginGithub(); setMobileMenuOpen(false); }} className="w-full py-3 bg-slate-800 text-white rounded-lg font-bold flex items-center justify-center gap-2"><Github className="w-5 h-5" /> Login with GitHub</button>
        </div>
      )}
    </div>
  )}
</nav>
);
};

// 2. StartScreen Components
const LanguageTicker = () => {
const connections = [{ from: 'UA', to: 'JP', time: '0.2s' }, { from: 'EN', to: 'ES', time: '0.1s' }, { from: 'FR', to: 'KR', time: '0.3s' }, { from: 'DE', to: 'PT', time: '0.2s' }, { from: 'CN', to: 'IT', time: '0.4s' }, { from: 'TR', to: 'RU', time: '0.1s' }];
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

const SoftSphere = () => (
<div className="relative w-full h-[500px] md:h-[600px] flex items-center justify-center perspective-1000">
<div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/20 via-purple-500/20 to-transparent blur-[100px] rounded-full animate-pulse" />
<div className="relative w-64 h-64 md:w-96 md:h-96 animate-slow-spin transform-style-3d">
  <div className="absolute inset-0 border border-cyan-400/30 rounded-full shadow-[0_0_30px_rgba(6,182,212,0.1)]" />
  <div className="absolute inset-0 border border-purple-500/30 rounded-full rotate-45 shadow-[0_0_30px_rgba(168,85,247,0.1)]" />
  <div className="absolute inset-0 border border-white/10 rounded-full rotate-90" />
  <div className="absolute inset-0 m-auto w-32 h-32 bg-slate-900/60 backdrop-blur-md rounded-full border border-white/20 flex items-center justify-center shadow-[inset_0_0_30px_rgba(255,255,255,0.1)]"><Globe className="w-16 h-16 text-white/90 drop-shadow-[0_0_15px_rgba(255,255,255,0.6)] animate-pulse" /></div>
</div>
</div>
);

const Hero = ({ onOpenModal }) => (
<section className="relative pt-32 pb-20 px-6 flex flex-col items-center justify-center overflow-hidden">
<div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl pointer-events-none z-0">
   <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-cyan-500/10 rounded-full blur-[120px] mix-blend-screen animate-pulse" style={{animationDuration: '4s'}}></div>
   <div className="absolute bottom-0 right-[-10%] w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-[120px] mix-blend-screen animate-pulse" style={{animationDuration: '7s'}}></div>
</div>
<div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
  <div className="text-left space-y-8">
    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md shadow-[0_0_15px_rgba(6,182,212,0.15)] animate-fade-in">
      <span className="relative flex h-2 w-2"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span><span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span></span>
      <span className="text-xs font-mono text-cyan-300 tracking-wider font-bold">HYBRID INTELLIGENCE NETWORK</span>
    </div>
    <div className="space-y-4 animate-slide-in">
      <h1 className="text-6xl md:text-8xl font-bold tracking-tighter text-white leading-[0.9]">Global Mind.<br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-blue-400 to-purple-500 drop-shadow-[0_0_30px_rgba(6,182,212,0.3)]">Zero Barriers.</span></h1>
      <p className="text-xl md:text-2xl text-slate-300 max-w-xl leading-relaxed font-light">Ask about <span className="text-white font-semibold border-b border-cyan-500/50">Life</span> or <span className="text-white font-semibold border-b border-purple-500/50">Tech</span>. Get answers from everywhere.</p>
    </div>
    <div className="flex flex-col sm:flex-row gap-5 animate-slide-in" style={{animationDelay: '0.2s'}}>
      <button onClick={onOpenModal} className="group relative px-8 py-5 bg-white text-slate-950 rounded-xl font-bold text-xl overflow-hidden transition-all hover:scale-105 shadow-[0_0_40px_-5px_rgba(6,182,212,0.4)] hover:shadow-[0_0_60px_-5px_rgba(6,182,212,0.6)]">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-300 via-white to-cyan-300 opacity-0 group-hover:opacity-50 transition-opacity duration-500 blur-lg" />
        <span className="relative flex items-center gap-2">Join the HiveMind <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" /></span>
      </button>
      <button className="px-8 py-5 bg-white/5 border border-white/20 text-white rounded-xl font-bold text-xl backdrop-blur-sm hover:bg-white/10 hover:border-white/40 transition-all flex items-center justify-center gap-2"><ShieldCheck className="w-6 h-6 text-slate-300" /> View Protocol</button>
    </div>
  </div>
  <div className="relative"><SoftSphere /></div>
</div>
</section>
);

const StartScreen = ({ onOpenModal }) => (
<>
<Hero onOpenModal={onOpenModal} />
<LanguageTicker />
</>
);

// 3. QuestionCard
const QuestionCard = ({ data, onSubmitAnswer, session, onLoginGithub, onLoginGoogle, onUserClick }) => {
const [translated, setTranslated] = useState(false);
const [isHovered, setIsHovered] = useState(false);
const [isSimulatingAI, setIsSimulatingAI] = useState(data.isNew || false);
const [isExpanded, setIsExpanded] = useState(false);
const [answerText, setAnswerText] = useState("");
const [translatedText, setTranslatedText] = useState(null);

useEffect(() => {
if (isSimulatingAI) {
  const performTranslation = async () => {
    try {
      // Note: In this preview environment, /api/translate won't work.
      // In your Vercel deployment, this URL will be correct.
      const response = await fetch('/api/translate', {
         method: 'POST',
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify({ text: data.questionOriginal, targetLang: 'EN' })
      });
      if (!response.ok) throw new Error('Translation failed');
      const result = await response.json();
      if (result.translatedText) setTranslatedText(result.translatedText);
    } catch (error) {
      console.error("Translation API Error:", error);
      setTranslatedText("Translation requires Vercel backend."); 
    } finally {
      setIsSimulatingAI(false);
    }
  };
  performTranslation();
}
}, [isSimulatingAI, data.questionOriginal]);

const handleAnswerSubmit = () => {
if (!session) { alert("Please login to answer."); return; }
if (!answerText.trim()) return;
onSubmitAnswer(data.id, answerText);
setAnswerText("");
};

const handleTranslateClick = () => {
if (isSimulatingAI) return;
if (!translatedText && !translated) {
    setIsSimulatingAI(true);
    setTranslated(true);
} else {
    setTranslated(!translated);
}
};

return (
<div className={`relative p-6 rounded-3xl bg-slate-900/40 border border-white/5 hover:border-cyan-500/30 transition-all duration-500 hover:bg-slate-900/60 group ${data.isNew ? 'animate-slide-in' : ''}`} onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
  <div className={`absolute -inset-0.5 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-3xl opacity-0 group-hover:opacity-10 transition-opacity duration-500 blur-lg`} />
  <div className="flex items-center justify-between mb-5 relative z-10">
    <div className="flex items-center gap-4">
      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-cyan-500/20 overflow-hidden border border-white/10 cursor-pointer" onClick={() => onUserClick && onUserClick(data.authorId)}>
         {data.avatarUrl ? <img src={data.avatarUrl} alt="Avatar" className="w-full h-full object-cover" /> : <span>{data.name.charAt(0)}</span>}
      </div>
      <div>
        <div className="flex items-center gap-2">
          <h4 className="text-base font-bold text-white group-hover:text-cyan-200 transition-colors cursor-pointer" onClick={() => onUserClick && onUserClick(data.authorId)}>{data.name}</h4>
          <span className="text-[10px] bg-slate-800 px-2 py-0.5 rounded-full text-slate-300 flex items-center gap-1 border border-slate-700">{data.flag} {data.country}</span>
        </div>
        <p className="text-xs text-slate-500 mt-0.5">{data.timeAgo}</p>
      </div>
    </div>
    <div className="flex items-center gap-1 text-amber-400 bg-amber-400/10 px-3 py-1 rounded-full border border-amber-400/20 shadow-[0_0_15px_rgba(245,158,11,0.1)]"><Zap className="w-3.5 h-3.5 fill-current" /><span className="text-xs font-bold">{data.xp} XP</span></div>
  </div>
  <div className="mb-5 min-h-[80px] relative z-10">
    {isSimulatingAI ? (
      <div className="flex flex-col items-center justify-center py-6 space-y-3 animate-pulse bg-slate-950/30 rounded-xl border border-indigo-500/20"><Loader2 className="w-8 h-8 text-indigo-400 animate-spin" /><p className="text-xs font-mono text-indigo-300">ANALYZING LANGUAGE PATTERNS...</p></div>
    ) : (
      <div className="space-y-4 animate-fade-in">
        <div className={`transition-all duration-500 ${translated ? 'opacity-40 scale-95 origin-left' : 'opacity-100'}`}><p className="text-xl text-slate-200 font-medium leading-relaxed font-light">"{data.questionOriginal}"</p></div>
        <div className={`overflow-hidden transition-all duration-500 ease-in-out ${translated ? 'max-h-32 opacity-100' : 'max-h-0 opacity-0'}`}>
          <div className="flex gap-4 pl-4 border-l-2 border-cyan-500 bg-gradient-to-r from-cyan-900/10 to-transparent p-3 rounded-r-xl"><Sparkles className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-1" /><p className="text-lg text-cyan-100 font-medium leading-relaxed">{translatedText || data.questionTranslated}</p></div>
        </div>
      </div>
    )}
  </div>
  <div className="flex items-center justify-between pt-5 border-t border-white/5 relative z-10">
    <button onClick={handleTranslateClick} disabled={isSimulatingAI} className={`flex items-center gap-2 text-xs font-bold px-4 py-2 rounded-xl transition-all ${translated ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' : 'bg-slate-800/50 text-slate-400 hover:text-white hover:bg-slate-700'} ${isSimulatingAI ? 'opacity-50 cursor-not-allowed' : ''}`}><Languages className="w-3.5 h-3.5" />{translated ? 'Show Original' : 'AI Translate'}</button>
    <div className="flex items-center gap-3">
       <button onClick={() => setIsExpanded(!isExpanded)} className="text-slate-500 hover:text-white transition-colors flex items-center gap-1.5 text-xs font-medium hover:bg-slate-800 p-2 rounded-lg"><MessageSquare className="w-4 h-4" /> {data.comments}</button>
       <button onClick={() => !isSimulatingAI && setIsExpanded(!isExpanded)} className={`px-5 py-2 text-xs font-bold rounded-xl transition-all shadow-sm disabled:opacity-50 ${isExpanded ? 'bg-indigo-600 text-white shadow-indigo-500/20' : 'bg-slate-100 text-slate-900 hover:bg-white'}`} disabled={isSimulatingAI}>{isExpanded ? 'Close' : 'Answer'}</button>
    </div>
  </div>
  {isExpanded && (
    <div className="mt-6 pt-6 border-t border-white/5 animate-fade-in relative z-10">
      {data.replies && data.replies.length > 0 && (
        <div className="mb-6 space-y-4">
          <h5 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Top Answers</h5>
          {data.replies.map((reply) => (
            <div key={reply.id} className="bg-slate-950/60 rounded-xl p-4 border border-white/5 flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-slate-800 overflow-hidden border border-white/10 cursor-pointer" onClick={() => onUserClick && onUserClick(reply.authorId)}><img src={reply.avatar} alt={reply.author} className="w-full h-full object-cover" /></div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1"><span className="text-xs font-bold text-cyan-300 cursor-pointer hover:underline" onClick={() => onUserClick && onUserClick(reply.authorId)}>{reply.author}</span><span className="text-[10px] text-slate-500">{reply.time}</span></div>
                <p className="text-sm text-slate-300 leading-relaxed">{reply.text}</p>
              </div>
            </div>
          ))}
        </div>
      )}
      <div className="relative group/input">
        {!session && (
          <div className="absolute inset-0 z-20 bg-slate-950/90 backdrop-blur-sm flex flex-col items-center justify-center rounded-xl border border-slate-800">
             <p className="text-slate-300 text-sm mb-4 font-bold">Join the HiveMind to answer</p>
             <div className="flex gap-3"><button onClick={onLoginGoogle} className="flex items-center gap-2 px-4 py-2 bg-white text-slate-900 text-xs font-bold rounded-lg transition-all hover:bg-slate-100"><Mail className="w-3 h-3" /> Google</button><button onClick={onLoginGithub} className="flex items-center gap-2 px-4 py-2 bg-slate-800 text-white text-xs font-bold rounded-lg transition-all hover:bg-slate-700"><Github className="w-3 h-3" /> GitHub</button></div>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 rounded-xl blur-md opacity-0 group-focus-within/input:opacity-100 transition-opacity duration-500 -z-10" />
        <textarea value={answerText} onChange={(e) => setAnswerText(e.target.value)} placeholder={session ? "Type your answer here... Earn +100 XP" : "Login to answer..."} className="w-full bg-slate-950/80 border border-slate-700 rounded-xl p-4 pr-14 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 transition-all resize-none min-h-[100px]" disabled={!session} />
        <button onClick={handleAnswerSubmit} disabled={!answerText.trim() || !session} className="absolute bottom-3 right-3 p-2 bg-emerald-500 hover:bg-emerald-400 disabled:bg-slate-800 disabled:text-slate-600 text-white rounded-lg transition-colors shadow-lg shadow-emerald-500/20"><Send className="w-4 h-4" /></button>
      </div>
    </div>
  )}
</div>
);
};

// 4. XPToast
const XPToast = ({ message, isVisible }) => {
if (!isVisible) return null;
return (
<div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[100] animate-bounce-in">
  <div className="bg-slate-900/90 backdrop-blur-xl border border-amber-500/30 px-6 py-3 rounded-full shadow-[0_0_40px_rgba(245,158,11,0.3)] flex items-center gap-3">
    <div className="bg-amber-500/20 p-1.5 rounded-full"><Trophy className="w-5 h-5 text-amber-400" /></div>
    <div><h4 className="text-amber-400 font-bold text-lg leading-none">{message}</h4></div>
    <div className="ml-2 flex gap-0.5"><Sparkles className="w-4 h-4 text-yellow-200 animate-pulse" /></div>
  </div>
</div>
);
};

// 5. AskQuestionModal
const AskQuestionModal = ({ isOpen, onClose, onSubmit, session, onLoginGithub, onLoginGoogle }) => {
const [formData, setFormData] = useState({ title: '', language: 'English', category: 'Technology', details: '' });
if (!isOpen) return null;
return (
<div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
  <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-md transition-opacity" onClick={onClose} />
  <div className="relative w-full max-w-lg bg-slate-900 border border-white/10 rounded-3xl shadow-[0_0_50px_rgba(0,0,0,0.5)] p-8 animate-scale-in overflow-hidden">
    <button onClick={onClose} className="absolute top-4 right-4 text-slate-500 hover:text-white transition-colors p-2 hover:bg-white/5 rounded-full"><X className="w-5 h-5" /></button>
    <div className="mb-8 text-center">
      <div className="w-16 h-16 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-full flex items-center justify-center mb-4 border border-cyan-500/30 mx-auto"><MessageCircle className="w-8 h-8 text-cyan-400" /></div>
      <h2 className="text-3xl font-bold text-white mb-2">Ask the HiveMind</h2>
    </div>
    {!session ? (
      <div className="text-center py-6 bg-slate-950/50 rounded-2xl border border-white/5 p-6">
         <p className="text-slate-300 mb-6">You must be logged in to broadcast a question.</p>
         <div className="space-y-3">
           <button onClick={onLoginGoogle} className="flex items-center justify-center gap-2 w-full px-5 py-4 bg-white text-slate-950 font-bold rounded-xl hover:bg-gray-100 transition-all shadow-lg"><Mail className="w-5 h-5" /> Login with Google</button>
           <button onClick={onLoginGithub} className="flex items-center justify-center gap-2 w-full px-5 py-4 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl border border-slate-700 transition-all"><Github className="w-5 h-5" /> Login with GitHub</button>
         </div>
      </div>
    ) : (
      <form onSubmit={(e) => { e.preventDefault(); onSubmit(formData); setFormData({ title: '', language: 'English', category: 'Technology', details: '' }); }} className="space-y-6">
        <div className="space-y-2">
          <label className="block text-xs font-bold text-cyan-400 uppercase tracking-widest">Question</label>
          <input type="text" placeholder="e.g. Best strategies for..." className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-4 text-white placeholder:text-slate-600 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all text-lg" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} autoFocus />
        </div>
        <button type="submit" className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold py-4 rounded-xl shadow-lg shadow-cyan-500/25 transition-all flex items-center justify-center gap-2 group transform hover:-translate-y-1">Broadcast to Network <Send className="w-4 h-4 group-hover:translate-x-1 transition-transform" /></button>
      </form>
    )}
  </div>
</div>
);
};

// 6. LeaderboardModal
const LeaderboardModal = ({ isOpen, onClose, supabase }) => {
const [leaders, setLeaders] = useState([]);
const [loading, setLoading] = useState(true);
useEffect(() => {
if (isOpen && supabase) {
  setLoading(true);
  setTimeout(() => {
    setLeaders([
      { id: '1', full_name: 'Alpha Node', xp: 5200, avatar_url: '' },
      { id: '2', full_name: 'Beta Node', xp: 4800, avatar_url: '' },
      { id: '3', full_name: 'Gamma Node', xp: 4150, avatar_url: '' },
    ]);
    setLoading(false);
  }, 500);
}
}, [isOpen, supabase]);
if (!isOpen) return null;
return (
<div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
  <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-xl transition-opacity" onClick={onClose} />
  <div className="relative w-full max-w-md bg-slate-900 border border-amber-500/20 rounded-3xl shadow-[0_0_80px_rgba(245,158,11,0.15)] p-6 animate-scale-in">
    <button onClick={onClose} className="absolute top-4 right-4 text-slate-500 hover:text-white transition-colors"><X className="w-5 h-5" /></button>
    <div className="flex items-center gap-3 mb-6">
      <div className="p-3 bg-amber-500/20 rounded-xl border border-amber-500/30"><Trophy className="w-6 h-6 text-amber-400" /></div>
      <div><h2 className="text-xl font-bold text-white">Top Nodes</h2></div>
    </div>
    <div className="space-y-2">
      {loading ? <div className="text-center text-slate-500 py-10">Loading...</div> : leaders.map((l, i) => (
        <div key={l.id} className="flex items-center gap-4 p-3 rounded-xl bg-white/5 border border-white/5">
          <div className="font-bold text-amber-400">#{i + 1}</div>
          <div className="flex-1 font-bold text-white">{l.full_name}</div>
          <div className="text-sm text-slate-400">{l.xp} XP</div>
        </div>
      ))}
    </div>
  </div>
</div>
);
};

// 7. UserProfileModal
const UserProfileModal = ({ isOpen, onClose, userId, supabase }) => {
const [userData, setUserData] = useState(null);
const [loading, setLoading] = useState(false);

useEffect(() => {
if (isOpen && userId && supabase) {
  const fetchUser = async () => {
    setLoading(true);
    setTimeout(() => {
      setUserData({
        name: 'Node ' + userId.slice(0, 4),
        avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${userId}`,
        bio: 'This user is a connector in the global neural network.',
        location: 'Sector 7G',
        joined: 'Recently',
        level: Math.floor(Math.random() * 10) + 1,
        xp: Math.floor(Math.random() * 5000),
        role: 'Contributor'
      });
      setLoading(false);
    }, 500);
  };
  fetchUser();
}
}, [isOpen, userId, supabase]);

if (!isOpen) return null;

return (
<div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
  <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-md transition-opacity" onClick={onClose} />
  <div className="relative w-full max-w-md bg-slate-900 border border-white/10 rounded-3xl shadow-[0_0_60px_rgba(79,70,229,0.15)] overflow-hidden animate-scale-in">
    <div className="h-32 bg-gradient-to-r from-cyan-600 to-purple-600 relative">
       <button onClick={onClose} className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-full">
        <X className="w-5 h-5" />
      </button>
    </div>
    <div className="px-6 pb-8">
      <div className="relative -mt-12 mb-4 flex justify-between items-end">
        <div className="w-24 h-24 rounded-full p-1 bg-slate-900">
           {loading || !userData ? (
             <div className="w-full h-full rounded-full bg-slate-800 animate-pulse" />
           ) : (
             <img src={userData.avatarUrl} alt="Profile" className="w-full h-full rounded-full object-cover bg-slate-800" />
           )}
        </div>
        <div className="mb-2 flex gap-2">
           <button className="p-2 bg-slate-800 border border-slate-700 text-slate-300 rounded-lg hover:text-white hover:border-slate-600 transition-all"><Mail className="w-4 h-4" /></button>
           <button className="p-2 bg-slate-800 border border-slate-700 text-slate-300 rounded-lg hover:text-white hover:border-slate-600 transition-all"><Github className="w-4 h-4" /></button>
        </div>
      </div>
      {loading || !userData ? (
        <div className="space-y-3">
          <div className="h-6 w-32 bg-slate-800 rounded animate-pulse" />
          <div className="h-4 w-full bg-slate-800 rounded animate-pulse" />
        </div>
      ) : (
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">{userData.name} <ShieldCheck className="w-5 h-5 text-cyan-400" /></h2>
          <p className="text-cyan-400 text-sm font-medium mb-4">Level {userData.level} • {userData.role}</p>
          <p className="text-slate-400 text-sm leading-relaxed mb-6">{userData.bio}</p>
          <div className="flex flex-col gap-3 text-sm text-slate-500">
            <div className="flex items-center gap-2"><MapPin className="w-4 h-4" /> {userData.location}</div>
            <div className="flex items-center gap-2"><Calendar className="w-4 h-4" /> Joined {userData.joined}</div>
          </div>
          <div className="mt-8 pt-6 border-t border-white/5 grid grid-cols-2 gap-4">
             <div className="bg-slate-800/50 rounded-xl p-3 border border-white/5 text-center"><div className="text-2xl font-bold text-white">{userData.xp}</div><div className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">Total XP</div></div>
             <div className="bg-slate-800/50 rounded-xl p-3 border border-white/5 text-center"><div className="text-2xl font-bold text-white">12</div><div className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">Answers</div></div>
          </div>
        </div>
      )}
    </div>
  </div>
</div>
);
};

// --- MAIN APP ---
const App = () => {
const [supabase, setSupabase] = useState(null);
const [session, setSession] = useState(null);
const [isModalOpen, setIsModalOpen] = useState(false);
const [isLeaderboardOpen, setIsLeaderboardOpen] = useState(false);
const [isProfileOpen, setIsProfileOpen] = useState(false);
const [toastMessage, setToastMessage] = useState(null);
const [loading, setLoading] = useState(true);
const [userXP, setUserXP] = useState(0); 
const [questions, setQuestions] = useState([]);
const [viewProfileId, setViewProfileId] = useState(null);
const [configError, setConfigError] = useState(null);

const userLevel = Math.floor(userXP / 1000) + 1;
const levelProgress = ((userXP % 1000) / 1000) * 100;

useEffect(() => {
const initSupabase = async () => {
   const url = SUPABASE_URL;
   if (!url || url.includes("INSERT")) {
      setConfigError("Configuration Required");
      return;
   }
   try {
     const { createClient } = await import('https://esm.sh/@supabase/supabase-js@2');
     const client = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
     setSupabase(client);
   } catch (err) {
     console.error("Supabase load error:", err);
     setConfigError("Failed to load database connection");
   }
};
initSupabase();
}, []);

useEffect(() => {
if (!supabase) return;
supabase.auth.getSession().then(({ data: { session } }) => setSession(session));
const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => setSession(session));
return () => subscription.unsubscribe();
}, [supabase]);

useEffect(() => {
if (!supabase) return;
fetchQuestions();
const channel = supabase.channel('public:questions')
  .on('postgres_changes', { event: '*', schema: 'public', table: 'questions' }, () => fetchQuestions(false))
  .on('postgres_changes', { event: '*', schema: 'public', table: 'replies' }, () => fetchQuestions(false))
  .subscribe();
return () => { supabase.removeChannel(channel); };
}, [supabase]);

const fetchQuestions = async (showLoading = true) => {
try {
  if (showLoading) setLoading(true);
  const { data, error } = await supabase.from('questions').select('*, replies(*)').order('created_at', { ascending: false, foreignTable: 'replies' }).order('created_at', { ascending: false });
  if (error) throw error;
  const formattedQuestions = data.map(q => {
    const { flag, country } = getFlagAndCountry(q.language);
    return {
      id: q.id,
      authorId: q.author_id,
      name: q.author_name || 'Anonymous',
      country, flag,
      avatarUrl: q.author_avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${q.author_name}`,
      timeAgo: formatTimeAgo(q.created_at),
      questionOriginal: q.text,
      questionTranslated: q.text + " (AI Translated)", 
      xp: q.xp_reward || 0,
      comments: q.replies ? q.replies.length : 0,
      replies: q.replies ? q.replies.map(r => ({
        id: r.id,
        authorId: r.author_id,
        author: r.author_name,
        text: r.text,
        time: formatTimeAgo(r.created_at),
        avatar: r.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${r.author_name}`
      })) : [],
      isNew: false 
    };
  });
  setQuestions(formattedQuestions);
} catch (error) { console.error(error); } finally { if (showLoading) setLoading(false); }
};

const handleLoginGithub = async () => { if (supabase) await supabase.auth.signInWithOAuth({ provider: 'github', options: { redirectTo: window.location.origin } }); };
const handleLoginGoogle = async () => { if (supabase) await supabase.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: window.location.origin } }); };
const handleLogout = async () => { if (supabase) await supabase.auth.signOut(); setSession(null); };

const handleAddXP = async (amount, reason) => {
const newXP = userXP + amount;
setUserXP(newXP);
setToastMessage(`+${amount} XP - ${reason}`);
setTimeout(() => setToastMessage(null), 3000);
if (session && supabase) await supabase.from('profiles').update({ xp: newXP }).eq('id', session.user.id);
};

const handleAddQuestion = async (formData) => {
if (!supabase || !session) return;
const newQuestionPayload = {
  text: formData.title,
  language: formData.language,
  category: formData.category, 
  author_name: session.user.user_metadata.full_name || session.user.email,
  author_id: session.user.id,
  author_avatar: session.user.user_metadata.avatar_url,
  xp_reward: 50
};
const { error } = await supabase.from('questions').insert([newQuestionPayload]);
if (!error) { handleAddXP(50, "Posted Question"); setIsModalOpen(false); }
};

const handleSubmitAnswer = async (questionId, text) => {
if (!supabase || !session) return;
const replyPayload = {
  question_id: questionId,
  text,
  author_name: session.user.user_metadata.full_name || session.user.email,
  author_id: session.user.id,
  avatar: session.user.user_metadata.avatar_url
};
const { error } = await supabase.from('replies').insert([replyPayload]);
if (!error) { handleAddXP(100, "Solution Provided"); }
};

const handleUserClick = (userId) => {
if (userId) { setViewProfileId(userId); setIsProfileOpen(true); }
};

if (configError) return <div className="min-h-screen bg-slate-950 flex items-center justify-center text-red-400">{configError}</div>;
if (!supabase) return <div className="min-h-screen bg-slate-950 flex items-center justify-center"><Loader2 className="w-8 h-8 text-cyan-500 animate-spin" /></div>;

return (
<div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-indigo-500/30 selection:text-white">
  <style>{`
    @keyframes marquee { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
    .animate-marquee { animation: marquee 30s linear infinite; }
    @keyframes slow-spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
    .animate-slow-spin { animation: slow-spin 20s linear infinite; }
    @keyframes scale-in { 0% { transform: scale(0.95); opacity: 0; } 100% { transform: scale(1); opacity: 1; } }
    .animate-scale-in { animation: scale-in 0.2s ease-out forwards; }
    @keyframes bounce-in { 0% { transform: translate(-50%, 100%); opacity: 0; } 60% { transform: translate(-50%, -10%); opacity: 1; } 100% { transform: translate(-50%, 0); } }
    .animate-bounce-in { animation: bounce-in 0.5s forwards; }
    @keyframes fade-in { 0% { opacity: 0; } 100% { opacity: 1; } }
    .animate-fade-in { animation: fade-in 0.5s ease-out forwards; }
    @keyframes slide-in-top { 0% { transform: translateY(-20px); opacity: 0; } 100% { transform: translateY(0); opacity: 1; } }
    .animate-slide-in { animation: slide-in-top 0.5s both; }
    .custom-scrollbar::-webkit-scrollbar { width: 4px; }
    .custom-scrollbar::-webkit-scrollbar-track { background: rgba(255, 255, 255, 0.05); }
    .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.2); border-radius: 4px; }
  `}</style>

  <Navbar 
    onOpenModal={() => setIsModalOpen(true)} 
    onOpenLeaderboard={() => setIsLeaderboardOpen(true)}
    onOpenProfile={() => handleUserClick(session?.user?.id)}
    xp={userXP} 
    level={userLevel} 
    xpProgress={levelProgress} 
    session={session}
    onLoginGithub={handleLoginGithub}
    onLoginGoogle={handleLoginGoogle}
    onLogout={handleLogout}
  />
  
  <main>
    <StartScreen onOpenModal={() => setIsModalOpen(true)} />
    <section className="py-24 px-6 relative z-10">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-5xl h-full bg-cyan-900/10 blur-[100px] -z-10 rounded-full mix-blend-screen" />
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-3xl font-bold text-white mb-3">Live Questions</h2>
          <p className="text-slate-400">Real-time knowledge exchange happening right now.</p>
        </div>
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-12 h-12 text-cyan-500 animate-spin mb-4" />
            <p className="text-slate-500 font-mono text-sm">SYNCING WITH HIVE MIND...</p>
          </div>
        ) : (
          <div className="space-y-6">
            {questions.length === 0 ? (
              <div className="text-center py-10 text-slate-500 bg-slate-900/30 rounded-3xl border border-white/5 p-8 backdrop-blur-sm">
                 <p className="mb-2">No questions detected in the stream.</p>
              </div>
            ) : (
              questions.map(q => (
                <QuestionCard 
                  key={q.id} 
                  data={q} 
                  onSubmitAnswer={handleSubmitAnswer}
                  session={session}
                  onLoginGithub={handleLoginGithub}
                  onLoginGoogle={handleLoginGoogle}
                  onUserClick={handleUserClick}
                />
              ))
            )}
          </div>
        )}
        <div className="mt-12 text-center">
          <button className="text-sm font-bold text-slate-500 hover:text-cyan-400 transition-colors flex items-center justify-center gap-2 mx-auto">View Global Feed <ArrowRight className="w-4 h-4" /></button>
        </div>
      </div>
    </section>
  </main>

  <footer className="border-t border-slate-800 bg-slate-900 py-12 px-6">
    <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
      <div className="flex items-center gap-2"><Cpu className="w-5 h-5 text-cyan-500" /><span className="text-base font-bold text-slate-400">Connectum.</span></div>
      <div className="flex gap-8 text-sm text-slate-500"><a href="#" className="hover:text-white transition-colors">Privacy</a><a href="#" className="hover:text-white transition-colors">Terms</a><a href="#" className="hover:text-white transition-colors">Contact</a></div>
      <div className="text-sm text-slate-600">© 2024 Connectum Network.</div>
    </div>
  </footer>

  <button onClick={() => setIsModalOpen(true)} className="fixed bottom-8 right-8 z-40 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white p-4 rounded-full shadow-2xl hover:scale-110 transition-transform shadow-cyan-500/40"><Plus className="w-6 h-6" /></button>

  <XPToast message={toastMessage} isVisible={!!toastMessage} />
  <AskQuestionModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSubmit={handleAddQuestion} session={session} onLoginGithub={handleLoginGithub} onLoginGoogle={handleLoginGoogle} />
  <LeaderboardModal isOpen={isLeaderboardOpen} onClose={() => setIsLeaderboardOpen(false)} supabase={supabase} />
  <UserProfileModal isOpen={isProfileOpen} onClose={() => setIsProfileOpen(false)} userId={viewProfileId} supabase={supabase} />
</div>
);
};

export default App;