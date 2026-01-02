import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { supabase } from './services/supabase';

// Components
import MainLayout from './layouts/MainLayout';
import Home from './pages/Home';
import QuestionPage from './pages/QuestionPage';
import AskQuestionModal from './components/AskQuestionModal';
import LeaderboardModal from './components/LeaderboardModal';
import UserProfileModal from './components/UserProfileModal';
import ManifestoModal from './components/ManifestoModal';
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
  const { session, loginWithGithub, loginWithGoogle } = useAuth();

  // UI State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLeaderboardOpen, setIsLeaderboardOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isManifestoOpen, setIsManifestoOpen] = useState(false);
  const [activeSection, setActiveSection] = useState(null);
  const [viewProfileId, setViewProfileId] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);
  const [statusToast, setStatusToast] = useState(null);

  // Toast Logic
  const showStatusToast = (message, type = 'success') => {
    setStatusToast({ message, type });
    setTimeout(() => setStatusToast(null), 3000);
  };

  // Prepare Context for Outlets (Pages)
  const outletContext = {
    openAskModal: () => setIsModalOpen(true),
    openLeaderboard: () => setIsLeaderboardOpen(true),
    openProfile: (userId) => {
      if (userId) setViewProfileId(userId); else setViewProfileId(session?.user?.id);
      setIsProfileOpen(true);
    },
    openManifesto: () => setIsManifestoOpen(true),
    showStatusToast,
    session,
    loginWithGithub,
    loginWithGoogle,
    supabase // Legacy support for components using direct prop
  };

  // XP Toast Handler (Stub for now, or assume managed by subscriptions/events)
  // For this refactor, we rely on Supabase Realtime in Home to fetch new data, 
  // but showing XP toast was manual. 
  // We can add a global event listener or Context method for XP Toast if needed.

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route element={
            <MainLayout
              activeSection={activeSection}
              setActiveSection={setActiveSection}
              setIsModalOpen={setIsModalOpen}
              setIsLeaderboardOpen={setIsLeaderboardOpen}
              setIsProfileOpen={setIsProfileOpen}
              setIsManifestoOpen={setIsManifestoOpen}
              onSearch={(q) => console.log('Global search not connected locally to layout yet', q)} // Todo: Global Search Context
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
        onSubmit={async (data) => {
          // We need to handle submission here or pass handler. 
          // Refactoring: Home handled it before. 
          // Ideally we move addQuestionService here or to Context.
          // For now, let's keep it simple: we pass session to modal, modal calls prop.
          // Oh wait, StartScreen called handleAddQuestion.
          // AskQuestionModal calls `onSubmit`.
          // We need `handleAddQuestion` logic here to pass to Modal.

          const { addQuestionService } = await import('./services/questions');
          try {
            await addQuestionService({
              text: data.title,
              language: data.language,
              category: data.category,
              author_name: session?.user?.user_metadata.full_name || session?.user?.email,
              author_id: session?.user?.id,
              xp_reward: 50
            });
            setIsModalOpen(false);
            showStatusToast("Question posted", 'success');
            setToastMessage("+50 XP - Posted Question");
            setTimeout(() => setToastMessage(null), 3000);
          } catch (e) {
            showStatusToast(e.message, 'error');
          }
        }}
        session={session}
        onLoginGithub={loginWithGithub}
        onLoginGoogle={loginWithGoogle}
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

      <XPToast
        message={toastMessage}
        isVisible={!!toastMessage}
      />
      <StatusToast toast={statusToast} />
    </>
  );
}

const App = () => {
  return (
    <AuthProvider>
      <AppInner />
    </AuthProvider>
  );
};

export default App;