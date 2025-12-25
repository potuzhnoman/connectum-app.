import { useState, useEffect, useRef } from 'react';

/**
 * Custom hook for managing user achievements
 * Tracks user actions and unlocks achievements automatically
 */
export const useAchievements = (supabase, session) => {
    const [achievements, setAchievements] = useState([]);
    const [newAchievement, setNewAchievement] = useState(null);
    const checkTimeoutRef = useRef(null);

    // Achievement definitions with unlock conditions
    const ACHIEVEMENT_DEFINITIONS = {
        first_question: {
            check: async (userId) => {
                const { count } = await supabase
                    .from('questions')
                    .select('*', { count: 'exact', head: true })
                    .eq('author_id', userId);
                return count >= 1;
            }
        },
        helpful_hero: {
            check: async (userId) => {
                const { count } = await supabase
                    .from('replies')
                    .select('*', { count: 'exact', head: true })
                    .eq('author_id', userId)
                    .eq('is_best_answer', true);
                return count >= 5;
            }
        },
        answer_streak: {
            check: async (userId) => {
                // Simplified: check if user has answered in last 3 days
                const threeDaysAgo = new Date();
                threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
                const { count } = await supabase
                    .from('replies')
                    .select('*', { count: 'exact', head: true })
                    .eq('author_id', userId)
                    .gte('created_at', threeDaysAgo.toISOString());
                return count >= 3;
            }
        },
        sharp_shooter: {
            check: async (userId) => {
                const { count } = await supabase
                    .from('replies')
                    .select('*', { count: 'exact', head: true })
                    .eq('author_id', userId)
                    .eq('is_best_answer', true);
                return count >= 10;
            }
        },
        knowledge_king: {
            check: async (userId) => {
                const { data } = await supabase
                    .from('profiles')
                    .select('xp')
                    .eq('id', userId)
                    .single();
                return data?.xp >= 5000;
            }
        },
        early_adopter: {
            check: async (userId) => {
                const { data } = await supabase
                    .from('profiles')
                    .select('created_at')
                    .order('created_at', { ascending: true })
                    .limit(100);

                if (!data) return false;
                const userProfile = await supabase
                    .from('profiles')
                    .select('created_at')
                    .eq('id', userId)
                    .single();

                return data.some(p => p.created_at === userProfile.data?.created_at);
            }
        },
        polyglot: {
            check: async (userId) => {
                const { data } = await supabase
                    .from('questions')
                    .select('language')
                    .eq('author_id', userId);

                const uniqueLanguages = new Set(data?.map(q => q.language) || []);
                return uniqueLanguages.size >= 3;
            }
        },
        rising_star: {
            check: async (userId) => {
                const oneWeekAgo = new Date();
                oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

                const { data: currentProfile } = await supabase
                    .from('profiles')
                    .select('xp')
                    .eq('id', userId)
                    .single();

                // Simplified: assume user gained 1000+ XP if current XP > 1000
                return currentProfile?.xp >= 1000;
            }
        },
        legendary: {
            check: async (userId) => {
                const { data } = await supabase
                    .from('profiles')
                    .select('xp')
                    .eq('id', userId)
                    .single();
                const level = Math.floor((data?.xp || 0) / 1000) + 1;
                return level >= 10;
            }
        },
        speedster: {
            check: async (userId) => {
                // Check if user has any reply within 5 minutes of question
                const { data: replies } = await supabase
                    .from('replies')
                    .select('created_at, question_id')
                    .eq('author_id', userId);

                if (!replies || replies.length === 0) return false;

                for (const reply of replies) {
                    const { data: question } = await supabase
                        .from('questions')
                        .select('created_at')
                        .eq('id', reply.question_id)
                        .single();

                    if (question) {
                        const timeDiff = new Date(reply.created_at) - new Date(question.created_at);
                        if (timeDiff <= 5 * 60 * 1000) return true; // 5 minutes
                    }
                }
                return false;
            }
        },
        guardian: {
            check: async (userId) => {
                const { count } = await supabase
                    .from('replies')
                    .select('*', { count: 'exact', head: true })
                    .eq('author_id', userId);
                return count >= 50;
            }
        },
        community_lover: {
            check: async (userId) => {
                const { data } = await supabase
                    .from('profiles')
                    .select('created_at')
                    .eq('id', userId)
                    .single();

                if (!data) return false;
                const daysSinceJoined = (new Date() - new Date(data.created_at)) / (1000 * 60 * 60 * 24);
                return daysSinceJoined >= 30;
            }
        }
    };

    // Fetch user's current achievements
    useEffect(() => {
        if (session?.user?.id && supabase) {
            fetchAchievements();
        }
    }, [session, supabase]);

    const fetchAchievements = async () => {
        if (!session?.user?.id) return;

        try {
            const { data, error } = await supabase
                .from('achievements')
                .select('*')
                .eq('user_id', session.user.id);

            if (error) throw error;
            setAchievements(data || []);
        } catch (error) {
            console.error('Error fetching achievements:', error);
        }
    };

    // Check if user has earned a specific achievement
    const hasAchievement = (badgeType) => {
        return achievements.some(a => a.badge_type === badgeType);
    };

    // Unlock a new achievement
    const unlockAchievement = async (badgeType) => {
        if (!session?.user?.id) return false;

        // Check if already unlocked
        if (hasAchievement(badgeType)) return false;

        try {
            const { data, error } = await supabase
                .from('achievements')
                .insert([{
                    user_id: session.user.id,
                    badge_type: badgeType,
                    metadata: {}
                }])
                .select()
                .single();

            if (error) {
                // Ignore unique constraint violation (already earned)
                if (error.code === '23505') return false;
                throw error;
            }

            // Update local state
            setAchievements(prev => [...prev, data]);

            // Show achievement notification
            setNewAchievement(data);
            setTimeout(() => setNewAchievement(null), 5000);

            return true;
        } catch (error) {
            console.error('Error unlocking achievement:', error);
            return false;
        }
    };

    // Check all achievement conditions for the user
    const checkAchievements = async () => {
        if (!session?.user?.id) return;

        // Debounce checks to avoid excessive API calls
        if (checkTimeoutRef.current) {
            clearTimeout(checkTimeoutRef.current);
        }

        checkTimeoutRef.current = setTimeout(async () => {
            for (const [badgeType, definition] of Object.entries(ACHIEVEMENT_DEFINITIONS)) {
                if (!hasAchievement(badgeType)) {
                    try {
                        const shouldUnlock = await definition.check(session.user.id);
                        if (shouldUnlock) {
                            await unlockAchievement(badgeType);
                        }
                    } catch (error) {
                        console.error(`Error checking ${badgeType}:`, error);
                    }
                }
            }
        }, 1000); // Wait 1 second before checking
    };

    // Cleanup
    useEffect(() => {
        return () => {
            if (checkTimeoutRef.current) {
                clearTimeout(checkTimeoutRef.current);
            }
        };
    }, []);

    return {
        achievements,
        newAchievement,
        hasAchievement,
        unlockAchievement,
        checkAchievements,
        refreshAchievements: fetchAchievements
    };
};

export default useAchievements;
