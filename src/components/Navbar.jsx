import React, { useState, useEffect } from 'react';
import {
  Search, Bell, Menu, X, Rocket,
  Trophy, User, LogOut, ChevronDown,
  Github, Sparkles, LayoutGrid, Zap
} from 'lucide-react';
import { Link } from 'react-router-dom';

import { useSearch } from '../contexts';

const Navbar = ({
  onOpenModal,
  onOpenLeaderboard,
  onOpenProfile,
  onExploreClick,
  onManifestoClick,
  activeSection,
  setActiveSection,
  xp,
  level,
  xpProgress,
  session,
  onLoginGithub,
  onLoginGoogle,
  onLogout,
  showSearch
}) => {
  const { searchQuery, setSearchQuery } = useSearch();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Handle Scroll Effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
  };

  const navLinks = [
    { id: 'explore', label: 'Explore', icon: LayoutGrid, action: onExploreClick },
    { id: 'community', label: 'Community', icon: Trophy, action: onOpenLeaderboard },
    { id: 'manifesto', label: 'Manifesto', icon: Rocket, action: onManifestoClick },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${isScrolled ? 'py-3' : 'py-5'
        }`}
    >
      <div className={`max-w-7xl mx-auto px-4 sm:px-6`}>
        <div
          className={`relative rounded-2xl transition-all duration-300 ${isScrolled
            ? 'glass-panel px-6 py-3'
            : 'bg-transparent px-2 py-2'
            }`}
        >
          <div className="flex items-center justify-between">

            {/* Logo */}
            <div className="flex items-center gap-8">
              <Link
                to="/"
                className="group flex items-center gap-2.5 transition-opacity hover:opacity-80"
                onClick={() => {
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                  setSearchQuery('');
                }}
              >
                <div className="relative">
                  <div className="absolute inset-0 bg-cyan-500 blur-[6px] opacity-40 group-hover:opacity-75 transition-opacity" />
                  <div className="relative bg-slate-900 rounded-lg p-1.5 border border-white/10 group-hover:border-cyan-500/50 transition-colors">
                    <Zap className="w-5 h-5 text-cyan-400 fill-cyan-400/20" />
                  </div>
                </div>
                <span className="text-lg font-bold tracking-tight text-white group-hover:text-cyan-100 transition-colors">
                  Connectum<span className="text-cyan-400">.</span>
                </span>
              </Link>

              {/* Desktop Nav */}
              <div className="hidden md:flex items-center gap-1">
                {navLinks.map((link) => (
                  <button
                    key={link.id}
                    onClick={() => {
                      setActiveSection(link.id);
                      link.action();
                    }}
                    className={`
                      px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200
                      flex items-center gap-2
                      ${activeSection === link.id
                        ? 'bg-white/10 text-white shadow-lg shadow-white/5 backdrop-blur-sm'
                        : 'text-slate-400 hover:text-white hover:bg-white/5'
                      }
                    `}
                  >
                    <link.icon className={`w-4 h-4 ${activeSection === link.id ? 'text-cyan-400' : 'text-slate-500'}`} />
                    {link.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center gap-4">

              {/* Search Bar (Conditional) */}
              <div
                className={`hidden sm:flex items-center transition-all duration-300 ${showSearch || isScrolled ? 'opacity-100 translate-x-0 w-48 lg:w-64' : 'opacity-0 translate-x-4 w-0 overflow-hidden'
                  }`}
              >
                <form onSubmit={handleSearchSubmit} className="relative w-full group">
                  <input
                    type="text"
                    placeholder="Search questions..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-slate-900/50 border border-white/10 rounded-xl py-2 pl-10 pr-4 text-sm text-slate-200 focus:outline-none focus:border-cyan-500/50 focus:bg-slate-900/80 transition-all placeholder:text-slate-600"
                  />
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-cyan-400 transition-colors" />
                </form>
              </div>

              {session ? (
                <>
                  {/* XP Bar */}
                  <div className="hidden md:flex flex-col items-end mr-2 group cursor-default">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-cyan-300 uppercase tracking-wider mb-0.5">
                      <Sparkles className="w-3 h-3 text-yellow-400" />
                      <span>Lvl {level}</span>
                    </div>
                    <div className="w-24 h-1.5 bg-slate-800 rounded-full overflow-hidden relative">
                      <div className="absolute inset-0 bg-gradient-to-r from-cyan-600 to-blue-600 w-full opacity-20" />
                      <div
                        className="h-full bg-gradient-to-r from-cyan-400 to-blue-500 shadow-[0_0_10px_rgba(34,211,238,0.5)] transition-all duration-500 ease-out"
                        style={{ width: `${xpProgress}%` }}
                      />
                    </div>
                  </div>

                  {/* Create Button */}
                  <button
                    onClick={onOpenModal}
                    className="hidden sm:flex items-center gap-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white px-5 py-2.5 rounded-xl font-bold shadow-lg shadow-cyan-900/20 hover:shadow-cyan-500/30 hover:-translate-y-0.5 transition-all active:scale-95 active:translate-y-0"
                  >
                    <span className="text-xl leading-none">+</span>
                    <span>Ask</span>
                  </button>

                  {/* Profile Dropdown Trigger */}
                  <button
                    onClick={onOpenProfile}
                    className="relative group p-0.5 rounded-full border border-white/10 hover:border-cyan-500/50 transition-colors"
                  >
                    <img
                      src={session.user.user_metadata.avatar_url}
                      alt="Profile"
                      className="w-9 h-9 rounded-full object-cover bg-slate-800"
                    />
                    <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border-2 border-slate-950 rounded-full" />
                  </button>
                </>
              ) : (
                <button
                  onClick={onLoginGithub}
                  className="flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/20 text-white px-5 py-2.5 rounded-xl font-medium transition-all hover:scale-105 active:scale-95"
                >
                  <Github className="w-4 h-4" />
                  <span>Login</span>
                </button>
              )}

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 text-slate-400 hover:text-white"
              >
                {mobileMenuOpen ? <X /> : <Menu />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="absolute top-full left-0 w-full px-4 pb-4 md:hidden animate-slide-in">
          <div className="glass-panel p-4 rounded-2xl flex flex-col gap-2">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => {
                  setActiveSection(link.id);
                  link.action();
                  setMobileMenuOpen(false);
                }}
                className={`
                    w-full px-4 py-3 rounded-xl text-left font-medium transition-colors flex items-center gap-3
                    ${activeSection === link.id
                    ? 'bg-cyan-500/10 text-cyan-200 border border-cyan-500/20'
                    : 'text-slate-400 hover:bg-white/5'
                  }
                  `}
              >
                <link.icon className="w-5 h-5" />
                {link.label}
              </button>
            ))}
            <div className="h-px bg-white/5 my-2" />
            {session ? (
              <button
                onClick={() => { onOpenModal(); setMobileMenuOpen(false); }}
                className="w-full py-3 bg-cyan-600 text-white rounded-xl font-bold flex items-center justify-center gap-2"
              >
                <span>+ Ask Question</span>
              </button>
            ) : (
              <button
                onClick={() => { onLoginGithub(); setMobileMenuOpen(false); }}
                className="w-full py-3 bg-white/10 text-white rounded-xl font-bold flex items-center justify-center gap-2"
              >
                <Github className="w-5 h-5" /> Login
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;