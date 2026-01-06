import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../services/supabase';

const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [session, setSession] = useState(null);
    const [loading, setLoading] = useState(true);
    const [userXP, setUserXP] = useState(0);
    const [userLevel, setUserLevel] = useState(1);

    // Calculate level and XP progress
    const calculateLevel = (xp) => {
        const level = Math.floor(xp / 1000) + 1;
        const xpForCurrentLevel = xp % 1000;
        const xpProgress = (xpForCurrentLevel / 1000) * 100;
        return { level, xpProgress };
    };

    // Update XP and level when session changes
    const updateUserStats = (xp) => {
        setUserXP(xp);
        const { level, xpProgress } = calculateLevel(xp);
        setUserLevel(level);
        return { level, xpProgress };
    };

    // Award XP function
    const awardXP = async (amount, reason = '') => {
        if (!session?.user?.id) return;

        const newXP = userXP + amount;
        updateUserStats(newXP);

        // In a real app, you'd update this in the database
        // For now, we'll store it in localStorage as a demo
        const userXPKey = `user_xp_${session.user.id}`;
        localStorage.setItem(userXPKey, newXP.toString());

        console.log(`Awarded ${amount} XP for: ${reason}`);
        return newXP;
    };

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);

            // Load XP from localStorage (in production, load from database)
            if (session?.user?.id) {
                const userXPKey = `user_xp_${session.user.id}`;
                const savedXP = parseInt(localStorage.getItem(userXPKey) || '0');
                updateUserStats(savedXP);
            }

            setLoading(false);
        });

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);

            // Load XP when user logs in
            if (session?.user?.id) {
                const userXPKey = `user_xp_${session.user.id}`;
                const savedXP = parseInt(localStorage.getItem(userXPKey) || '0');
                updateUserStats(savedXP);
            } else {
                setUserXP(0);
                setUserLevel(1);
            }

            setLoading(false);
        });

        return () => subscription.unsubscribe();
    }, []);

    const loginWithGithub = async () => {
        await supabase.auth.signInWithOAuth({
            provider: 'github',
            options: { redirectTo: window.location.origin }
        });
    };

    const loginWithGoogle = async () => {
        await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: { redirectTo: window.location.origin }
        });
    };

    const logout = async () => {
        await supabase.auth.signOut();
    };

    return (
        <AuthContext.Provider value={{
            session,
            loading,
            loginWithGithub,
            loginWithGoogle,
            logout,
            userXP,
            userLevel,
            awardXP,
            xpProgress: calculateLevel(userXP).xpProgress
        }}>
            {children}
        </AuthContext.Provider>
    );
};
