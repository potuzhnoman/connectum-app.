import React, { useState, useEffect } from 'react';
import { X, Trophy, Loader2, Crown } from 'lucide-react';
import { supabase } from '../api';

const LeaderboardModal = ({ isOpen, onClose, supabase }) => {
  const [leaders, setLeaders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen && supabase) {
      fetchLeaders();
    }
  }, [isOpen, supabase]);

  const fetchLeaders = async () => {
    setLoading(true);
    try {
      // Try to fetch from database first
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .order('xp', { ascending: false })
          .limit(10);

        if (!error && data && data.length > 0) {
          setLeaders(data);
          setLoading(false);
          return;
        }
      } catch (dbError) {
        console.warn("Database not available, using mock data:", dbError);
      }

      // Fallback to mock data
      const mockLeaders = [
        {
          id: '1',
          full_name: 'Alex Developer',
          avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex',
          xp: 2500
        },
        {
          id: '2',
          full_name: 'Maria Coder',
          avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Maria',
          xp: 2100
        },
        {
          id: '3',
          full_name: 'John Tech',
          avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John',
          xp: 1800
        },
        {
          id: '4',
          full_name: 'Sarah Engineer',
          avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
          xp: 1600
        },
        {
          id: '5',
          full_name: 'Mike Builder',
          avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mike',
          xp: 1400
        }
      ];

      setLeaders(mockLeaders);
    } catch (err) {
      console.error("Error fetching leaderboard:", err);
      // Show empty state on error
      setLeaders([]);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-slate-950/90 backdrop-blur-xl transition-opacity"
        onClick={onClose}
      />

      <div className="relative w-full max-w-md bg-slate-900 border border-amber-500/20 rounded-3xl shadow-[0_0_80px_rgba(245,158,11,0.15)] p-0 animate-scale-in overflow-hidden flex flex-col max-h-[80vh]">

        {/* Header */}
        <div className="p-6 pb-4 border-b border-white/5 bg-gradient-to-b from-amber-500/10 to-transparent relative">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-amber-500 to-transparent opacity-50" />
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-slate-500 hover:text-white transition-colors p-2 hover:bg-white/5 rounded-full"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3">
            <div className="p-3 bg-amber-500/20 rounded-xl border border-amber-500/30">
              <Trophy className="w-6 h-6 text-amber-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Top Nodes</h2>
              <p className="text-xs text-amber-500/70 font-bold uppercase tracking-widest">Global Ranking</p>
            </div>
          </div>
        </div>

        {/* List */}
        <div className="overflow-y-auto p-4 space-y-2 custom-scrollbar">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-10">
              <Loader2 className="w-8 h-8 text-amber-500 animate-spin mb-2" />
              <p className="text-xs text-slate-500 font-mono">CALCULATING RANK...</p>
            </div>
          ) : (
            leaders.map((user, index) => {
              const rank = index + 1;
              let rankStyle = "bg-slate-800 text-slate-400 border-slate-700";
              let icon = null;

              if (rank === 1) {
                rankStyle = "bg-yellow-500/20 text-yellow-300 border-yellow-500/50 shadow-[0_0_15px_rgba(234,179,8,0.2)]";
                icon = <Crown className="w-3 h-3 text-yellow-400 absolute -top-1 -right-1 transform rotate-12" />;
              } else if (rank === 2) {
                rankStyle = "bg-slate-300/20 text-slate-300 border-slate-400/50";
              } else if (rank === 3) {
                rankStyle = "bg-orange-700/20 text-orange-300 border-orange-700/50";
              }

              return (
                <div key={user.id} className="flex items-center gap-4 p-3 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors group">
                  <div className={`relative w-8 h-8 flex items-center justify-center rounded-lg border font-bold text-sm ${rankStyle}`}>
                    {rank}
                    {icon}
                  </div>

                  <div className="w-10 h-10 rounded-full bg-slate-800 overflow-hidden ring-2 ring-white/10 group-hover:ring-cyan-500/50 transition-all">
                    <img
                      src={user.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.full_name}`}
                      alt={user.full_name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-bold text-white truncate">{user.full_name || 'Anonymous Node'}</h4>
                    <p className="text-[10px] text-slate-500 truncate">Node ID: {user.id.slice(0, 8)}...</p>
                  </div>

                  <div className="text-right">
                    <span className="block text-sm font-bold text-amber-400">{user.xp} XP</span>
                    <span className="text-[10px] text-slate-600 uppercase font-bold">Lvl {Math.floor(user.xp / 1000) + 1}</span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default LeaderboardModal;