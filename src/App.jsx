import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js'; // Нормальный импорт
import { 
  Globe, Zap, MessageCircle, Cpu, ArrowRight, ShieldCheck, Activity, Languages, 
  Menu, X, Sparkles, MessageSquare, ThumbsUp, Share2, Plus, Loader2, Send, 
  Trophy, User, CheckCircle2, Github, LogOut, Code2, Mail, Crown, Medal 
} from 'lucide-react';

// --- Supabase Configuration (Correct) ---
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// --- Helpers ---
const formatTimeAgo = (dateString) => {
  if (!dateString) return 'Just now';
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now - date) / 1000);
  
  if (seconds < 60) return 'Just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
};

const getFlagAndCountry = (language) => {
  switch (language) {
    case 'Ukrainian': return { flag: '🇺🇦', country: 'UA' };
    case 'Japanese': return { flag: '🇯🇵', country: 'JP' };
    case 'Spanish': return { flag: '🇪🇸', country: 'ES' };
    case 'German': return { flag: '🇩🇪', country: 'DE' };
    case 'French': return { flag: '🇫🇷', country: 'FR' };
    case 'Chinese': return { flag: '🇨🇳', country: 'CN' };
    default: return { flag: '🇺🇸', country: 'US' };
  }
};

// --- Components ---

