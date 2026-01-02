import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { Cpu } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const MainLayout = ({ children, activeSection, setActiveSection, setIsModalOpen, setIsLeaderboardOpen, setIsProfileOpen, setIsManifestoOpen, onSearch }) => {
    const { session, loginWithGithub, loginWithGoogle, logout } = useAuth();
    const [showSearch, setShowSearch] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            // Smart detection: show navbar search when hero search scrolls out of view
            // We look for an element with class 'hero-search' (rendered in StartScreen)
            const heroSearch = document.querySelector('.hero-search');
            if (heroSearch) {
                const rect = heroSearch.getBoundingClientRect();
                setShowSearch(rect.bottom < 0);
            } else {
                // Fallback if no hero search (e.g. inner pages), always show or hide based on scroll or page type
                // For now, let's show it if we scrolled past 300px
                setShowSearch(window.scrollY > 300);
            }
        };

        window.addEventListener('scroll', handleScroll);
        // Initial check
        handleScroll();
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

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
                xp={0}
                level={1}
                xpProgress={0}
                session={session}
                onLoginGithub={loginWithGithub}
                onLoginGoogle={loginWithGoogle}
                onLogout={logout}
                supabase={null}
                onSearch={onSearch} // Pass the global search handler
                showSearch={showSearch} // Dynamic visibility
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
