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

// --- MAIN APP ---
const App = () => {
  // Database & Auth State
  // Initialize client only once
  const [supabase] = useState(() => createClient(supabaseUrl, supabaseAnonKey));
  const [session, setSession] = useState(null);
  const [configError, setConfigError] = useState(null);

  // UI State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLeaderboardOpen, setIsLeaderboardOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Data State
  const [userXP, setUserXP] = useState(0); 
  const [questions, setQuestions] = useState([]);
  const [viewProfileId, setViewProfileId] = useState(null);
  
  // Derived Stats
  const userLevel = Math.floor(userXP / 1000) + 1;
  const levelProgress = ((userXP % 1000) / 1000) * 100;

  // --- 1. Configuration Check ---
  useEffect(() => {
    if (!supabaseUrl || supabaseUrl.includes("INSERT_YOUR_SUPABASE_URL")) {
       setConfigError("Configuration Required");
    }
  }, []);

  // --- 2. Auth Listener ---
  useEffect(() => {
    if (!supabase) return;
    supabase.auth.getSession().then(({ data: { session } }) => setSession(session));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
    return () => subscription.unsubscribe();
  }, [supabase]);

  // --- 3. Profile Sync (XP) ---
  useEffect(() => {
    if (session && supabase) {
      const fetchProfile = async () => {
        const { data, error } = await supabase
          .from('profiles')
          .select('xp')
          .eq('id', session.user.id)
          .single();
        if (data) setUserXP(data.xp || 0);
      };
      fetchProfile();
    } else {
      setUserXP(0);
    }
  }, [session, supabase]);

  // --- 4. Data Fetching & Realtime Subscription ---
  useEffect(() => {
    if (!supabase) return;

    // Initial Fetch
    fetchQuestions();

    // Realtime Subscription
    const channel = supabase
      .channel('public:questions')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'questions' },
        () => fetchQuestions(false) // Pass false to skip loading spinner
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'replies' },
        () => fetchQuestions(false)
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase]);

  const fetchQuestions = async (showLoading = true) => {
    try {
      if (showLoading) setLoading(true);
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
          authorId: q.author_id,
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
    } catch (error) {
      console.error('Error fetching questions:', error);
    } finally {
      if (showLoading) setLoading(false);
    }
  };

  // --- Handlers ---
  const handleLoginGithub = async () => {
    if (supabase) await supabase.auth.signInWithOAuth({ provider: 'github', options: { redirectTo: window.location.origin } });
  };

  const handleLoginGoogle = async () => {
    if (supabase) await supabase.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: window.location.origin } });
  };

  const handleLogout = async () => {
    if (supabase) await supabase.auth.signOut();
    setSession(null);
  };

  const handleAddXP = async (amount, reason) => {
    const newXP = userXP + amount;
    setUserXP(newXP);
    setToastMessage(`+${amount} XP - ${reason}`);
    setTimeout(() => setToastMessage(null), 3000);

    if (session && supabase) {
      await supabase.from('profiles').update({ xp: newXP }).eq('id', session.user.id);
    }
  };

  const handleAddQuestion = async (formData) => {
    if (!supabase || !session) return alert("Please login first.");

    const newQuestionPayload = {
      text: formData.title,
      language: formData.language,
      category: formData.category, 
      author_name: session.user.user_metadata.full_name || session.user.email,
      author_id: session.user.id,
      author_avatar: session.user.user_metadata.avatar_url,
      xp_reward: 50
    };

    const { data, error } = await supabase.from('questions').insert([newQuestionPayload]).select();

    if (!error && data) {
      // No manual fetch needed, Realtime handles it
      handleAddXP(50, "Posted Question");
      setIsModalOpen(false);
    }
  };

  const handleSubmitAnswer = async (questionId, text) => {
    if (!supabase || !session) return alert("Please login first.");

    const replyPayload = {
      question_id: questionId,
      text: text,
      author_name: session.user.user_metadata.full_name || session.user.email,
      author_id: session.user.id,
      avatar: session.user.user_metadata.avatar_url
    };

    const { data, error } = await supabase.from('replies').insert([replyPayload]).select();

    if (!error && data) {
      handleAddXP(100, "Solution Provided");
    }
  };

  const handleUserClick = (userId) => {
    if (userId) {
      setViewProfileId(userId);
      setIsProfileOpen(true);
    }
  };

  // --- Render ---

  if (configError) {
    return (
        <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 text-center">
            <div className="bg-red-500/10 border border-red-500/20 p-8 rounded-2xl max-w-lg shadow-[0_0_40px_rgba(239,68,68,0.1)]">
                <div className="mx-auto w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center mb-4">
                    <AlertTriangle className="w-6 h-6 text-red-400" />
                </div>
                <h2 className="text-xl font-bold text-red-400 mb-4">Configuration Required</h2>
                <p className="text-slate-300 mb-6 text-sm leading-relaxed">
                    Supabase configuration is missing. Please check your environment variables.
                </p>
            </div>
        </div>
    );
  }

  if (!supabase) return <div className="min-h-screen bg-slate-950 flex items-center justify-center"><Loader2 className="w-8 h-8 text-cyan-500 animate-spin" /></div>;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-indigo-500/30 selection:text-white">
      {/* Global Styles for Animations */}
      <style>{`
        @keyframes scale-in { 0% { transform: scale(0.95); opacity: 0; } 100% { transform: scale(1); opacity: 1; } }
        .animate-scale-in { animation: scale-in 0.2s ease-out forwards; }
        @keyframes bounce-in { 0% { transform: translate(-50%, 100%); opacity: 0; } 60% { transform: translate(-50%, -10%); opacity: 1; } 80% { transform: translate(-50%, 5%); } 100% { transform: translate(-50%, 0); } }
        .animate-bounce-in { animation: bounce-in 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards; }
        @keyframes fade-in { 0% { opacity: 0; } 100% { opacity: 1; } }
        .animate-fade-in { animation: fade-in 0.5s ease-out forwards; }
        @keyframes slide-in-top { 0% { transform: translateY(-20px); opacity: 0; } 100% { transform: translateY(0); opacity: 1; } }
        .animate-slide-in { animation: slide-in-top 0.5s cubic-bezier(0.250, 0.460, 0.450, 0.940) both; }
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
        <StartScreen 
          onOpenModal={() => setIsModalOpen(true)} 
          onLogin={handleLoginGithub} 
        />
        
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
              <button className="text-sm font-bold text-slate-500 hover:text-cyan-400 transition-colors flex items-center justify-center gap-2 mx-auto">
                View Global Feed <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </section>
      </main>

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

      <button 
        onClick={() => setIsModalOpen(true)}
        className="fixed bottom-8 right-8 z-40 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white p-4 rounded-full shadow-2xl hover:scale-110 transition-transform shadow-cyan-500/40"
      >
        <Plus className="w-6 h-6" />
      </button>

      {/* --- Modals & Toasts --- */}
      
      <XPToast 
        message={toastMessage} 
        isVisible={!!toastMessage} 
      />

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

      <UserProfileModal 
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        userId={viewProfileId}
        supabase={supabase}
      />
    </div>
  );
};

export default App;