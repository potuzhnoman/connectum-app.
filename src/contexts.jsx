import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from './api';

// --- Auth Context ---

export const AuthContext = createContext({});
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [session, setSession] = useState(null);
    const [userXP, setUserXP] = useState(0);
    const [xpToast, setXpToast] = useState(null);

    useEffect(() => {
        // Initial session check
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
            if (session) fetchProfile(session.user.id);
        });

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
            if (session) fetchProfile(session.user.id);
        });

        return () => subscription.unsubscribe();
    }, []);

    const fetchProfile = async (userId) => {
        try {
            let { data, error } = await supabase
                .from('profiles')
                .select('xp')
                .eq('id', userId)
                .single();

            if (error && error.code === 'PGRST116') {
                const { data: { user } } = await supabase.auth.getUser();
                const newProfile = {
                    id: userId,
                    full_name: user?.user_metadata?.full_name || user?.email,
                    avatar_url: user?.user_metadata?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.email}`,
                    xp: 0
                };
                const { data: createdProfile } = await supabase.from('profiles').insert([newProfile]).select().single();
                if (createdProfile) setUserXP(createdProfile.xp);
            } else if (data) {
                setUserXP(data.xp);
            }
        } catch (error) {
            const localXP = localStorage.getItem(`user_xp_${userId}`);
            if (localXP) setUserXP(parseInt(localXP));
        }
    };

    const awardXP = async (amount, reason = '') => {
        if (!session?.user?.id) return;
        const newXP = userXP + amount;
        setUserXP(newXP);
        setXpToast(`+${amount} XP - ${reason}`);
        setTimeout(() => setXpToast(null), 3000);

        try {
            await supabase.from('profiles').update({ xp: newXP }).eq('id', session.user.id);
            localStorage.setItem(`user_xp_${session.user.id}`, newXP.toString());
        } catch (error) {
            localStorage.setItem(`user_xp_${session.user.id}`, newXP.toString());
        }
    };

    const loginWithGithub = () => supabase.auth.signInWithOAuth({ provider: 'github' });
    const loginWithGoogle = () => supabase.auth.signInWithOAuth({ provider: 'google' });
    const logout = () => supabase.auth.signOut();

    const level = Math.floor(userXP / 1000) + 1;
    const xpProgress = (userXP % 1000) / 10;

    return (
        <AuthContext.Provider value={{
            session,
            userXP,
            level,
            xpProgress,
            loginWithGithub,
            loginWithGoogle,
            logout,
            awardXP,
            xpToast
        }}>
            {children}
        </AuthContext.Provider>
    );
};

// --- Search Context ---

export const SearchContext = createContext({});
export const useSearch = () => useContext(SearchContext);

export const SearchProvider = ({ children }) => {
    const [searchQuery, setSearchQuery] = useState('');
    return (
        <SearchContext.Provider value={{ searchQuery, setSearchQuery }}>
            {children}
        </SearchContext.Provider>
    );
};
