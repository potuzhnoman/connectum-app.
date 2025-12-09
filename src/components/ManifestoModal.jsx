import React from 'react';
import { X, Info } from 'lucide-react';

const ManifestoModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-950/80 backdrop-blur-md transition-opacity" 
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div className="relative w-full max-w-lg bg-slate-900/70 backdrop-blur-md border border-cyan-500/30 rounded-3xl shadow-[0_0_50px_rgba(0,0,0,0.5)] shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] p-8 animate-scale-in overflow-hidden">
        {/* Glow effect */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 via-purple-500 to-cyan-500" />
        
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-500 hover:text-white transition-colors p-2 hover:bg-white/5 rounded-full"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="mb-8 text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-full flex items-center justify-center mb-4 border border-cyan-500/30 mx-auto">
            <Info className="w-8 h-8 text-cyan-400" />
          </div>
          <h2 className="text-3xl font-bold text-white mb-2">Connectum Manifesto</h2>
        </div>

        <div className="space-y-6 text-slate-300">
          <p className="text-lg leading-relaxed text-center">
            A global knowledge network bridging languages and cultures. Ask questions, share answers, earn XP.
          </p>
          
          <div className="space-y-4 pt-4 border-t border-white/5">
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 rounded-full bg-cyan-400 mt-2 flex-shrink-0" />
              <div>
                <h3 className="text-white font-bold mb-1">Global Knowledge Exchange</h3>
                <p className="text-sm text-slate-400">Connect with experts worldwide, regardless of language barriers.</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 rounded-full bg-cyan-400 mt-2 flex-shrink-0" />
              <div>
                <h3 className="text-white font-bold mb-1">AI-Powered Translation</h3>
                <p className="text-sm text-slate-400">Questions are instantly translated to reach the right audience.</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 rounded-full bg-cyan-400 mt-2 flex-shrink-0" />
              <div>
                <h3 className="text-white font-bold mb-1">Gamified Learning</h3>
                <p className="text-sm text-slate-400">Earn XP, level up, and climb the leaderboard by contributing to the community.</p>
              </div>
            </div>
          </div>
        </div>

        <button 
          onClick={onClose}
          className="w-full mt-8 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold py-3 rounded-xl shadow-lg shadow-cyan-500/25 transition-all hover:scale-[1.01] focus:outline-none focus:ring-2 focus:ring-cyan-400/40"
        >
          Got it
        </button>
      </div>
    </div>
  );
};

export default ManifestoModal;

