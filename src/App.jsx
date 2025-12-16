import React, { useState, useEffect, useRef } from 'react';
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
import ManifestoModal from './components/ManifestoModal';
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

const StatusToast = ({ toast }) => {
  if (!toast) return null;

  const isError = toast.type === 'error';
  const borderClass = isError ? 'border-rose-400/30' : 'border-emerald-400/30';
  const textClass = isError ? 'text-rose-100' : 'text-emerald-100';

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[90] animate-bounce-in">
      <div className={`px-5 py-3 rounded-xl bg-slate-900/90 backdrop-blur-lg border ${borderClass} shadow-lg shadow-black/40 min-w-[240px] text-center`}>
        <p className={`text-sm font-semibold ${textClass}`}>{toast.message}</p>
      </div>
    </div>
  );
};

// --- Main App Component ---
const App = () => {
  // Database & Auth State
  const [supabase] = useState(() => createClient(supabaseUrl, supabaseAnonKey));
  const [session, setSession] = useState(null);
  const [configError, setConfigError] = useState(null);

  // UI State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLeaderboardOpen, setIsLeaderboardOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isManifestoOpen, setIsManifestoOpen] = useState(false);
  const [activeSection, setActiveSection] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);
  const [statusToast, setStatusToast] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showNavbarSearch, setShowNavbarSearch] = useState(false);
  
  // Data State
  const [userXP, setUserXP] = useState(0); 
  const [questions, setQuestions] = useState([]);
  const [filteredQuestions, setFilteredQuestions] = useState(null);
  
  // FIXED: Changed from selectedUserProfile object to ID string
  const [viewProfileId, setViewProfileId] = useState(null);

  // Track timeout ID to prevent premature clearing
  const toastTimeoutRef = useRef(null);

  // Derived Stats
  const userLevel = Math.floor(userXP / 1000) + 1;
  const levelProgress = ((userXP % 1000) / 1000) * 100;

  const showStatusToast = (message, type = 'success') => {
    // Clear any existing timeout to prevent premature clearing
    if (toastTimeoutRef.current) {
      clearTimeout(toastTimeoutRef.current);
    }
    
    setStatusToast({ message, type });
    toastTimeoutRef.current = setTimeout(() => {
      setStatusToast(null);
      toastTimeoutRef.current = null;
    }, 3000);
  };

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (toastTimeoutRef.current) {
        clearTimeout(toastTimeoutRef.current);
      }
    };
  }, []);

  // Update active section on scroll & show navbar search
  useEffect(() => {
    const handleScroll = () => {
      // Smart detection: show navbar search when hero search scrolls out of view
      const heroSearch = document.querySelector('.hero-search');
      if (heroSearch) {
        const rect = heroSearch.getBoundingClientRect();
        // Show navbar search when hero search goes above viewport
        setShowNavbarSearch(rect.bottom < 0);
      }
      
      // Existing logic for activeSection
      const questionsSection = document.getElementById('questions-section');
      if (questionsSection) {
        const rect = questionsSection.getBoundingClientRect();
        const isVisible = rect.top <= 150 && rect.bottom >= 150;
        if (isVisible && activeSection !== 'explore') {
          setActiveSection('explore');
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Check on mount
    return () => window.removeEventListener('scroll', handleScroll);
  }, [activeSection]);

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

    // FIXED: Realtime Subscription to handle UI updates smoothly
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

  // Preserve original overflow to avoid locking scroll when modals toggle quickly
  const bodyOverflowRef = useRef(null);
  useEffect(() => {
    if (typeof document === 'undefined') return;
    const anyModalOpen = isModalOpen || isLeaderboardOpen || isProfileOpen;

    if (anyModalOpen) {
      // Capture original overflow only when moving from unlocked to locked
      if (bodyOverflowRef.current === null) {
        bodyOverflowRef.current = document.body.style.overflow;
      }
      document.body.style.overflow = 'hidden';
    } else {
      // Restore once all modals are closed
      if (bodyOverflowRef.current !== null) {
        document.body.style.overflow = bodyOverflowRef.current || '';
        bodyOverflowRef.current = null;
      }
    }

    return () => {
      // On unmount, ensure body overflow is restored
      if (bodyOverflowRef.current !== null) {
        document.body.style.overflow = bodyOverflowRef.current || '';
        bodyOverflowRef.current = null;
      }
    };
  }, [isModalOpen, isLeaderboardOpen, isProfileOpen]);

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
          language: q.language,
          avatarUrl: q.author_avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${q.author_name}`,
          timeAgo: formatTimeAgo(q.created_at),
          questionOriginal: q.text,
          questionTranslated: null, // Translation loaded on-demand
          xp: q.xp_reward || 0,
          comments: q.replies ? q.replies.length : 0,
          replies: q.replies ? q.replies
            .map(r => ({
              id: r.id,
              authorId: r.author_id, // For XP bonus
              author: r.author_name,
              text: r.text,
              time: formatTimeAgo(r.created_at),
              avatar: r.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${r.author_name}`,
              isBestAnswer: r.is_best_answer || false
            }))
            .sort((a, b) => b.isBestAnswer - a.isBestAnswer) // Best answer first
            : [],
          isNew: false 
        };
      });
      setQuestions(formattedQuestions);
    } catch (error) {
      console.error('Error fetching questions:', error);
      showStatusToast(error.message || 'Failed to fetch questions', 'error');
    } finally {
      if (showLoading) setLoading(false);
    }
  };

  // --- Handlers ---
  const handleLoginGithub = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'github',
      options: { redirectTo: window.location.origin }
    });
  };

  const handleLoginGoogle = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.origin }
    });
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setSession(null);
  };

  const handleAddXP = async (amount, reason) => {
    const newXP = userXP + amount;
    setUserXP(newXP);
    setToastMessage(`+${amount} XP - ${reason}`);
    setTimeout(() => setToastMessage(null), 3000);

    if (session) {
      await supabase.from('profiles').update({ xp: newXP }).eq('id', session.user.id);
    }
  };

  const handleAddQuestion = async (formData) => {
    if (!session) return alert("Please login first.");

    const newQuestionPayload = {
      text: formData.title,
      language: formData.language,
      category: formData.category, 
      author_name: session.user.user_metadata.full_name || session.user.email,
      author_id: session.user.id,
      // FIXED: Removed author_avatar to prevent DB error
      xp_reward: 50
    };

    try {
      const { data, error } = await supabase.from('questions').insert([newQuestionPayload]).select();
      if (error) throw error;

      if (data) {
        handleAddXP(50, "Posted Question");
        setIsModalOpen(false);
        showStatusToast("Question posted", 'success');
      }
    } catch (error) {
      showStatusToast(error.message || "Failed to post question", 'error');
    }
  };

  const handleSubmitAnswer = async (questionId, text) => {
    if (!session) return alert("Please login first.");

    const replyPayload = {
      question_id: questionId,
      text: text,
      author_name: session.user.user_metadata.full_name || session.user.email,
      author_id: session.user.id, // For XP bonus
      avatar: session.user.user_metadata.avatar_url
    };

    try {
      const { data, error } = await supabase.from('replies').insert([replyPayload]).select();
      if (error) throw error;

      if (data) {
        handleAddXP(100, "Solution Provided");
        showStatusToast("Answer posted", 'success');
      }
    } catch (error) {
      showStatusToast(error.message || "Failed to post answer", 'error');
    }
  };

  const handleMarkBestAnswer = async (questionId, replyId, replyAuthorId) => {
    if (!session) return;
    
    try {
      // 1. Reset all best answers for this question
      await supabase
        .from('replies')
        .update({ is_best_answer: false })
        .eq('question_id', questionId);
      
      // 2. Set new best answer
      await supabase
        .from('replies')
        .update({ is_best_answer: true })
        .eq('id', replyId);
      
      // 3. Add XP to answer author (if author_id exists)
      if (replyAuthorId) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('xp')
          .eq('id', replyAuthorId)
          .single();
        
        if (profile) {
          await supabase
            .from('profiles')
            .update({ xp: (profile.xp || 0) + 50 })
            .eq('id', replyAuthorId);
        }
      }
      
      showStatusToast('Best answer marked! +50 XP awarded', 'success');
      fetchQuestions(false);
    } catch (error) {
      console.error('Mark best answer error:', error);
      showStatusToast('Failed to mark best answer', 'error');
    }
  };

  const handleUserClick = (userId) => {
    // FIXED: Using ID instead of full object
    setViewProfileId(userId);
    setIsProfileOpen(true);
  };

  const handleOpenMyProfile = () => {
    if (session) {
      setViewProfileId(session.user.id);
      setIsProfileOpen(true);
    }
  };

  // Navigation handlers
  const handleExploreClick = () => {
    setActiveSection('explore');
    const questionsSection = document.getElementById('questions-section');
    if (questionsSection) {
      const offsetTop = questionsSection.offsetTop - 100;
      window.scrollTo({ top: offsetTop, behavior: 'smooth' });
    }
  };

  const handleCommunityClick = () => {
    setActiveSection('community');
    setIsLeaderboardOpen(true);
  };

  const handleManifestoClick = () => {
    setActiveSection('manifesto');
    setIsManifestoOpen(true);
  };

  const handleSearch = (query) => {
    if (!query.trim()) {
      setFilteredQuestions(null); // Show all questions
      return;
    }
    
    const filtered = questions.filter(q => 
      q.questionOriginal.toLowerCase().includes(query.toLowerCase()) ||
      q.name.toLowerCase().includes(query.toLowerCase()) ||
      q.category?.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredQuestions(filtered);
  };

  const handleResultClick = (result) => {
    // Scroll to the question card
    const questionElement = document.getElementById(`question-${result.id}`);
    if (questionElement) {
      questionElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      // Add highlight effect
      questionElement.classList.add('ring-2', 'ring-cyan-400', 'ring-offset-2', 'ring-offset-slate-950');
      setTimeout(() => {
        questionElement.classList.remove('ring-2', 'ring-cyan-400', 'ring-offset-2', 'ring-offset-slate-950');
      }, 2000);
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
      {/* Global Styles for Animations used by Modals */}
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
        onOpenProfile={handleOpenMyProfile}
        onExploreClick={handleExploreClick}
        onManifestoClick={handleManifestoClick}
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        xp={userXP} 
        level={userLevel} 
        xpProgress={levelProgress} 
        session={session}
        onLoginGithub={handleLoginGithub}
        onLoginGoogle={handleLoginGoogle}
        onLogout={handleLogout}
        supabase={supabase}
        onSearch={handleSearch}
        onResultClick={handleResultClick}
        showSearch={showNavbarSearch}
      />
      
      <main>
        <StartScreen 
          onOpenModal={() => setIsModalOpen(true)} 
          onLogin={handleLoginGithub}
          supabase={supabase}
          onSearch={handleSearch}
          onResultClick={handleResultClick}
        />
        
        <section id="questions-section" className="py-24 px-6 relative z-10">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-5xl h-full bg-cyan-900/10 blur-[100px] -z-10 rounded-full mix-blend-screen" />
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-16 animate-fade-in">
              <h2 className="text-3xl font-bold text-white mb-3">Live Questions</h2>
              <p className="text-slate-400">Real-time knowledge exchange happening right now.</p>
            </div>

            {loading ? (
              <div className="space-y-4">
                {[1,2,3].map((i) => (
                  <div key={i} className="p-6 rounded-3xl bg-slate-900/40 border border-white/5 animate-pulse space-y-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-slate-800" />
                      <div className="space-y-2 flex-1">
                        <div className="h-4 w-32 bg-slate-800 rounded" />
                        <div className="h-3 w-24 bg-slate-800 rounded" />
                      </div>
                      <div className="h-4 w-16 bg-slate-800 rounded" />
                    </div>
                    <div className="h-6 w-full bg-slate-800 rounded" />
                    <div className="h-6 w-5/6 bg-slate-800 rounded" />
                    <div className="flex gap-3">
                      <div className="h-8 w-24 bg-slate-800 rounded" />
                      <div className="h-8 w-20 bg-slate-800 rounded" />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-6">
                {(() => {
                  const displayQuestions = filteredQuestions ?? questions;
                  
                  if (displayQuestions.length === 0 && filteredQuestions !== null) {
                    // Search returned no results
                    return (
                      <div className="text-center py-10 text-slate-500 bg-slate-900/30 rounded-3xl border border-white/5 p-8 backdrop-blur-sm space-y-4">
                        <p className="mb-2">No questions match your search.</p>
                        <button 
                          onClick={() => setFilteredQuestions(null)}
                          className="px-5 py-3 rounded-xl border border-cyan-500/40 text-cyan-100 text-sm font-bold hover:bg-cyan-500/10 transition-colors"
                        >
                          Clear Search
                        </button>
                      </div>
                    );
                  }
                  
                  if (displayQuestions.length === 0) {
                    // No questions at all
                    return (
                      <div className="text-center py-10 text-slate-500 bg-slate-900/30 rounded-3xl border border-white/5 p-8 backdrop-blur-sm space-y-4">
                        <p className="mb-2">No questions detected in the stream.</p>
                        <div className="flex flex-col sm:flex-row justify-center gap-3">
                          <button 
                            onClick={() => setIsModalOpen(true)} 
                            className="px-5 py-3 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 text-white text-sm font-bold shadow-lg shadow-cyan-500/25"
                          >
                            Ask Question
                          </button>
                          {!session && (
                            <button 
                              onClick={handleLoginGithub} 
                              className="px-5 py-3 rounded-xl border border-cyan-500/40 text-cyan-100 text-sm font-bold"
                            >
                              Login
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  }
                  
                  // Display filtered or all questions
                  return (
                    <>
                      {filteredQuestions !== null && (
                        <div className="mb-4 px-4 py-2 bg-cyan-500/10 border border-cyan-500/30 rounded-lg text-sm text-cyan-200 flex items-center justify-between">
                          <span>
                            Showing <strong>{displayQuestions.length}</strong> of <strong>{questions.length}</strong> questions
                          </span>
                          <button 
                            onClick={() => setFilteredQuestions(null)}
                            className="text-xs text-cyan-400 hover:text-cyan-300 underline"
                          >
                            Clear filter
                          </button>
                        </div>
                      )}
                      {displayQuestions.map(q => (
                        <QuestionCard 
                          key={q.id}
                          id={`question-${q.id}`}
                          data={q} 
                          onSubmitAnswer={handleSubmitAnswer}
                          onMarkBestAnswer={handleMarkBestAnswer}
                          session={session}
                          onLoginGithub={handleLoginGithub}
                          onLoginGoogle={handleLoginGoogle}
                          onUserClick={handleUserClick}
                          supabase={supabase}
                          onErrorToast={showStatusToast}
                        />
                      ))}
                    </>
                  );
                })()}
              </div>
            )}
            
            <div className="mt-12 text-center">
              <button 
                className="text-sm font-bold text-slate-500 hover:text-cyan-400 transition-colors flex items-center justify-center gap-2 mx-auto"
                onClick={() => {
                  if (typeof window !== 'undefined') {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }
                  fetchQuestions(false);
                }}
              >
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

      {/* --- Modals & Toasts --- */}
      
      <XPToast 
        message={toastMessage} 
        isVisible={!!toastMessage} 
      />
      <StatusToast toast={statusToast} />

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
        onClose={() => {
          setIsLeaderboardOpen(false);
          setActiveSection(null);
        }}
        supabase={supabase}
      />

      {/* FIXED: Passing userId and supabase client instead of user object */}
      <UserProfileModal 
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        userId={viewProfileId}
        supabase={supabase}
      />

      <ManifestoModal 
        isOpen={isManifestoOpen}
        onClose={() => {
          setIsManifestoOpen(false);
          setActiveSection(null);
        }}
      />
    </div>
  );
};

export default App;