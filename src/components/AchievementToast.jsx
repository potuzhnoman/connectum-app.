import React from 'react';
import { Trophy, Sparkles } from 'lucide-react';
import BadgeIcon, { BADGE_CONFIG } from './BadgeIcon';

const AchievementToast = ({ achievement, isVisible }) => {
    if (!isVisible || !achievement) return null;

    const config = BADGE_CONFIG[achievement.badge_type];

    return (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[100] animate-slide-in">
            <div className="relative">
                {/* Glow Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/30 to-purple-500/30 blur-xl rounded-2xl" />

                {/* Main Toast */}
                <div className="relative bg-slate-900/95 backdrop-blur-xl border-2 border-cyan-500/40 rounded-2xl p-4 shadow-2xl min-w-[320px]">
                    {/* Sparkles Background */}
                    <div className="absolute top-2 right-2">
                        <Sparkles className="w-4 h-4 text-yellow-400 animate-pulse" />
                    </div>

                    {/* Header */}
                    <div className="flex items-center gap-2 mb-3">
                        <Trophy className="w-5 h-5 text-yellow-400" />
                        <span className="text-sm font-bold text-yellow-400 uppercase tracking-wider">
                            Achievement Unlocked!
                        </span>
                    </div>

                    {/* Content */}
                    <div className="flex items-center gap-4">
                        {/* Badge */}
                        <div className="shrink-0">
                            <BadgeIcon
                                badgeType={achievement.badge_type}
                                size="lg"
                                locked={false}
                                showTooltip={false}
                            />
                        </div>

                        {/* Details */}
                        <div className="flex-1">
                            <h3 className="text-lg font-bold text-white mb-1">
                                {config?.label}
                            </h3>
                            <p className="text-sm text-slate-400">
                                {config?.description}
                            </p>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="mt-3 pt-3 border-t border-slate-800 flex items-center justify-between">
                        <span className="text-xs text-slate-500">
                            Keep up the great work! 🎉
                        </span>
                    </div>
                </div>
            </div>

            {/* Animation Styles */}
            <style>{`
        @keyframes slide-in {
          from {
            transform: translate(-50%, -100%);
            opacity: 0;
          }
          to {
            transform: translate(-50%, 0);
            opacity: 1;
          }
        }
        .animate-slide-in {
          animation: slide-in 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>
        </div>
    );
};

export default AchievementToast;
