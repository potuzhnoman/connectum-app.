import React, { useState, useEffect } from 'react';
import { X, Loader2, Activity } from 'lucide-react';

const UserProfileModal = ({ isOpen, onClose, userId, supabase }) => {
  const [profile, setProfile] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen && userId && supabase) {
      const fetchUserData = async () => {
        setLoading(true);
        try {
          // 1. Скачиваем профиль из auth metadata или создаем mock
          let profileData = null;

          // Try to get user from auth
          const { data: { user } } = await supabase.auth.getUser();
          if (user && user.id === userId) {
            profileData = {
              id: user.id,
              full_name: user.user_metadata?.full_name || user.email,
              avatar_url: user.user_metadata?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`,
              xp: 1500 // Mock XP for now
            };
          } else {
            // Mock profile for other users
            profileData = {
              id: userId,
              full_name: 'Anonymous User',
              avatar_url: `https://api.dicebear.com/7.x/avataaars/svg?seed=${userId}`,
              xp: 1000 // Mock XP
            };
          }

          setProfile(profileData);

          // 2. Скачиваем историю вопросов
          const { data: historyData } = await supabase
            .from('questions')
            .select('*')
            .eq('author_id', userId)
            .order('created_at', { ascending: false })
            .limit(5);
          setHistory(historyData || []);
        } catch (err) {
          console.error("Error fetching user data:", err);
          // Set empty data on error
          setProfile(null);
          setHistory([]);
        } finally {
          setLoading(false);
        }
      };
      fetchUserData();
    }
  }, [isOpen, userId, supabase]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-xl transition-opacity" onClick={onClose} />
      
      <div className="relative w-full max-w-md bg-slate-900/90 border border-cyan-500/30 rounded-2xl shadow-[0_0_50px_rgba(6,182,212,0.15)] overflow-hidden flex flex-col max-h-[85vh]">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-70" />
        
        {/* Header */}
        <div className="p-6 pb-0 flex justify-between items-start relative z-10">
           <div className="flex items-center gap-2 px-2 py-1 rounded bg-cyan-500/10 border border-cyan-500/30">
              <div className="w-2 h-2 bg-cyan-500 rounded-full animate-pulse" />
              <span className="text-[10px] font-mono font-bold text-cyan-400 uppercase tracking-widest">Netrunner ID</span>
           </div>
           <button onClick={onClose} className="text-slate-500 hover:text-white transition-colors"><X className="w-5 h-5" /></button>
        </div>

        <div className="p-6 border-b border-white/5 relative z-10">
           {loading ? (
             <div className="flex flex-col items-center py-10"><Loader2 className="w-10 h-10 text-cyan-500 animate-spin" /></div>
           ) : profile ? (
             <div className="flex flex-col items-center text-center">
                <div className="w-24 h-24 rounded-2xl border-2 border-cyan-500/50 p-1 bg-slate-950 rotate-3 mb-4">
                    <img src={profile.avatar_url} className="w-full h-full object-cover rounded-xl -rotate-3" />
                </div>
                <h2 className="text-2xl font-bold text-white tracking-tight">{profile.full_name}</h2>
                <p className="text-xs font-mono text-slate-500 mt-1 mb-6 bg-slate-800/50 px-3 py-1 rounded-full">ID: {profile.id.slice(0, 8)}...</p>
                
                <div className="grid grid-cols-2 gap-3 w-full">
                   <div className="bg-slate-800/40 border border-white/5 p-3 rounded-xl text-center">
                      <span className="text-[10px] text-slate-400 uppercase font-bold">Level</span>
                      <div className="text-xl font-bold text-amber-400">{Math.floor(profile.xp / 1000) + 1}</div>
                   </div>
                   <div className="bg-slate-800/40 border border-white/5 p-3 rounded-xl text-center">
                      <span className="text-[10px] text-slate-400 uppercase font-bold">XP</span>
                      <div className="text-xl font-bold text-cyan-400">{profile.xp}</div>
                   </div>
                </div>
             </div>
           ) : <div className="text-center py-10 text-slate-500">User not found.</div>}
        </div>

        {/* History List */}
        <div className="flex-1 overflow-y-auto p-6 bg-black/20 custom-scrollbar relative z-10">
           <h3 className="text-xs font-bold text-slate-500 uppercase mb-4 flex gap-2"><Activity className="w-3 h-3" /> Recent Activity</h3>
           <div className="space-y-3">
              {history.map((item) => (
                 <div key={item.id} className="p-3 rounded-xl bg-white/5 border border-white/5">
                    <p className="text-sm text-slate-200 mb-2 line-clamp-2">"{item.text}"</p>
                    <div className="flex justify-between text-[10px] text-slate-500">
                        <span>{item.language}</span>
                        <span>{new Date(item.created_at).toLocaleDateString()}</span>
                    </div>
                 </div>
              ))}
              {!loading && history.length === 0 && <p className="text-slate-600 text-sm text-center">No transmissions yet.</p>}
           </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfileModal;