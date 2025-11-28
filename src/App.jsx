import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { 
  Globe, 
  Zap, 
  MessageCircle, 
  Cpu, 
  ArrowRight, 
  Activity,
  Languages,
  Menu,
  X,
  Sparkles,
  MessageSquare,
  Plus,
  Loader2,
  Send,
  Trophy,
  CheckCircle2,
  Github,
  LogOut,
  User as UserIcon
} from 'lucide-react';

// --- 1. НАСТРОЙКА БАЗЫ ДАННЫХ (ЖЕЛЕЗОБЕТОННАЯ) ---
// Мы создаем клиента ОДИН РАЗ здесь. Больше никаких new Client внутри App.
const supabaseUrl = "https://hwzlhbcuqbsnrtfmnmpu.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh3emxoYmN1cWJzbnJ0Zm1ubXB1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQyNDQ1NjEsImV4cCI6MjA3OTgyMDU2MX0.W743aZZ-XuyS-vY7cPBz9_cAjz_8s4SCvJ6gpCkERCw";

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
  return `${Math.floor(hours / 24)}d ago`;
};

const getFlagAndCountry = (language) => {
  switch (language) {
    case 'Ukrainian': return { flag: '🇺🇦', country: 'UA' };
    case 'Japanese': return { flag: '🇯🇵', country: 'JP' };
    case 'Spanish': return { flag: '🇪🇸', country: 'ES' };
    case 'German': return { flag: '🇩🇪', country: 'DE' };
    case 'French': return { flag: '🇫🇷', country: 'FR' };
    default: return { flag: '🇺🇸', country: 'US' };
  }
};

// --- Components ---

// Navbar
const Navbar = ({ onOpenModal, xp, level, xpProgress, session, onLogin, onLogout }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b ${
      isScrolled ? 'bg-slate-900/90 backdrop-blur-xl border-slate-800 py-3' : 'bg-transparent border-transparent py-5'
    }`}>
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        <div className="flex items-center gap-2 group cursor-pointer" onClick={() => window.scrollTo(0,0)}>
          <div className="relative flex items-center justify-center w-10 h-10 bg-indigo-500/10 rounded-xl border border-indigo-500/20">
            <Cpu className="w-6 h-6 text-indigo-400" />
          </div>
          <span className="text-xl font-bold tracking-tight text-white">Connectum</span>
        </div>

        <div className="hidden md:flex items-center gap-8">
          {['Explore', 'Community', 'Manifesto'].map((item) => (
            <a key={item} href="#" className="text-sm font-medium text-slate-400 hover:text-white transition-colors">{item}</a>
          ))}
          
          <div className="flex items-center gap-4 pl-8 border-l border-slate-800">
            {!session ? (
              <button 
                onClick={onLogin}
                className="flex items-center gap-2 px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-white text-sm font-bold rounded-xl border border-slate-700 transition-all group"
              >
                <Github className="w-4 h-4 group-hover:text-white text-slate-400 transition-colors" />
                Login with GitHub
              </button>
            ) : (
              <>
                <div className="flex flex-col items-end">
                  <div className="flex items-center gap-2 mb-1">
                     <span className="text-xs font-bold text-amber-400 tracking-wider">LVL {level} MEMBER</span>
                     <span className="text-[10px] font-mono text-slate-500">{xp}/1000 XP</span>
                  </div>
                  <div className="w-32 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-amber-500 to-yellow-300" style={{ width: `${xpProgress}%` }} />
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="relative group cursor-pointer">
                    <div className="w-10 h-10 rounded-full bg-indigo-600 p-0.5 ring-2 ring-indigo-500/30 group-hover:ring-indigo-400 transition-all overflow-hidden">
                       <img 
                          src={session.user.user_metadata.avatar_url} 
                          alt="User" 
                          className="w-full h-full rounded-full object-cover bg-slate-900" 
                       />
                    </div>
                  </div>
                  
                  <button onClick={onLogout} className="p-2 text-slate-500 hover:text-white hover:bg-slate-800 rounded-lg transition-colors" title="Log Out">
                    <LogOut className="w-5 h-5" />
                  </button>
                </div>

                <button onClick={onOpenModal} className="ml-2 w-10 h-10 flex items-center justify-center rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/20 transition-all">
                  <Plus className="w-5 h-5" />
                </button>
              </>
            )}
          </div>
        </div>

        <button className="md:hidden text-slate-300" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          {mobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="absolute top-full left-0 w-full bg-slate-900 border-b border-slate-800 p-6 md:hidden flex flex-col gap-4 shadow-2xl">
          {session ? (
            <>
              <div className="flex items-center gap-4 pb-4 border-b border-slate-800">
                 <div className="w-12 h-12 rounded-full bg-indigo-600 overflow-hidden">
                     <img src={session.user.user_metadata.avatar_url} alt="User" className="w-full h-full object-cover" />
                 </div>
                 <div>
                   <div className="text-white font-bold">{session.user.user_metadata.full_name}</div>
                   <div className="text-amber-400 text-xs font-bold">Lvl {level} • {xp} XP</div>
                 </div>
              </div>
              <button onClick={() => { onOpenModal(); setMobileMenuOpen(false); }} className="w-full py-3 bg-indigo-600 text-white rounded-lg font-bold">Ask Question</button>
              <button onClick={() => { onLogout(); setMobileMenuOpen(false); }} className="w-full py-3 bg-slate-800 text-slate-300 rounded-lg font-bold">Log Out</button>
            </>
          ) : (
            <button onClick={() => { onLogin(); setMobileMenuOpen(false); }} className="w-full py-3 bg-slate-800 text-white rounded-lg font-bold flex items-center justify-center gap-2">
              <Github className="w-5 h-5" /> Login with GitHub
            </button>
          )}
        </div>
      )}
    </nav>
  );
};

// Language Ticker
const LanguageTicker = () => {
  const connections = [
    { from: 'UA', to: 'JP', time: '0.2s' }, { from: 'EN', to: 'ES', time: '0.1s' },
    { from: 'FR', to: 'KR', time: '0.3s' }, { from: 'DE', to: 'PT', time: '0.2s' },
    { from: 'CN', to: 'IT', time: '0.4s' }, { from: 'TR', to: 'RU', time: '0.1s' },
  ];
  return (
    <div className="w-full bg-slate-900/50 border-y border-slate-800/50 overflow-hidden py-3 backdrop-blur-sm relative z-20">
      <div className="flex w-[200%] animate-marquee">
        {[...connections, ...connections, ...connections].map((conn, i) => (
          <div key={i} className="flex items-center gap-3 px-8 opacity-50 hover:opacity-100 transition-opacity cursor-default">
            <span className="text-[10px] font-mono text-indigo-400 uppercase tracking-widest">Bridging</span>
            <div className="flex items-center gap-2 px-2 py-1 rounded bg-slate-800 border border-slate-700">
              <span className="font-semibold text-slate-200 text-xs">{conn.from}</span>
              <Activity className="w-3 h-3 text-sky-400" />
              <span className="font-semibold text-slate-200 text-xs">{conn.to}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Question Card
const QuestionCard = ({ data, onSubmitAnswer, session, onLogin }) => {
  const [translated, setTranslated] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isSimulatingAI, setIsSimulatingAI] = useState(data.isNew || false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [answerText, setAnswerText] = useState("");

  useEffect(() => {
    if (isSimulatingAI) {
      const timer = setTimeout(() => setIsSimulatingAI(false), 2000); 
      return () => clearTimeout(timer);
    }
  }, [isSimulatingAI]);

  const handleAnswerSubmit = () => {
    if (!session) {
      alert("Please login to answer questions.");
      onLogin(); // Auto trigger login
      return;
    }
    if (!answerText.trim()) return;
    onSubmitAnswer(data.id, answerText);
    setAnswerText("");
  };

  return (
    <div 
      className={`relative p-5 rounded-2xl bg-slate-800/40 border border-slate-700 hover:border-indigo-500/30 transition-all duration-500 hover:bg-slate-800/60 group ${data.isNew ? 'animate-slide-in' : ''}`}
      onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-indigo-500/20 overflow-hidden">
             {data.avatarUrl ? <img src={data.avatarUrl} alt="Avatar" className="w-full h-full object-cover" /> : <span>{data.avatar}</span>}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-bold text-white">{data.name}</h4>
              <span className="text-xs bg-slate-700 px-1.5 py-0.5 rounded text-slate-300 flex items-center gap-1">{data.flag} {data.country}</span>
            </div>
            <p className="text-xs text-slate-500">{data.timeAgo}</p>
          </div>
        </div>
        <div className="flex items-center gap-1 text-amber-400 bg-amber-400/10 px-2 py-1 rounded-full border border-amber-400/20">
          <Zap className="w-3 h-3 fill-current" />
          <span className="text-xs font-bold">{data.xp} XP</span>
        </div>
      </div>

      <div className="mb-4 min-h-[80px]">
        {isSimulatingAI ? (
          <div className="flex flex-col items-center justify-center py-6 space-y-3 animate-pulse">
            <Loader2 className="w-8 h-8 text-indigo-400 animate-spin" />
            <p className="text-xs font-mono text-indigo-300">ANALYZING LANGUAGE PATTERNS...</p>
          </div>
        ) : (
          <div className="space-y-3 animate-fade-in">
            <div className={`transition-all duration-500 ${translated ? 'opacity-40 scale-98 origin-left' : 'opacity-100'}`}>
              <p className="text-lg text-slate-200 font-medium leading-relaxed">"{data.questionOriginal}"</p>
            </div>
            <div className={`overflow-hidden transition-all duration-500 ease-in-out ${translated ? 'max-h-24 opacity-100' : 'max-h-0 opacity-0'}`}>
              <div className="flex gap-3 pl-4 border-l-2 border-indigo-500">
                <Sparkles className="w-5 h-5 text-indigo-400 flex-shrink-0 mt-1" />
                <p className="text-lg text-indigo-100 font-medium leading-relaxed">{data.questionTranslated}</p>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-slate-700/50">
        <button onClick={() => !isSimulatingAI && setTranslated(!translated)} disabled={isSimulatingAI} className={`flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors ${translated ? 'bg-indigo-500/20 text-indigo-300' : 'bg-slate-700/50 text-slate-400 hover:text-white hover:bg-slate-700'}`}>
          <Languages className="w-3.5 h-3.5" /> {translated ? 'Show Original' : 'AI Translate'}
        </button>
        <div className="flex items-center gap-4">
           <button onClick={() => setIsExpanded(!isExpanded)} className="text-slate-500 hover:text-white transition-colors flex items-center gap-1.5 text-xs font-medium">
             <MessageSquare className="w-4 h-4" /> {data.comments}
           </button>
           <button onClick={() => !isSimulatingAI && setIsExpanded(!isExpanded)} className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-colors shadow-sm ${isExpanded ? 'bg-indigo-100 text-indigo-900' : 'bg-white text-slate-900 hover:bg-indigo-50'}`}>
             {isExpanded ? 'Close' : 'Answer'}
           </button>
        </div>
      </div>

      {isExpanded && (
        <div className="mt-4 pt-4 border-t border-slate-700/50 animate-fade-in">
          {data.replies && data.replies.length > 0 && (
            <div className="mb-4 space-y-3">
              <h5 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Top Answers</h5>
              {data.replies.map((reply) => (
                <div key={reply.id} className="bg-slate-950/50 rounded-lg p-3 border border-slate-800 flex gap-3">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-slate-800 overflow-hidden">
                    <img src={reply.avatar} alt={reply.author} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-indigo-300">{reply.author}</span>
                      <span className="text-[10px] text-slate-500">{reply.time}</span>
                    </div>
                    <p className="text-sm text-slate-300 leading-relaxed">{reply.text}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
          <div className="relative">
            {!session && (
              <div className="absolute inset-0 z-10 bg-slate-950/80 backdrop-blur-[2px] flex flex-col items-center justify-center rounded-xl border border-slate-800">
                 <p className="text-slate-400 text-sm mb-3">Join the HiveMind to answer</p>
                 <button onClick={onLogin} className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-lg transition-colors">
                   <Github className="w-3 h-3" /> Login
                 </button>
              </div>
            )}
            <textarea 
              value={answerText}
              onChange={(e) => setAnswerText(e.target.value)}
              placeholder={session ? "Type your answer here..." : "Login to answer..."}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 pr-12 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all resize-none min-h-[80px]"
              disabled={!session}
            />
            <button 
              onClick={handleAnswerSubmit}
              disabled={!answerText.trim() || !session}
              className="absolute bottom-3 right-3 p-2 bg-emerald-500 hover:bg-emerald-600 disabled:bg-slate-800 disabled:text-slate-600 text-white rounded-lg transition-colors shadow-lg shadow-emerald-500/20"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// Ask Modal
const AskQuestionModal = ({ isOpen, onClose, onSubmit, session, onLogin }) => {
  const [formData, setFormData] = useState({ title: '', language: 'English', details: '' });
  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!session) {
      alert("Please login to post a question.");
      onLogin(); return;
    }
    if (!formData.title) return;
    onSubmit(formData);
    setFormData({ title: '', language: 'English', details: '' });
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm transition-opacity" onClick={onClose} />
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl p-6 md:p-8 animate-scale-in">
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-500 hover:text-white"><X className="w-5 h-5" /></button>
        <div className="mb-6">
          <div className="w-12 h-12 bg-indigo-500/10 rounded-full flex items-center justify-center mb-4 border border-indigo-500/20">
             <MessageCircle className="w-6 h-6 text-indigo-400" />
          </div>
          <h2 className="text-2xl font-bold text-white">Ask the HiveMind</h2>
        </div>

        {!session ? (
          <div className="text-center py-8">
             <p className="text-slate-300 mb-6">You must be logged in to broadcast a question.</p>
             <button onClick={onLogin} className="flex items-center justify-center gap-2 w-full px-5 py-4 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl border border-slate-700 transition-all">
                 <Github className="w-5 h-5" /> Login with GitHub to Continue
             </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wide mb-2">Question Title</label>
              <input type="text" placeholder="e.g. Best framework for 3D web apps?" className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-white focus:border-indigo-500 transition-all" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} autoFocus />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wide mb-2">Source Language</label>
                <select className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-white focus:border-indigo-500 transition-all appearance-none" value={formData.language} onChange={(e) => setFormData({...formData, language: e.target.value})}>
                  <option>English</option><option>Ukrainian</option><option>Japanese</option><option>Spanish</option><option>German</option>
                </select>
              </div>
               <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wide mb-2">Category</label>
                <select className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-white focus:border-indigo-500 transition-all appearance-none">
                  <option>Technology</option><option>Science</option><option>Art</option><option>Gaming</option>
                </select>
              </div>
            </div>
            <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-4 rounded-xl shadow-lg flex items-center justify-center gap-2 group">
              Broadcast to Network <Send className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

// Soft Sphere & Hero
const SoftSphere = () => (
    <div className="relative w-full h-[500px] flex items-center justify-center">
      <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/10 via-sky-500/10 to-transparent blur-3xl rounded-full" />
      <div className="relative w-80 h-80 animate-slow-spin">
        <div className="absolute inset-0 border border-slate-700/50 rounded-full" />
        <div className="absolute inset-4 border border-indigo-500/20 rounded-full rotate-45" />
        <div className="absolute inset-10 border border-sky-500/20 rounded-full -rotate-45" />
        <div className="absolute inset-0 m-auto w-32 h-32 bg-slate-900 rounded-full border border-slate-700 flex items-center justify-center shadow-2xl"><Globe className="w-12 h-12 text-indigo-400" /></div>
      </div>
    </div>
);

const Hero = ({ onOpenModal, onLogin }) => (
    <section className="relative pt-32 pb-20 px-6 flex flex-col items-center justify-center overflow-hidden">
      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-16 items-center relative z-10">
        <div className="text-left space-y-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800/50 border border-slate-700/50 backdrop-blur-md">
            <span className="text-xs font-semibold text-indigo-300 tracking-wide">Connectum Hybrid Network</span>
          </div>
          <div className="space-y-6">
            <h1 className="text-6xl md:text-8xl font-bold tracking-tight text-white leading-[0.95]">Global Mind. <br/><span className="text-slate-500">Zero Barriers.</span></h1>
            <p className="text-xl text-slate-400 max-w-lg leading-relaxed font-light">The first community where language is a bridge, not a barrier. Ask locally, learn globally.</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4">
            <button onClick={onOpenModal} className="px-8 py-4 bg-white text-slate-900 rounded-xl font-bold text-lg hover:bg-slate-100 transition-all shadow-xl flex items-center gap-2">Join the HiveMind <ArrowRight className="w-5 h-5" /></button>
            <button className="px-8 py-4 bg-slate-800 text-white rounded-xl font-bold text-lg hover:bg-slate-700 transition-all">View Protocol</button>
          </div>
          <div className="flex items-center gap-8 pt-4">
             <div className="flex -space-x-3">
               {[1,2,3,4].map(i => <div key={i} className="w-8 h-8 rounded-full border-2 border-slate-900 bg-slate-700 flex items-center justify-center"><UserIcon className="w-4 h-4 text-white"/></div>)}
               <div className="w-8 h-8 rounded-full border-2 border-slate-900 bg-slate-800 flex items-center justify-center text-[10px] text-slate-400 font-bold">+2k</div>
             </div>
             <p className="text-sm text-slate-500">Joined today</p>
          </div>
        </div>
        <div className="relative"><SoftSphere /></div>
      </div>
    </section>
);

const XPToast = ({ message, isVisible }) => {
  if (!isVisible) return null;
  return (
    <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[100] animate-bounce-in">
      <div className="bg-slate-900/90 backdrop-blur-xl border border-amber-500/50 px-6 py-3 rounded-full shadow-[0_0_30px_rgba(245,158,11,0.4)] flex items-center gap-3">
        <Trophy className="w-5 h-5 text-amber-400" />
        <h4 className="text-amber-400 font-bold text-lg leading-none">{message}</h4>
        <Sparkles className="w-4 h-4 text-yellow-200 animate-pulse" />
      </div>
    </div>
  );
};

// --- MAIN APP ---
const App = () => {
  const [session, setSession] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userXP, setUserXP] = useState(120);
  const [toastMessage, setToastMessage] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Derived RPG Stats
  const userLevel = Math.floor(userXP / 1000) + 1;
  const levelProgress = ((userXP % 1000) / 1000) * 100;

  // --- 2. AUTHENTICATION LOGIC ---
  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    // Listen for changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  // --- 3. DATA FETCHING ---
  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('questions')
        .select('*, replies(*)')
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

  // --- AUTH ACTIONS ---
  const handleLogin = async () => {
    try {
      await supabase.auth.signInWithOAuth({
        provider: 'github',
        options: {
          redirectTo: window.location.origin
        }
      });
    } catch (error) {
      console.error("Login failed:", error);
      alert("Login failed. Check console.");
    }
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      setSession(null);
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  // Gamification Logic
  const handleAddXP = (amount, reason) => {
    setUserXP(prev => prev + amount);
    setToastMessage(`+${amount} XP - ${reason}`);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleAddQuestion = async (formData) => {
    try {
      if (!session) {
        alert("You must be logged in to ask a question.");
        return;
      }

      const newQuestionPayload = {
        text: formData.title,
        language: formData.language,
        author_name: session.user.user_metadata.full_name || session.user.email,
        xp_reward: 50
      };

      const { data, error } = await supabase
        .from('questions')
        .insert([newQuestionPayload])
        .select();

      if (error) throw error;

      if (data && data.length > 0) {
        fetchQuestions();
        handleAddXP(50, "Posted Question");
        setIsModalOpen(false);
      }

    } catch (error) {
      console.error('Error adding question:', error);
      alert('Failed to post question. See console.');
    }
  };

  const handleSubmitAnswer = async (questionId, text) => {
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
        fetchQuestions();
        handleAddXP(100, "Solution Provided");
      }
    } catch (error) {
      console.error('Error adding reply:', error);
      alert('Failed to post reply.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-200 font-sans selection:bg-indigo-500/30 selection:text-white">
      <style>{`
        @keyframes marquee { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
        .animate-marquee { animation: marquee 40s linear infinite; }
        @keyframes slow-spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .animate-slow-spin { animation: slow-spin 30s linear infinite; }
        @keyframes bounce-slow { 0% { transform: translateY(-10px); } 50% { transform: translateY(10px); } }
        .animate-bounce-slow { animation: bounce-slow 4s ease-in-out infinite; }
         @keyframes bounce-delayed { 0% { transform: translateY(0); } 50% { transform: translateY(-15px); } }
        .animate-bounce-delayed { animation: bounce-delayed 5s ease-in-out infinite 1s; }
        @keyframes slide-in-top { 0% { transform: translateY(-20px); opacity: 0; } 100% { transform: translateY(0); opacity: 1; } }
        .animate-slide-in { animation: slide-in-top 0.5s cubic-bezier(0.250, 0.460, 0.450, 0.940) both; }
        @keyframes fade-in { 0% { opacity: 0; } 100% { opacity: 1; } }
        .animate-fade-in { animation: fade-in 0.5s ease-out forwards; }
        @keyframes scale-in { 0% { transform: scale(0.95); opacity: 0; } 100% { transform: scale(1); opacity: 1; } }
        .animate-scale-in { animation: scale-in 0.2s ease-out forwards; }
        @keyframes bounce-in { 0% { transform: translate(-50%, 100%); opacity: 0; } 60% { transform: translate(-50%, -10%); opacity: 1; } 100% { transform: translate(-50%, 0); } }
        .animate-bounce-in { animation: bounce-in 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards; }
      `}</style>

      {/* Navbar with RPG HUD */}
      <Navbar 
        onOpenModal={() => setIsModalOpen(true)} 
        xp={userXP} 
        level={userLevel} 
        xpProgress={levelProgress} 
        session={session}
        onLogin={handleLogin}
        onLogout={handleLogout}
      />
      
      <main>
        <Hero onOpenModal={() => setIsModalOpen(true)} onLogin={handleLogin} />
        <LanguageTicker />
        
        {/* Question Feed */}
        <section className="py-24 px-6 relative z-10">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-white mb-3">Live Questions</h2>
              <p className="text-slate-400">Real-time knowledge exchange happening right now.</p>
            </div>

            {loading ? (
              <div className="flex flex-col items-center justify-center py-20">
                <Loader2 className="w-12 h-12 text-indigo-500 animate-spin mb-4" />
                <p className="text-slate-500 font-mono text-sm">SYNCING WITH HIVE MIND...</p>
              </div>
            ) : (
              <div className="space-y-4">
                {questions.length === 0 ? (
                  <div className="text-center py-10 text-slate-500 bg-slate-800/20 rounded-xl border border-slate-700 p-8">
                     <p className="mb-2">No questions detected in the stream.</p>
                  </div>
                ) : (
                  questions.map(q => (
                    <QuestionCard 
                      key={q.id} 
                      data={q} 
                      onSubmitAnswer={handleSubmitAnswer}
                      session={session}
                      onLogin={handleLogin}
                    />
                  ))
                )}
              </div>
            )}
            
            <div className="mt-8 text-center">
              <button className="text-sm font-medium text-slate-500 hover:text-indigo-400 transition-colors flex items-center justify-center gap-2 mx-auto">
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
             <Cpu className="w-5 h-5 text-indigo-500" />
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
        className="fixed bottom-8 right-8 z-40 bg-indigo-600 hover:bg-indigo-500 text-white p-4 rounded-full shadow-2xl hover:scale-110 transition-transform shadow-indigo-500/40"
      >
        <Plus className="w-6 h-6" />
      </button>

      {/* Level Up / XP Toast */}
      <XPToast 
        message={toastMessage} 
        isVisible={!!toastMessage} 
      />

      {/* Modal Overlay */}
      <AskQuestionModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSubmit={handleAddQuestion} 
        session={session}
        onLogin={handleLogin}
      />
    </div>
  );
};

export default App;
