import React from 'react';
import { Trophy, Sparkles } from 'lucide-react';

const XPToast = ({ message, isVisible }) => {
  if (!isVisible) return null;

  return (
    <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[100] animate-bounce-in">
      <div className="bg-slate-900/90 backdrop-blur-xl border border-amber-500/30 px-6 py-3 rounded-full shadow-[0_0_40px_rgba(245,158,11,0.3)] flex items-center gap-3">
        <div className="bg-amber-500/20 p-1.5 rounded-full">
          <Trophy className="w-5 h-5 text-amber-400" />
        </div>
        <div>
          <h4 className="text-amber-400 font-bold text-lg leading-none">{message}</h4>
        </div>
        <div className="ml-2 flex gap-0.5">
           <Sparkles className="w-4 h-4 text-yellow-200 animate-pulse" />
        </div>
      </div>
    </div>
  );
};

export default XPToast;