// 1. Navigation Bar with Stats HUD
const Navbar = ({ onOpenModal, onOpenLeaderboard, xp, level, xpProgress, session, onLoginGithub, onLoginGoogle, onLogout }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b w-full ${
      isScrolled 
        ? 'bg-slate-950/80 backdrop-blur-xl border-cyan-500/20 py-3 shadow-[0_0_20px_rgba(6,182,212,0.1)]' 
        : 'bg-transparent border-transparent py-5'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between">
        <div className="flex items-center gap-2 group cursor-pointer" onClick={() => window.scrollTo(0,0)}>
          <div className="relative flex items-center justify-center w-10 h-10 bg-cyan-500/10 rounded-xl border border-cyan-500/30 group-hover:border-cyan-400 transition-colors flex-shrink-0">
            <Cpu className="w-6 h-6 text-cyan-400 group-hover:animate-pulse" />
          </div>
          <span className="text-xl font-bold tracking-tight text-white hidden sm:block">
            Connectum<span className="text-cyan-400">.</span>
          </span>
        </div>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {['Explore', 'Community', 'Manifesto'].map((item) => (
            <a key={item} href="#" className="text-sm font-medium text-slate-400 hover:text-cyan-300 transition-colors">
              {item}
            </a>
          ))}

          <button 
            onClick={onOpenLeaderboard}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400 hover:bg-amber-500/20 transition-all"
            title="Global Leaderboard"
          >
            <Trophy className="w-4 h-4" />
            <span className="text-xs font-bold uppercase tracking-wide">Leaders</span>
          </button>
          
          {session ? (
            <div className="flex items-center gap-4 pl-4 border-l border-slate-800">
              <div className="flex flex-col items-end">
                <div className="flex items-center gap-2 mb-1">
                   <span className="text-[10px] font-bold text-cyan-400 tracking-widest uppercase">Lvl {level} Node</span>
                   <span className="text-[10px] font-mono text-slate-500">{xp}/1000 XP</span>
                </div>
                <div className="w-32 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-cyan-500 to-purple-500 transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(6,182,212,0.5)]"
                    style={{ width: `${xpProgress}%` }}
                  />
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="relative group cursor-pointer">
                  <div className="w-10 h-10 rounded-full bg-slate-900 p-0.5 ring-2 ring-cyan-500/30 group-hover:ring-cyan-400 transition-all overflow-hidden">
                     <img 
                        src={session.user.user_metadata.avatar_url} 
                        alt="User" 
                        className="w-full h-full rounded-full object-cover bg-slate-950" 
                     />
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-emerald-500 border-2 border-slate-950 rounded-full animate-pulse"></div>
                </div>
                
                <button 
                  onClick={onLogout}
                  className="p-2 text-slate-500 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
                  title="Log Out"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>

              <button 
                onClick={onOpenModal}
                className="ml-2 w-10 h-10 flex items-center justify-center rounded-xl bg-gradient-to-br from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white shadow-lg shadow-cyan-500/20 transition-all hover:scale-105"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3 pl-8 border-l border-slate-800">
               <button 
                 onClick={onLoginGoogle}
                 className="flex items-center justify-center w-10 h-10 bg-white hover:bg-slate-200 text-slate-900 rounded-xl transition-all shadow-lg hover:scale-105"
                 title="Login with Google"
               >
                 <Mail className="w-5 h-5" />
               </button>
               <button 
                 onClick={onLoginGithub}
                 className="flex items-center gap-2 px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-white text-sm font-bold rounded-xl border border-slate-700 transition-all group hover:border-cyan-500/50"
               >
                 <Github className="w-4 h-4 group-hover:text-cyan-400 transition-colors" />
                 Login
               </button>
            </div>
          )}
        </div>

        {/* Mobile Toggle */}
        <div className="flex items-center gap-4 md:hidden">
           <button 
            onClick={onOpenLeaderboard}
            className="flex items-center justify-center w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400"
          >
            <Trophy className="w-5 h-5" />
          </button>
          <button className="text-slate-300" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="absolute top-full left-0 w-full bg-slate-950/95 backdrop-blur-xl border-b border-slate-800 p-6 md:hidden flex flex-col gap-4 shadow-2xl animate-fade-in">
          {session ? (
            <>
              <div className="flex items-center gap-4 pb-4 border-b border-slate-800">
                 <div className="w-12 h-12 rounded-full bg-indigo-600 overflow-hidden">
                     <img src={session.user.user_metadata.avatar_url} alt="User" className="w-full h-full object-cover" />
                 </div>
                 <div>
                   <div className="text-white font-bold">{session.user.user_metadata.full_name}</div>
                   <div className="text-cyan-400 text-xs font-bold">Lvl {level} • {xp} XP</div>
                 </div>
              </div>
              <button onClick={() => { onOpenModal(); setMobileMenuOpen(false); }} className="w-full py-3 bg-cyan-600 text-white rounded-lg font-bold">
                Ask Question
              </button>
              <button onClick={() => { onLogout(); setMobileMenuOpen(false); }} className="w-full py-3 bg-slate-800 text-slate-300 rounded-lg font-bold">
                Log Out
              </button>
            </>
          ) : (
            <div className="flex flex-col gap-3">
              <button onClick={() => { onLoginGoogle(); setMobileMenuOpen(false); }} className="w-full py-3 bg-white text-slate-900 rounded-lg font-bold flex items-center justify-center gap-2">
                <Mail className="w-5 h-5" /> Login with Google
              </button>
              <button onClick={() => { onLoginGithub(); setMobileMenuOpen(false); }} className="w-full py-3 bg-slate-800 text-white rounded-lg font-bold flex items-center justify-center gap-2">
                <Github className="w-5 h-5" /> Login with GitHub
              </button>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

// 2. Language Ticker
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

// 3. XP Toast Notification
const XPToast = ({ message, isVisible }) => {
  if (!isVisible) return null;

  return (
    <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[100] animate-bounce-in w-max max-w-[90vw]">
      <div className="bg-slate-900/90 backdrop-blur-xl border border-amber-500/30 px-6 py-3 rounded-full shadow-[0_0_40px_rgba(245,158,11,0.3)] flex items-center gap-3">
        <div className="bg-amber-500/20 p-1.5 rounded-full flex-shrink-0">
          <Trophy className="w-5 h-5 text-amber-400" />
        </div>
        <div>
          <h4 className="text-amber-400 font-bold text-sm sm:text-lg leading-none truncate">{message}</h4>
        </div>
        <div className="ml-2 flex gap-0.5 flex-shrink-0">
           <Sparkles className="w-4 h-4 text-yellow-200 animate-pulse" />
        </div>
      </div>
    </div>
  );
};

// 4. Question Card Component
const QuestionCard = ({ data, onSubmitAnswer, session, onLoginGithub, onLoginGoogle }) => {
  const [translated, setTranslated] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isSimulatingAI, setIsSimulatingAI] = useState(data.isNew || false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [answerText, setAnswerText] = useState("");

  useEffect(() => {
    if (isSimulatingAI) {
      const timer = setTimeout(() => {
        setIsSimulatingAI(false);
      }, 2000); 
      return () => clearTimeout(timer);
    }
  }, [isSimulatingAI]);

  const handleAnswerSubmit = () => {
    if (!session) {
      alert("Please login to answer questions.");
      return;
    }
    if (!answerText.trim()) return;
    onSubmitAnswer(data.id, answerText);
    setAnswerText("");
  };

  const handleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div 
      className={`relative p-4 sm:p-6 rounded-3xl bg-slate-900/40 border border-white/5 hover:border-cyan-500/30 transition-all duration-500 hover:bg-slate-900/60 group max-w-full overflow-hidden ${data.isNew ? 'animate-slide-in' : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className={`absolute -inset-0.5 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-3xl opacity-0 group-hover:opacity-10 transition-opacity duration-500 blur-lg`} />

      {/* Header */}
      <div className="flex items-start sm:items-center justify-between mb-5 relative z-10 gap-2">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-cyan-500/20 overflow-hidden border border-white/10 flex-shrink-0">
             {data.avatarUrl ? (
               <img src={data.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
             ) : (
               <span>{data.avatar}</span>
             )}
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h4 className="text-sm sm:text-base font-bold text-white group-hover:text-cyan-200 transition-colors truncate">{data.name}</h4>
              <span className="text-[10px] bg-slate-800 px-2 py-0.5 rounded-full text-slate-300 flex items-center gap-1 border border-slate-700 flex-shrink-0">
                {data.flag} {data.country}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">{data.timeAgo}</p>
          </div>
        </div>
        <div className="flex items-center gap-1 text-amber-400 bg-amber-400/10 px-2 sm:px-3 py-1 rounded-full border border-amber-400/20 shadow-[0_0_15px_rgba(245,158,11,0.1)] flex-shrink-0">
          <Zap className="w-3.5 h-3.5 fill-current" />
          <span className="text-xs font-bold">{data.xp} XP</span>
        </div>
      </div>

      {/* Content Area */}
      <div className="mb-5 min-h-[80px] relative z-10">
        {isSimulatingAI ? (
          <div className="flex flex-col items-center justify-center py-6 space-y-3 animate-pulse bg-slate-950/30 rounded-xl border border-indigo-500/20">
            <Loader2 className="w-8 h-8 text-indigo-400 animate-spin" />
            <p className="text-xs font-mono text-indigo-300">ANALYZING LANGUAGE PATTERNS...</p>
          </div>
        ) : (
          <div className="space-y-4 animate-fade-in">
            <div className={`transition-all duration-500 ${translated ? 'opacity-40 scale-95 origin-left' : 'opacity-100'}`}>
              <p className="text-lg sm:text-xl text-slate-200 font-medium leading-relaxed font-light break-words">
                "{data.questionOriginal}"
              </p>
            </div>

            <div className={`overflow-hidden transition-all duration-500 ease-in-out ${translated ? 'max-h-32 opacity-100' : 'max-h-0 opacity-0'}`}>
              <div className="flex gap-4 pl-4 border-l-2 border-cyan-500 bg-gradient-to-r from-cyan-900/10 to-transparent p-3 rounded-r-xl">
                <Sparkles className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-1" />
                <p className="text-base sm:text-lg text-cyan-100 font-medium leading-relaxed break-words">
                  {data.questionTranslated}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between pt-5 border-t border-white/5 relative z-10 gap-3">
        <button 
          onClick={() => !isSimulatingAI && setTranslated(!translated)}
          disabled={isSimulatingAI}
          className={`flex items-center justify-center gap-2 text-xs font-bold px-4 py-2 rounded-xl transition-all ${
            translated 
              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' 
              : 'bg-slate-800/50 text-slate-400 hover:text-white hover:bg-slate-700'
          } ${isSimulatingAI ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          <Languages className="w-3.5 h-3.5" />
          {translated ? 'Show Original' : 'AI Translate'}
        </button>

        <div className="flex items-center justify-between sm:justify-end gap-3">
           <button 
             onClick={handleExpand}
             className="text-slate-500 hover:text-white transition-colors flex items-center gap-1.5 text-xs font-medium hover:bg-slate-800 p-2 rounded-lg"
           >
             <MessageSquare className="w-4 h-4" /> 
             {data.comments}
           </button>
           <button 
             onClick={() => !isSimulatingAI && handleExpand()}
             className={`px-5 py-2 text-xs font-bold rounded-xl transition-all shadow-sm disabled:opacity-50 flex-1 sm:flex-none ${isExpanded ? 'bg-indigo-600 text-white shadow-indigo-500/20' : 'bg-slate-100 text-slate-900 hover:bg-white'}`} 
             disabled={isSimulatingAI}
           >
             {isExpanded ? 'Close' : 'Answer'}
           </button>
        </div>
      </div>

      {/* Expandable Reply Section */}
      {isExpanded && (
        <div className="mt-6 pt-6 border-t border-white/5 animate-fade-in relative z-10">
          {data.replies && data.replies.length > 0 && (
            <div className="mb-6 space-y-4">
              <h5 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Top Answers</h5>
              {data.replies.map((reply) => (
                <div key={reply.id} className="bg-slate-950/60 rounded-xl p-4 border border-white/5 flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-slate-800 overflow-hidden border border-white/10">
                    <img src={reply.avatar} alt={reply.author} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-cyan-300 truncate">{reply.author}</span>
                      <span className="text-[10px] text-slate-500 flex-shrink-0 ml-2">{reply.time}</span>
                    </div>
                    <p className="text-sm text-slate-300 leading-relaxed break-words">{reply.text}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="relative group/input">
            {!session && (
              <div className="absolute inset-0 z-20 bg-slate-950/90 backdrop-blur-sm flex flex-col items-center justify-center rounded-xl border border-slate-800 p-4 text-center">
                 <p className="text-slate-300 text-sm mb-4 font-bold">Join the HiveMind to answer</p>
                 <div className="flex gap-3">
                   <button onClick={onLoginGoogle} className="flex items-center gap-2 px-4 py-2 bg-white text-slate-900 text-xs font-bold rounded-lg transition-all hover:bg-slate-100">
                     <Mail className="w-3 h-3" /> Google
                   </button>
                   <button onClick={onLoginGithub} className="flex items-center gap-2 px-4 py-2 bg-slate-800 text-white text-xs font-bold rounded-lg transition-all hover:bg-slate-700">
                     <Github className="w-3 h-3" /> GitHub
                   </button>
                 </div>
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 rounded-xl blur-md opacity-0 group-focus-within/input:opacity-100 transition-opacity duration-500 -z-10" />
            <textarea 
              value={answerText}
              onChange={(e) => setAnswerText(e.target.value)}
              placeholder={session ? "Type your answer here... Earn +100 XP" : "Login to answer..."}
              className="w-full bg-slate-950/80 border border-slate-700 rounded-xl p-4 pr-14 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 transition-all resize-none min-h-[100px]"
              disabled={!session}
            />
            <button 
              onClick={handleAnswerSubmit}
              disabled={!answerText.trim() || !session}
              className="absolute bottom-3 right-3 p-2 bg-emerald-500 hover:bg-emerald-400 disabled:bg-slate-800 disabled:text-slate-600 text-white rounded-lg transition-colors shadow-lg shadow-emerald-500/20"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
          <div className="mt-3 flex items-center gap-2 text-[10px] text-slate-500 justify-end">
             <CheckCircle2 className="w-3 h-3 text-emerald-500" />
             <span>Submitting a helpful answer earns <span className="text-emerald-400 font-bold">+100 XP</span></span>
          </div>
        </div>
      )}
    </div>
  );
};

// 5. Ask Question Modal Component
const AskQuestionModal = ({ isOpen, onClose, onSubmit, session, onLoginGithub, onLoginGoogle }) => {
  const [formData, setFormData] = useState({ title: '', language: 'English', category: 'Technology', details: '' });
  
  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!session) {
      alert("Please login to post a question.");
      return;
    }
    if (!formData.title) return;
    onSubmit(formData);
    setFormData({ title: '', language: 'English', category: 'Technology', details: '' }); // Reset
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-slate-950/80 backdrop-blur-md transition-opacity" 
        onClick={onClose}
      />
      
      <div className="relative w-full max-w-lg bg-slate-900 border border-white/10 rounded-3xl shadow-[0_0_50px_rgba(0,0,0,0.5)] p-8 animate-scale-in overflow-hidden max-h-[90vh] overflow-y-auto custom-scrollbar">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 via-purple-500 to-cyan-500" />
        
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-500 hover:text-white transition-colors p-2 hover:bg-white/5 rounded-full"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="mb-8 text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-full flex items-center justify-center mb-4 border border-cyan-500/30 mx-auto">
             <MessageCircle className="w-8 h-8 text-cyan-400" />
          </div>
          <h2 className="text-3xl font-bold text-white mb-2">Ask the HiveMind</h2>
          <p className="text-slate-400 text-sm">Your question will be instantly translated to experts worldwide.</p>
        </div>

        {!session ? (
          <div className="text-center py-6 bg-slate-950/50 rounded-2xl border border-white/5 p-6">
             <p className="text-slate-300 mb-6">You must be logged in to broadcast a question to the global network.</p>
             <div className="space-y-3">
               <button 
                   onClick={onLoginGoogle}
                   className="flex items-center justify-center gap-2 w-full px-5 py-4 bg-white text-slate-950 font-bold rounded-xl hover:bg-gray-100 transition-all shadow-lg"
                 >
                   <Mail className="w-5 h-5" />
                   Login with Google
               </button>
               <button 
                   onClick={onLoginGithub}
                   className="flex items-center justify-center gap-2 w-full px-5 py-4 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl border border-slate-700 transition-all"
                 >
                   <Github className="w-5 h-5" />
                   Login with GitHub
               </button>
             </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="block text-xs font-bold text-cyan-400 uppercase tracking-widest">Question</label>
              <input 
                type="text" 
                placeholder="e.g. Best strategies for..." 
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-4 text-white placeholder:text-slate-600 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all text-lg"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                autoFocus
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest">Language</label>
                <div className="relative">
                  <select 
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-500 transition-all appearance-none"
                    value={formData.language}
                    onChange={(e) => setFormData({...formData, language: e.target.value})}
                  >
                    <option>English</option>
                    <option>Ukrainian</option>
                    <option>Japanese</option>
                    <option>Spanish</option>
                    <option>German</option>
                    <option>French</option>
                    <option>Chinese</option>
                  </select>
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                    <Globe className="w-4 h-4 text-slate-500" />
                  </div>
                </div>
              </div>
               <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest">Category</label>
                <div className="relative">
                  <select 
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-500 transition-all appearance-none"
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                  >
                    <option>Life & Advice</option>
                    <option>School & Education</option>
                    <option>Gaming</option>
                    <option>Technology</option>
                    <option>Relationships</option>
                    <option>Art & Music</option>
                  </select>
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                    <Code2 className="w-4 h-4 text-slate-500" />
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-2">
               <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest">Context (Optional)</label>
               <textarea 
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white placeholder:text-slate-600 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all min-h-[100px] resize-none"
                  placeholder="Provide more details to get better answers..."
                  value={formData.details}
                  onChange={(e) => setFormData({...formData, details: e.target.value})}
               />
            </div>

            <button 
              type="submit" 
              className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold py-4 rounded-xl shadow-lg shadow-cyan-500/25 transition-all flex items-center justify-center gap-2 group transform hover:-translate-y-1"
            >
              <span className="relative flex h-3 w-3 mr-1">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-white/50"></span>
              </span>
              Broadcast to Network
              <Send className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

// 6. Leaderboard Modal Component
const LeaderboardModal = ({ isOpen, onClose, supabase }) => {
  const [leaders, setLeaders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen && supabase) {
      fetchLeaders();
    }
  }, [isOpen, supabase]);

  const fetchLeaders = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('xp', { ascending: false })
        .limit(10);
      
      if (error) throw error;
      setLeaders(data || []);
    } catch (err) {
      console.error("Error fetching leaderboard:", err);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-slate-950/90 backdrop-blur-xl transition-opacity" 
        onClick={onClose}
      />
      
      <div className="relative w-full max-w-md bg-slate-900 border border-amber-500/20 rounded-3xl shadow-[0_0_80px_rgba(245,158,11,0.15)] p-0 animate-scale-in overflow-hidden flex flex-col max-h-[80vh]">
        
        <div className="p-6 pb-4 border-b border-white/5 bg-gradient-to-b from-amber-500/10 to-transparent relative">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-amber-500 to-transparent opacity-50" />
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 text-slate-500 hover:text-white transition-colors p-2 hover:bg-white/5 rounded-full"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="flex items-center gap-3">
            <div className="p-3 bg-amber-500/20 rounded-xl border border-amber-500/30">
               <Trophy className="w-6 h-6 text-amber-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Top Nodes</h2>
              <p className="text-xs text-amber-500/70 font-bold uppercase tracking-widest">Global Ranking</p>
            </div>
          </div>
        </div>

        <div className="overflow-y-auto p-4 space-y-2 custom-scrollbar">
          {loading ? (
             <div className="flex flex-col items-center justify-center py-10">
                <Loader2 className="w-8 h-8 text-amber-500 animate-spin mb-2" />
                <p className="text-xs text-slate-500 font-mono">CALCULATING RANK...</p>
             </div>
          ) : (
            leaders.map((user, index) => {
              const rank = index + 1;
              let rankStyle = "bg-slate-800 text-slate-400 border-slate-700";
              let icon = null;

              if (rank === 1) {
                rankStyle = "bg-yellow-500/20 text-yellow-300 border-yellow-500/50 shadow-[0_0_15px_rgba(234,179,8,0.2)]";
                icon = <Crown className="w-3 h-3 text-yellow-400 absolute -top-1 -right-1 transform rotate-12" />;
              } else if (rank === 2) {
                rankStyle = "bg-slate-300/20 text-slate-300 border-slate-400/50";
              } else if (rank === 3) {
                rankStyle = "bg-orange-700/20 text-orange-300 border-orange-700/50";
              }

              return (
                <div key={user.id} className="flex items-center gap-4 p-3 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors group">
                  <div className={`relative w-8 h-8 flex items-center justify-center rounded-lg border font-bold text-sm ${rankStyle}`}>
                    {rank}
                    {icon}
                  </div>
                  
                  <div className="w-10 h-10 rounded-full bg-slate-800 overflow-hidden ring-2 ring-white/10 group-hover:ring-cyan-500/50 transition-all">
                    <img 
                      src={user.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.full_name}`} 
                      alt={user.full_name} 
                      className="w-full h-full object-cover" 
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-bold text-white truncate">{user.full_name || 'Anonymous Node'}</h4>
                    <p className="text-[10px] text-slate-500 truncate">Node ID: {user.id.slice(0, 8)}...</p>
                  </div>

                  <div className="text-right">
                    <span className="block text-sm font-bold text-amber-400">{user.xp} XP</span>
                    <span className="text-[10px] text-slate-600 uppercase font-bold">Lvl {Math.floor(user.xp / 1000) + 1}</span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};


// 7. Visual Hook (Premium Complex SoftSphere)
const SoftSphere = () => {
  return (
    <div className="relative w-full h-[500px] md:h-[600px] flex items-center justify-center perspective-1000 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/20 via-purple-500/20 to-transparent blur-[100px] rounded-full animate-pulse" />
      
      <div className="relative w-64 h-64 md:w-96 md:h-96 animate-slow-spin transform-style-3d">
        <div className="absolute inset-0 border border-cyan-400/30 rounded-full shadow-[0_0_30px_rgba(6,182,212,0.1)]" />
        <div className="absolute inset-0 border border-purple-500/30 rounded-full rotate-45 shadow-[0_0_30px_rgba(168,85,247,0.1)]" />
        <div className="absolute inset-0 border border-white/10 rounded-full rotate-90" />
        
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-6 w-12 h-12 animate-orbit-1">
           <div className="w-full h-full bg-slate-900/90 backdrop-blur-md border border-cyan-400 p-2 rounded-xl shadow-[0_0_25px_rgba(6,182,212,0.4)] flex items-center justify-center animate-counter-spin">
              <span className="text-cyan-300 font-bold text-xs">JP</span>
           </div>
        </div>
        
        <div className="absolute bottom-10 right-0 w-12 h-12 animate-orbit-2">
           <div className="w-full h-full bg-slate-900/90 backdrop-blur-md border border-purple-500 p-2 rounded-xl shadow-[0_0_25px_rgba(168,85,247,0.4)] flex items-center justify-center animate-counter-spin">
              <span className="text-purple-300 font-bold text-xs">UA</span>
           </div>
        </div>

        <div className="absolute top-1/2 left-0 -translate-x-6 w-auto h-auto animate-orbit-3">
           <div className="bg-emerald-900/90 backdrop-blur-md border border-emerald-500 px-3 py-1 rounded-full shadow-[0_0_25px_rgba(16,185,129,0.4)] animate-counter-spin">
              <span className="text-emerald-300 font-mono text-[10px] font-bold">+50 XP</span>
           </div>
        </div>

        <div className="absolute inset-0 m-auto w-32 h-32 bg-slate-900/60 backdrop-blur-md rounded-full border border-white/20 flex items-center justify-center shadow-[inset_0_0_30px_rgba(255,255,255,0.1)]">
           <Globe className="w-16 h-16 text-white/90 drop-shadow-[0_0_15px_rgba(255,255,255,0.6)] animate-pulse" />
        </div>
      </div>
    </div>
  );
};

// 8. Hero Section
const Hero = ({ onOpenModal, onLogin }) => {
  return (
    <section className="relative pt-32 pb-20 px-6 flex flex-col items-center justify-center overflow-hidden">
      
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl pointer-events-none z-0">
         <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-cyan-500/10 rounded-full blur-[120px] mix-blend-screen animate-pulse" style={{animationDuration: '4s'}}></div>
         <div className="absolute bottom-0 right-[-10%] w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-[120px] mix-blend-screen animate-pulse" style={{animationDuration: '7s'}}></div>
      </div>

      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none z-0"></div>

      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
        
        <div className="text-left space-y-8 max-w-full">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md shadow-[0_0_15px_rgba(6,182,212,0.15)] animate-fade-in">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
            </span>
            <span className="text-xs font-mono text-cyan-300 tracking-wider font-bold">HYBRID INTELLIGENCE NETWORK</span>
          </div>

          <div className="space-y-4 animate-slide-in">
            <h1 className="text-5xl sm:text-6xl md:text-8xl font-bold tracking-tighter text-white leading-[0.9] break-words">
              Global Mind.<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-blue-400 to-purple-500 drop-shadow-[0_0_30px_rgba(6,182,212,0.3)]">
                Zero Barriers.
              </span>
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl text-slate-300 max-w-xl leading-relaxed font-light">
              Ask about <span className="text-white font-semibold border-b border-cyan-500/50">Life</span> or <span className="text-white font-semibold border-b border-purple-500/50">Tech</span>. 
              Get answers from everywhere.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-5 animate-slide-in" style={{animationDelay: '0.2s'}}>
            <button 
              onClick={onOpenModal}
              className="group relative px-8 py-5 bg-white text-slate-950 rounded-xl font-bold text-xl overflow-hidden transition-all hover:scale-105 shadow-[0_0_40px_-5px_rgba(6,182,212,0.4)] hover:shadow-[0_0_60px_-5px_rgba(6,182,212,0.6)]"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-300 via-white to-cyan-300 opacity-0 group-hover:opacity-50 transition-opacity duration-500 blur-lg" />
              <span className="relative flex items-center gap-2 justify-center">
                Join the HiveMind <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
              </span>
            </button>
            <button className="px-8 py-5 bg-white/5 border border-white/20 text-white rounded-xl font-bold text-xl backdrop-blur-sm hover:bg-white/10 hover:border-white/40 transition-all flex items-center justify-center gap-2">
               <ShieldCheck className="w-6 h-6 text-slate-300" />
               View Protocol
            </button>
          </div>

          <div className="pt-10 flex flex-wrap items-center gap-6 sm:gap-10 border-t border-white/10 animate-fade-in" style={{animationDelay: '0.4s'}}>
            <div>
              <p className="text-2xl sm:text-3xl font-mono font-bold text-white drop-shadow-md">12k+</p>
              <p className="text-[10px] sm:text-xs text-cyan-200/70 uppercase tracking-widest font-semibold">Active Nodes</p>
            </div>
            <div>
              <p className="text-2xl sm:text-3xl font-mono font-bold text-white drop-shadow-md">40+</p>
              <p className="text-[10px] sm:text-xs text-cyan-200/70 uppercase tracking-widest font-semibold">Languages</p>
            </div>
            <div>
              <p className="text-2xl sm:text-3xl font-mono font-bold text-white drop-shadow-md">∞XP</p>
              <p className="text-[10px] sm:text-xs text-cyan-200/70 uppercase tracking-widest font-semibold">Knowledge Mined</p>
            </div>
          </div>
        </div>

        <div className="relative">
          <SoftSphere />
        </div>
      </div>
    </section>
  );
};


// --- Main App Component ---

const App = () => {
  const [supabase, setSupabase] = useState(null);
  const [session, setSession] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLeaderboardOpen, setIsLeaderboardOpen] = useState(false);
  const [userXP, setUserXP] = useState(0); 
  const [toastMessage, setToastMessage] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [configError, setConfigError] = useState(null);
  
  const userLevel = Math.floor(userXP / 1000) + 1;
  const levelProgress = ((userXP % 1000) / 1000) * 100;

  // --- Initialize Supabase Dynamically ---
  useEffect(() => {
    const initSupabase = async () => {
      // Configuration Check
      if (supabaseUrl === "INSERT_SUPABASE_URL" || !supabaseUrl.startsWith("http")) {
         setConfigError("Configuration Required");
         return;
      }

      try {
        // Dynamically import Supabase to avoid build-time errors with URL imports
        const { createClient } = await import('https://esm.sh/@supabase/supabase-js@2');
        const client = createClient(supabaseUrl, supabaseAnonKey);
        setSupabase(client);
      } catch (e) {
        console.error("Failed to load Supabase:", e);
        setConfigError("Failed to load Supabase library.");
      }
    };
    initSupabase();
  }, []);

  // --- Session & Auth ---
  useEffect(() => {
    if (!supabase) return;

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, [supabase]);

  // --- Profile Sync (Persistent XP) ---
  useEffect(() => {
    if (session && supabase) {
      const fetchProfile = async () => {
        const { data, error } = await supabase
          .from('profiles')
          .select('xp')
          .eq('id', session.user.id)
          .single();

        if (data) {
          setUserXP(data.xp || 0);
        } else if (error) {
          console.error("Error fetching profile:", error);
        }
      };
      fetchProfile();
    } else {
      setUserXP(0);
    }
  }, [session, supabase]);

  // --- Data Fetching ---
  useEffect(() => {
    if (supabase) {
      fetchQuestions();
    }
  }, [supabase]);

  const fetchQuestions = async () => {
    if (!supabase) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('questions')
        .select('*, replies(*)')
        .order('created_at', { ascending: false, foreignTable: 'replies' })
        .order('created_at', { ascending: false });

      if (error) throw error;

      const formattedQuestions = data.map(q => {
        const { flag, country } = getFlagAndCountry(q.language);
        return {
          id: q.id,
          name: q.author_name || 'Anonymous',
          country: country,
          flag: flag,
          avatarUrl: q.author_avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${q.author_name}`,
          timeAgo: formatTimeAgo(q.created_at),
          questionOriginal: q.text,
          questionTranslated: q.text + " (AI Translated)", 
          xp: q.xp_reward || 0,
          comments: q.replies ? q.replies.length : 0,
          replies: q.replies ? q.replies.map(r => ({
            id: r.id,
            author: r.author_name,
            text: r.text,
            time: formatTimeAgo(r.created_at),
            avatar: r.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${r.author_name}`
          })) : [],
          isNew: false 
        };
      });

      setQuestions(formattedQuestions);
    } catch (error) {
      console.error('Error fetching questions:', error);
    } finally {
      setLoading(false);
    }
  };

  // --- Realtime Subscriptions (INSERT Only) ---
  useEffect(() => {
    if (!supabase) return;

    const channel = supabase
      .channel('realtime_feed')
      // Listener for New Questions
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'questions' }, (payload) => {
        const newQ = payload.new;
        const { flag, country } = getFlagAndCountry(newQ.language);
        
        const formattedQuestion = {
          id: newQ.id,
          name: newQ.author_name || 'Anonymous',
          country: country,
          flag: flag,
          avatarUrl: newQ.author_avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${newQ.author_name}`,
          timeAgo: 'Just now', // Realtime items are always fresh
          questionOriginal: newQ.text,
          questionTranslated: newQ.text + " (AI Translated)", 
          xp: newQ.xp_reward || 0,
          comments: 0,
          replies: [],
          isNew: true // Triggers animation
        };

        setQuestions((prev) => [formattedQuestion, ...prev]);
        // REMOVED: setToastMessage() to reduce noise
      })
      // Listener for New Replies
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'replies' }, (payload) => {
        const newReply = payload.new;
        const formattedReply = {
          id: newReply.id,
          author: newReply.author_name,
          text: newReply.text,
          time: 'Just now',
          avatar: newReply.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${newReply.author_name}`
        };

        setQuestions((prevQuestions) => 
          prevQuestions.map((q) => {
            if (q.id === newReply.question_id) {
              const updatedReplies = [formattedReply, ...(q.replies || [])];
              return {
                ...q,
                replies: updatedReplies,
                comments: (q.comments || 0) + 1 // Increment comment count immediately
              };
            }
            return q;
          })
        );
        // REMOVED: setToastMessage() to reduce noise
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase]);

  // --- Auth Actions ---
  const handleLoginGithub = async () => {
    if (!supabase) return;
    try {
      await supabase.auth.signInWithOAuth({
        provider: 'github',
        options: {
          redirectTo: window.location.origin
        }
      });
    } catch (error) {
      console.error("GitHub Login failed:", error);
      alert("Login failed. Check console.");
    }
  };

  const handleLoginGoogle = async () => {
    if (!supabase) return;
    try {
      await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin
        }
      });
    } catch (error) {
      console.error("Google Login failed:", error);
      alert("Login failed. Check console.");
    }
  };

  const handleLogout = async () => {
    if (!supabase) return;
    try {
      await supabase.auth.signOut();
      setSession(null);
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  // Gamification Logic with Persistence
  const handleAddXP = async (amount, reason) => {
    // 1. Calculate new XP locally
    const newXP = userXP + amount;
    
    // 2. Optimistic UI Update
    setUserXP(newXP);
    setToastMessage(`+${amount} XP - ${reason}`);
    setTimeout(() => setToastMessage(null), 3000);

    // 3. Persist to Supabase Database
    if (session && supabase) {
      try {
        const { error } = await supabase
          .from('profiles')
          .update({ xp: newXP })
          .eq('id', session.user.id);
        
        if (error) {
          console.error("Error persisting XP:", error);
        }
      } catch (err) {
        console.error("Failed to update profile XP:", err);
      }
    }
  };

  const handleAddQuestion = async (formData) => {
    if (!supabase) return;
    try {
      if (!session) {
        alert("You must be logged in to ask a question.");
        return;
      }

      const newQuestionPayload = {
        text: formData.title,
        language: formData.language,
        category: formData.category, 
        author_name: session.user.user_metadata.full_name || session.user.email,
        xp_reward: 50
      };

      const { data, error } = await supabase
        .from('questions')
        .insert([newQuestionPayload])
        .select();

      if (error) throw error;

      if (data && data.length > 0) {
        // No need to fetchQuestions() because realtime subscription handles it!
        // Just handle local XP update
        handleAddXP(50, "Posted Question");
        setIsModalOpen(false);
      }

    } catch (error) {
      console.error('Error adding question:', error);
      alert('Failed to post question. See console.');
    }
  };

  const handleSubmitAnswer = async (questionId, text) => {
    if (!supabase) {
        alert("System connecting, please wait...");
        return;
    }
    if (!session) {
      alert("Please login to submit an answer.");
      return;
    }

    try {
      const replyPayload = {
        question_id: questionId,
        text: text,
        author_name: session.user.user_metadata.full_name || session.user.email,
        avatar: session.user.user_metadata.avatar_url
      };

      const { data, error } = await supabase
        .from('replies')
        .insert([replyPayload])
        .select();

      if (error) throw error;

      if (data && data.length > 0) {
        // No need to fetchQuestions() because realtime subscription handles it!
        handleAddXP(100, "Solution Provided");
      }
    } catch (error) {
      console.error('Error adding reply:', error);
      alert('Failed to post reply.');
    }
  };

  // --- Configuration Error Screen ---
  if (configError) {
    return (
        <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 text-center">
            <div className="bg-red-500/10 border border-red-500/20 p-8 rounded-2xl max-w-lg shadow-[0_0_40px_rgba(239,68,68,0.1)]">
                <div className="mx-auto w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center mb-4">
                    <AlertTriangle className="w-6 h-6 text-red-400" />
                </div>
                <h2 className="text-xl font-bold text-red-400 mb-4">Configuration Required</h2>
                <p className="text-slate-300 mb-6 text-sm leading-relaxed">
                    The app cannot connect to the neural network because the Supabase URL is missing. This is a security feature to prevent connection to a non-existent database.
                </p>
                <div className="bg-slate-900 p-4 rounded-lg text-left text-xs font-mono text-slate-400 mb-6 overflow-x-auto border border-white/5">
                     <span className="text-slate-500">// Edit lines 11-12 in App.jsx</span><br/>
                     <span className="text-purple-400">const</span> <span className="text-blue-400">supabaseUrl</span> = <span className="text-green-400">"YOUR_SUPABASE_URL"</span>;<br/>
                     <span className="text-purple-400">const</span> <span className="text-blue-400">supabaseAnonKey</span> = <span className="text-green-400">"YOUR_SUPABASE_KEY"</span>;
                </div>
                <p className="text-slate-500 text-xs">
                    Please edit the code on the right to add your Supabase project credentials.
                </p>
            </div>
        </div>
    );
  }

  if (!supabase) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-200 flex flex-col items-center justify-center">
         <div className="relative">
           <div className="absolute inset-0 bg-cyan-500/20 blur-xl rounded-full"></div>
           <Loader2 className="w-16 h-16 text-cyan-500 animate-spin relative z-10" />
         </div>
         <p className="mt-8 font-mono text-cyan-400 animate-pulse tracking-widest text-sm">INITIALIZING NEURAL LINK...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-indigo-500/30 selection:text-white overflow-x-hidden w-full">
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
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(-10px); }
          50% { transform: translateY(10px); }
        }
        .animate-bounce-slow {
          animation: bounce-slow 4s ease-in-out infinite;
        }
         @keyframes bounce-delayed {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-15px); }
        }
        .animate-bounce-delayed {
          animation: bounce-delayed 5s ease-in-out infinite 1s;
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
        @keyframes scale-in {
          0% { transform: scale(0.95); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }
        .animate-scale-in {
          animation: scale-in 0.2s ease-out forwards;
        }
        @keyframes bounce-in {
          0% { transform: translate(-50%, 100%); opacity: 0; }
          60% { transform: translate(-50%, -10%); opacity: 1; }
          80% { transform: translate(-50%, 5%); }
          100% { transform: translate(-50%, 0); }
        }
        .animate-bounce-in {
          animation: bounce-in 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
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
      `}</style>

      {/* Navbar with RPG HUD */}
      <Navbar 
        onOpenModal={() => setIsModalOpen(true)} 
        onOpenLeaderboard={() => setIsLeaderboardOpen(true)}
        xp={userXP} 
        level={userLevel} 
        xpProgress={levelProgress} 
        session={session}
        onLoginGithub={handleLoginGithub}
        onLoginGoogle={handleLoginGoogle}
        onLogout={handleLogout}
      />
      
      <main className="w-full overflow-hidden">
        <Hero onOpenModal={() => setIsModalOpen(true)} onLogin={handleLoginGithub} />
        <LanguageTicker />
        
        {/* Question Feed */}
        <section className="py-24 px-6 relative z-10 w-full overflow-hidden">
          {/* Section Background Decor */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-5xl h-full bg-cyan-900/10 blur-[100px] -z-10 rounded-full mix-blend-screen" />

          <div className="max-w-3xl mx-auto w-full">
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
              <div className="space-y-6 w-full">
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
                    />
                  ))
                )}
              </div>
            )}
            
            <div className="mt-12 text-center">
              <button className="text-sm font-bold text-slate-500 hover:text-cyan-400 transition-colors flex items-center justify-center gap-2 mx-auto">
                View Global Feed <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800 bg-slate-900 py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
             <Cpu className="w-5 h-5 text-cyan-500" />
             <span className="text-base font-bold text-slate-400">Connectum.</span>
          </div>
          <div className="flex gap-8 text-sm text-slate-500">
             <a href="#" className="hover:text-white transition-colors">Privacy</a>
             <a href="#" className="hover:text-white transition-colors">Terms</a>
             <a href="#" className="hover:text-white transition-colors">Contact</a>
          </div>
          <div className="text-sm text-slate-600">
            © 2024 Connectum Network.
          </div>
        </div>
      </footer>

      {/* FAB */}
      <button 
        onClick={() => setIsModalOpen(true)}
        className="fixed bottom-8 right-8 z-40 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white p-4 rounded-full shadow-2xl hover:scale-110 transition-transform shadow-cyan-500/40"
      >
        <Plus className="w-6 h-6" />
      </button>

      {/* Level Up / XP Toast */}
      <XPToast 
        message={toastMessage} 
        isVisible={!!toastMessage} 
      />

      {/* Modals */}
      <AskQuestionModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSubmit={handleAddQuestion} 
        session={session}
        onLoginGithub={handleLoginGithub}
        onLoginGoogle={handleLoginGoogle}
      />
      
      <LeaderboardModal 
        isOpen={isLeaderboardOpen}
        onClose={() => setIsLeaderboardOpen(false)}
        supabase={supabase}
      />
    </div>
  );
};

export default App;