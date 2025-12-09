import React, { useState, useEffect } from 'react';
import { Cpu, Trophy, LogOut, Plus, Mail, Github, Menu, X } from 'lucide-react';

const Navbar = ({ 
  onOpenModal, 
  onOpenLeaderboard, 
  onOpenProfile, // Added prop
  onExploreClick,
  onCommunityClick,
  onManifestoClick,
  activeSection,
  setActiveSection,
  xp, 
  level, 
  xpProgress, 
  session, 
  onLoginGithub, 
  onLoginGoogle, 
  onLogout 
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b ${
      isScrolled 
        ? 'bg-slate-950/80 backdrop-blur-xl border-cyan-500/20 py-3 shadow-[0_0_20px_rgba(6,182,212,0.1)]' 
        : 'bg-transparent border-transparent py-5'
    }`}>
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        <div className="flex items-center gap-2 group cursor-pointer" onClick={() => window.scrollTo(0,0)}>
          <div className="relative flex items-center justify-center w-10 h-10 bg-cyan-500/10 rounded-xl border border-cyan-500/30 group-hover:border-cyan-400 transition-colors">
            <Cpu className="w-6 h-6 text-cyan-400 group-hover:animate-pulse" />
          </div>
          <span className="text-xl font-bold tracking-tight text-white">
            Connectum<span className="text-cyan-400">.</span>
          </span>
        </div>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          <button
            onClick={() => {
              onExploreClick();
            }}
            className={`text-sm font-medium transition-colors pb-1 ${
              activeSection === 'explore'
                ? 'text-cyan-300 border-b-2 border-cyan-400'
                : 'text-slate-400 hover:text-cyan-300'
            }`}
          >
            Explore
          </button>
          <button
            onClick={() => {
              onCommunityClick();
            }}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all text-sm font-medium ${
              activeSection === 'community'
                ? 'bg-amber-500/20 border border-amber-500/30 text-amber-300'
                : 'bg-amber-500/10 border border-amber-500/20 text-amber-400 hover:bg-amber-500/20'
            }`}
          >
            <Trophy className="w-4 h-4" />
            Community
          </button>
          <button
            onClick={() => {
              onManifestoClick();
            }}
            className={`text-sm font-medium transition-colors pb-1 ${
              activeSection === 'manifesto'
                ? 'text-cyan-300 border-b-2 border-cyan-400'
                : 'text-slate-400 hover:text-cyan-300'
            }`}
          >
            Manifesto
          </button>

          {/* Leaderboard Trigger */}
          <button 
            onClick={onOpenLeaderboard}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400 hover:bg-amber-500/20 transition-all"
            title="Global Leaderboard"
          >
            <Trophy className="w-4 h-4" />
            <span className="text-xs font-bold uppercase tracking-wide">Leaders</span>
          </button>
          
          {/* User Section */}
          {session ? (
            <div className="flex items-center gap-4 pl-4 border-l border-slate-800">
              {/* Stats */}
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
              
              {/* Profile */}
              <div className="flex items-center gap-3">
                <div 
                  className="relative group cursor-pointer"
                  onClick={onOpenProfile} // Added click handler
                >
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
        <button className="md:hidden text-slate-300" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          {mobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="absolute top-full left-0 w-full bg-slate-950/95 backdrop-blur-xl border-b border-slate-800 p-6 md:hidden flex flex-col gap-4 shadow-2xl animate-fade-in">
          {session ? (
            <>
              <div 
                className="flex items-center gap-4 pb-4 border-b border-slate-800 cursor-pointer"
                onClick={() => { onOpenProfile(); setMobileMenuOpen(false); }}
              >
                 <div className="w-12 h-12 rounded-full bg-indigo-600 overflow-hidden">
                     <img src={session.user.user_metadata.avatar_url} alt="User" className="w-full h-full object-cover" />
                 </div>
                 <div>
                   <div className="text-white font-bold">{session.user.user_metadata.full_name}</div>
                   <div className="text-cyan-400 text-xs font-bold">Lvl {level} • {xp} XP</div>
                 </div>
              </div>
              
              {/* Navigation Tabs */}
              <div className="flex flex-col gap-2 pb-4 border-b border-slate-800">
                <button
                  onClick={() => {
                    onExploreClick();
                    setMobileMenuOpen(false);
                  }}
                  className={`text-left py-2 px-3 rounded-lg transition-colors ${
                    activeSection === 'explore'
                      ? 'text-cyan-300 bg-cyan-500/10 border border-cyan-500/30'
                      : 'text-slate-400 hover:text-cyan-300 hover:bg-slate-800/50'
                  }`}
                >
                  Explore
                </button>
                <button
                  onClick={() => {
                    onCommunityClick();
                    setMobileMenuOpen(false);
                  }}
                  className={`text-left py-2 px-3 rounded-lg transition-colors ${
                    activeSection === 'community'
                      ? 'text-cyan-300 bg-cyan-500/10 border border-cyan-500/30'
                      : 'text-slate-400 hover:text-cyan-300 hover:bg-slate-800/50'
                  }`}
                >
                  Community
                </button>
                <button
                  onClick={() => {
                    onManifestoClick();
                    setMobileMenuOpen(false);
                  }}
                  className={`text-left py-2 px-3 rounded-lg transition-colors ${
                    activeSection === 'manifesto'
                      ? 'text-cyan-300 bg-cyan-500/10 border border-cyan-500/30'
                      : 'text-slate-400 hover:text-cyan-300 hover:bg-slate-800/50'
                  }`}
                >
                  Manifesto
                </button>
              </div>

              <button onClick={() => { onOpenModal(); setMobileMenuOpen(false); }} className="w-full py-3 bg-cyan-600 text-white rounded-lg font-bold">
                Ask Question
              </button>
              <button onClick={() => { onOpenLeaderboard(); setMobileMenuOpen(false); }} className="w-full py-3 bg-amber-600/20 text-amber-400 border border-amber-600/50 rounded-lg font-bold flex items-center justify-center gap-2">
                <Trophy className="w-4 h-4" /> Leaderboard
              </button>
              <button onClick={() => { onLogout(); setMobileMenuOpen(false); }} className="w-full py-3 bg-slate-800 text-slate-300 rounded-lg font-bold">
                Log Out
              </button>
            </>
          ) : (
            <>
              {/* Navigation Tabs for non-logged users */}
              <div className="flex flex-col gap-2 pb-4 border-b border-slate-800">
                <button
                  onClick={() => {
                    onExploreClick();
                    setMobileMenuOpen(false);
                  }}
                  className={`text-left py-2 px-3 rounded-lg transition-colors ${
                    activeSection === 'explore'
                      ? 'text-cyan-300 bg-cyan-500/10 border border-cyan-500/30'
                      : 'text-slate-400 hover:text-cyan-300 hover:bg-slate-800/50'
                  }`}
                >
                  Explore
                </button>
                <button
                  onClick={() => {
                    onCommunityClick();
                    setMobileMenuOpen(false);
                  }}
                  className={`text-left py-2 px-3 rounded-lg transition-colors ${
                    activeSection === 'community'
                      ? 'text-cyan-300 bg-cyan-500/10 border border-cyan-500/30'
                      : 'text-slate-400 hover:text-cyan-300 hover:bg-slate-800/50'
                  }`}
                >
                  Community
                </button>
                <button
                  onClick={() => {
                    onManifestoClick();
                    setMobileMenuOpen(false);
                  }}
                  className={`text-left py-2 px-3 rounded-lg transition-colors ${
                    activeSection === 'manifesto'
                      ? 'text-cyan-300 bg-cyan-500/10 border border-cyan-500/30'
                      : 'text-slate-400 hover:text-cyan-300 hover:bg-slate-800/50'
                  }`}
                >
                  Manifesto
                </button>
              </div>

              <div className="flex flex-col gap-3">
                <button onClick={() => { onLoginGoogle(); setMobileMenuOpen(false); }} className="w-full py-3 bg-white text-slate-900 rounded-lg font-bold flex items-center justify-center gap-2">
                  <Mail className="w-5 h-5" /> Login with Google
                </button>
                <button onClick={() => { onLoginGithub(); setMobileMenuOpen(false); }} className="w-full py-3 bg-slate-800 text-white rounded-lg font-bold flex items-center justify-center gap-2">
                  <Github className="w-5 h-5" /> Login with GitHub
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;