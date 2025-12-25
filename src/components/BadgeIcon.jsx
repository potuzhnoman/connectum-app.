import React, { useState } from 'react';
import {
    Star, Lightbulb, Flame, Target, Crown, Rocket,
    Globe, TrendingUp, Award, Zap, Shield, Heart
} from 'lucide-react';

// Badge type configuration
const BADGE_CONFIG = {
    first_question: {
        icon: Star,
        label: 'First Steps',
        description: 'Posted your first question',
        color: 'from-yellow-500 to-amber-500',
        bgColor: 'bg-yellow-500/10',
        borderColor: 'border-yellow-500/30',
        textColor: 'text-yellow-400'
    },
    helpful_hero: {
        icon: Lightbulb,
        label: 'Helpful Hero',
        description: 'Received 5 best answers',
        color: 'from-blue-500 to-cyan-500',
        bgColor: 'bg-blue-500/10',
        borderColor: 'border-blue-500/30',
        textColor: 'text-blue-400'
    },
    answer_streak: {
        icon: Flame,
        label: 'Answer Streak',
        description: 'Answered questions 3 days in a row',
        color: 'from-orange-500 to-red-500',
        bgColor: 'bg-orange-500/10',
        borderColor: 'border-orange-500/30',
        textColor: 'text-orange-400'
    },
    sharp_shooter: {
        icon: Target,
        label: 'Sharp Shooter',
        description: '10 answers accepted',
        color: 'from-green-500 to-emerald-500',
        bgColor: 'bg-green-500/10',
        borderColor: 'border-green-500/30',
        textColor: 'text-green-400'
    },
    knowledge_king: {
        icon: Crown,
        label: 'Knowledge King',
        description: 'Reached 5000 XP',
        color: 'from-purple-500 to-pink-500',
        bgColor: 'bg-purple-500/10',
        borderColor: 'border-purple-500/30',
        textColor: 'text-purple-400'
    },
    early_adopter: {
        icon: Rocket,
        label: 'Early Adopter',
        description: 'Among first 100 users',
        color: 'from-indigo-500 to-blue-500',
        bgColor: 'bg-indigo-500/10',
        borderColor: 'border-indigo-500/30',
        textColor: 'text-indigo-400'
    },
    polyglot: {
        icon: Globe,
        label: 'Polyglot',
        description: 'Asked questions in 3+ languages',
        color: 'from-teal-500 to-cyan-500',
        bgColor: 'bg-teal-500/10',
        borderColor: 'border-teal-500/30',
        textColor: 'text-teal-400'
    },
    rising_star: {
        icon: TrendingUp,
        label: 'Rising Star',
        description: 'Gained 1000 XP in a week',
        color: 'from-rose-500 to-pink-500',
        bgColor: 'bg-rose-500/10',
        borderColor: 'border-rose-500/30',
        textColor: 'text-rose-400'
    },
    legendary: {
        icon: Award,
        label: 'Legendary',
        description: 'Reached level 10',
        color: 'from-amber-500 to-yellow-500',
        bgColor: 'bg-amber-500/10',
        borderColor: 'border-amber-500/30',
        textColor: 'text-amber-400'
    },
    speedster: {
        icon: Zap,
        label: 'Speedster',
        description: 'First answer within 5 minutes',
        color: 'from-yellow-500 to-orange-500',
        bgColor: 'bg-yellow-500/10',
        borderColor: 'border-yellow-500/30',
        textColor: 'text-yellow-400'
    },
    guardian: {
        icon: Shield,
        label: 'Guardian',
        description: 'Helped 50 people',
        color: 'from-slate-500 to-gray-500',
        bgColor: 'bg-slate-500/10',
        borderColor: 'border-slate-500/30',
        textColor: 'text-slate-400'
    },
    community_lover: {
        icon: Heart,
        label: 'Community Lover',
        description: 'Active for 30 days',
        color: 'from-pink-500 to-rose-500',
        bgColor: 'bg-pink-500/10',
        borderColor: 'border-pink-500/30',
        textColor: 'text-pink-400'
    }
};

const BadgeIcon = ({
    badgeType,
    size = 'md',
    locked = false,
    showTooltip = true,
    earned_at = null,
    onClick = null
}) => {
    const [showTooltipState, setShowTooltipState] = useState(false);
    const config = BADGE_CONFIG[badgeType] || BADGE_CONFIG.first_question;
    const Icon = config.icon;

    // Size variants
    const sizeClasses = {
        sm: 'w-8 h-8',
        md: 'w-12 h-12',
        lg: 'w-16 h-16',
        xl: 'w-20 h-20'
    };

    const iconSizes = {
        sm: 'w-4 h-4',
        md: 'w-6 h-6',
        lg: 'w-8 h-8',
        xl: 'w-10 h-10'
    };

    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    };

    return (
        <div
            className="relative inline-block"
            onMouseEnter={() => showTooltip && setShowTooltipState(true)}
            onMouseLeave={() => setShowTooltipState(false)}
            onClick={onClick}
        >
            {/* Badge Icon */}
            <div
                className={`
          ${sizeClasses[size]} 
          ${locked ? 'bg-slate-800/50 border-slate-700/50' : `${config.bgColor} ${config.borderColor}`}
          border-2 rounded-xl flex items-center justify-center
          transition-all duration-300
          ${!locked && 'hover:scale-110 hover:shadow-lg'}
          ${locked && 'opacity-50 grayscale'}
          ${onClick && 'cursor-pointer'}
        `}
            >
                <Icon
                    className={`
            ${iconSizes[size]} 
            ${locked ? 'text-slate-600' : config.textColor}
          `}
                />

                {/* Locked Overlay */}
                {locked && (
                    <div className="absolute inset-0 flex items-center justify-center bg-slate-900/60 rounded-xl">
                        <div className="text-slate-500 text-xs font-bold">🔒</div>
                    </div>
                )}
            </div>

            {/* Tooltip */}
            {showTooltip && showTooltipState && (
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-50 animate-fade-in">
                    <div className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 shadow-xl min-w-[180px]">
                        <div className="flex items-center gap-2 mb-1">
                            <Icon className={`w-4 h-4 ${locked ? 'text-slate-500' : config.textColor}`} />
                            <h4 className="font-bold text-sm text-white">{config.label}</h4>
                        </div>
                        <p className="text-xs text-slate-400">{config.description}</p>
                        {earned_at && !locked && (
                            <p className="text-xs text-slate-500 mt-1">Earned: {formatDate(earned_at)}</p>
                        )}
                        {locked && (
                            <p className="text-xs text-slate-500 mt-1 italic">Not yet earned</p>
                        )}
                    </div>
                    {/* Tooltip Arrow */}
                    <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-px">
                        <div className="border-4 border-transparent border-t-slate-700"></div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BadgeIcon;
export { BADGE_CONFIG };
