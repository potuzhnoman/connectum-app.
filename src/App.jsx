import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { SearchProvider } from './contexts.jsx';
import { supabase } from './api';
import MainLayout from './components/MainLayout';
import Home from './pages/Home';
import QuestionPage from './pages/QuestionPage';
import AskQuestionModal from './components/AskQuestionModal';
import LeaderboardModal from './components/LeaderboardModal';
import UserProfileModal from './components/UserProfileModal';
import ManifestoModal from './components/ManifestoModal';
import AuthModal from './components/AuthModal';
import NotificationCenter from './components/NotificationCenter';
import XPToast from './components/XPToast';

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

const AppInner = () => {
  const { user, signIn, signInWithGoogle, signInWithGitHub } = useAuth();

  // UI State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLeaderboardOpen, setIsLeaderboardOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isManifestoOpen, setIsManifestoOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [activeSection, setActiveSection] = useState(null);
  const [viewProfileId, setViewProfileId] = useState(null);
  const [statusToast, setStatusToast] = useState(null);

  // Toast Logic
  const showStatusToast = (message, type = 'success') => {
    setStatusToast({ message, type });
    setTimeout(() => setStatusToast(null), 3000);
  };

  // Prepare Context for Outlets (Pages)
  const outletContext = {
    openAskModal: () => user ? setIsModalOpen(true) : setIsAuthOpen(true),
    openLeaderboard: () => setIsLeaderboardOpen(true),
    openProfile: (userId) => {
      if (userId) setViewProfileId(userId); else setViewProfileId(user?.id);
      setIsProfileOpen(true);
    },
    openManifesto: () => setIsManifestoOpen(true),
    showStatusToast,
    user,
    signIn,
    signInWithGoogle,
    signInWithGitHub,
    supabase
  };

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route element={
            <MainLayout
              activeSection={activeSection}
              setActiveSection={setActiveSection}
              setIsModalOpen={() => user ? setIsModalOpen(true) : setIsAuthOpen(true)}
              setIsLeaderboardOpen={setIsLeaderboardOpen}
              setIsProfileOpen={setIsProfileOpen}
              setIsManifestoOpen={setIsManifestoOpen}
              onSearch={() => { }}
            >
              <Outlet context={outletContext} />
            </MainLayout>
          }>
            <Route index element={<Home />} />
            <Route path="question/:id" element={<QuestionPage />} />
          </Route>
        </Routes>
      </BrowserRouter>

      {/* Modals are global */}
      <AskQuestionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onErrorToast={showStatusToast}
        onSubmit={async (data) => {
          const { addQuestionService } = await import('./api');
          try {
            await addQuestionService({
              text: data.title,
              description: data.details || '',
              language: data.language,
              category: data.category,
              author_name: user?.user_metadata?.full_name || user?.email || 'Anonymous',
              author_id: user?.id || 'anonymous_' + Date.now(),
              xp_reward: 50
            });

            setIsModalOpen(false);
            showStatusToast("Question posted", 'success');
          } catch (e) {
            showStatusToast(e.message || 'Failed to post question', 'error');
          }
        }}
        session={user}
        onLoginGithub={signInWithGitHub}
        onLoginGoogle={signInWithGoogle}
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

      <ManifestoModal
        isOpen={isManifestoOpen}
        onClose={() => setIsManifestoOpen(false)}
      />

      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
      />

      <XPToast
        message={statusToast?.message}
        isVisible={!!statusToast}
      />
      <StatusToast toast={statusToast} />
    </>
  );
}



const App = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 1000 * 60 * 5, // 5 minutes
        retry: 1,
      },
    },
  });

  return (
    <QueryClientProvider client={queryClient}>
      <SearchProvider>
        <AuthProvider>
          <AppInner />
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#363636',
                color: '#fff',
              },
              success: {
                duration: 3000,
                iconTheme: {
                  primary: '#4ade80',
                  secondary: '#fff',
                },
              },
              error: {
                duration: 5000,
                iconTheme: {
                  primary: '#ef4444',
                  secondary: '#fff',
                },
              },
            }}
          />
        </AuthProvider>
      </SearchProvider>
    </QueryClientProvider>
  );
};

export default App;