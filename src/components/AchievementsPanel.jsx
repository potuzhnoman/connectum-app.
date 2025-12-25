import React, { useState, useEffect } from 'react';
import { Loader2, Award, Lock } from 'lucide-react';
import BadgeIcon, { BADGE_CONFIG } from './BadgeIcon';

const AchievementsPanel = ({ userId, supabase }) => {
    const [achievements, setAchievements] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (userId && supabase) {
            fetchAchievements();
        }
    }, [userId, supabase]);

    const fetchAchievements = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('achievements')
                .select('*')
                .eq('user_id', userId)
                .order('earned_at', { ascending: false });

            if (error) throw error;
            setAchievements(data || []);
        } catch (error) {
            console.error('Error fetching achievements:', error);
        } finally {
            setLoading(false);
        }
    };

    // Get all badge types
    const allBadgeTypes = Object.keys(BADGE_CONFIG);

    // Create a map of earned badges
    const earnedBadges = new Map(
        achievements.map(a => [a.badge_type, a])
    );

    const earnedCount = achievements.length;
    const totalCount = allBadgeTypes.length;
    const progressPercent = (earnedCount / totalCount) * 100;

    if (loading) {
        return (
            <div className="flex items-center justify-center py-8">
                <Loader2 className="w-6 h-6 text-cyan-500 animate-spin" />
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {/* Header with Progress */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Award className="w-5 h-5 text-cyan-400" />
                    <h3 className="text-lg font-bold text-white">Achievements</h3>
                </div>
                <div className="text-sm text-slate-400">
                    {earnedCount} / {totalCount}
                </div>
            </div>

            {/* Progress Bar */}
            <div className="relative h-2 bg-slate-800 rounded-full overflow-hidden">
                <div
                    className="absolute inset-y-0 left-0 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full transition-all duration-500"
                    style={{ width: `${progressPercent}%` }}
                />
            </div>

            {/* Badges Grid */}
            <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-3">
                {allBadgeTypes.map(badgeType => {
                    const achievement = earnedBadges.get(badgeType);
                    const isLocked = !achievement;

                    return (
                        <div key={badgeType} className="flex justify-center">
                            <BadgeIcon
                                badgeType={badgeType}
                                size="md"
                                locked={isLocked}
                                earned_at={achievement?.earned_at}
                                showTooltip={true}
                            />
                        </div>
                    );
                })}
            </div>

            {/* Empty State */}
            {earnedCount === 0 && (
                <div className="text-center py-6 bg-slate-900/30 rounded-xl border border-slate-800">
                    <Lock className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                    <p className="text-sm text-slate-500">No achievements yet</p>
                    <p className="text-xs text-slate-600 mt-1">Start participating to unlock badges!</p>
                </div>
            )}

            {/* Recent Achievements */}
            {earnedCount > 0 && (
                <div className="pt-2 border-t border-slate-800">
                    <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
                        Recent Unlocks
                    </h4>
                    <div className="space-y-2">
                        {achievements.slice(0, 3).map(achievement => {
                            const config = BADGE_CONFIG[achievement.badge_type];
                            const Icon = config?.icon || Award;

                            return (
                                <div
                                    key={achievement.id}
                                    className="flex items-center gap-3 p-2 rounded-lg bg-slate-900/40 border border-slate-800 hover:border-slate-700 transition-colors"
                                >
                                    <div className={`w-8 h-8 rounded-lg ${config?.bgColor} ${config?.borderColor} border flex items-center justify-center`}>
                                        <Icon className={`w-4 h-4 ${config?.textColor}`} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-semibold text-white truncate">{config?.label}</p>
                                        <p className="text-xs text-slate-500">
                                            {new Date(achievement.earned_at).toLocaleDateString('en-US', {
                                                month: 'short',
                                                day: 'numeric'
                                            })}
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
};

export default AchievementsPanel;
