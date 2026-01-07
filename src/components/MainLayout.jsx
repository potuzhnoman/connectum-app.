import React from 'react';
import Navbar from './Navbar';
import { Cpu } from 'lucide-react';
import { useAuth } from '../contexts';

const MainLayout = ({ children, activeSection, setActiveSection, setIsModalOpen, setIsLeaderboardOpen, setIsProfileOpen, setIsManifestoOpen, onSearch }) => {
    const { session, loginWithGithub, loginWithGoogle, logout, userXP, level, xpProgress } = useAuth();

    // XP and Level calculation should ideally be in a Context or Hook too, 
    // but for now we might pass it down or refactor later.
    // For this step, we will assume Navbar can handle some of this or we pass basics.

    // Note: We need to bridge the old Navbar props with the new Context.
    // The original App.jsx passed a lot of props. We will try to simplify.

    return (
        <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-indigo-500/30 selection:text-white">
            <Navbar
                onOpenModal={() => setIsModalOpen(true)}
                onOpenLeaderboard={() => setIsLeaderboardOpen(true)}
                onOpenProfile={() => setIsProfileOpen(true)}
                onExploreClick={() => setActiveSection('explore')}
                onManifestoClick={() => setIsManifestoOpen(true)}
                activeSection={activeSection}
                setActiveSection={setActiveSection}
                xp={userXP}
                level={level}
                xpProgress={xpProgress / 100}
                session={session}
                onLoginGithub={loginWithGithub}
                onLoginGoogle={loginWithGoogle}
                onLogout={logout}
                supabase={null} // Navbar uses supabase directly? Warning: Refactor needed.
                onSearch={onSearch}
                showSearch={true}
            />

            <main>
                {children}
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
        </div>
    );
};

export default MainLayout;
