import React from 'react';
import { X, User, MapPin, Calendar, Award, ShieldCheck, Github, Mail } from 'lucide-react';

const UserProfileModal = ({ isOpen, onClose, user }) => {
  if (!isOpen) return null;

  // Fallback data if user is not fully populated
  const userData = user || {
    name: 'Anonymous Node',
    avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=Anonymous`,
    bio: 'This user has not added a bio yet.',
    location: 'Unknown Sector',
    joined: 'Recently',
    level: 1,
    xp: 0,
    role: 'Explorer'
  };

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-slate-950/90 backdrop-blur-md transition-opacity" 
        onClick={onClose}
      />
      
      <div className="relative w-full max-w-md bg-slate-900 border border-white/10 rounded-3xl shadow-[0_0_60px_rgba(79,70,229,0.15)] overflow-hidden animate-scale-in">
        {/* Banner */}
        <div className="h-32 bg-gradient-to-r from-cyan-600 to-purple-600 relative">
           <button 
            onClick={onClose}
            className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-full"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Profile Info */}
        <div className="px-6 pb-8">
          <div className="relative -mt-12 mb-4 flex justify-between items-end">
            <div className="w-24 h-24 rounded-full p-1 bg-slate-900">
               <img 
                 src={userData.avatarUrl} 
                 alt="Profile" 
                 className="w-full h-full rounded-full object-cover bg-slate-800"
               />
            </div>
            <div className="mb-2 flex gap-2">
               <button className="p-2 bg-slate-800 border border-slate-700 text-slate-300 rounded-lg hover:text-white hover:border-slate-600 transition-all">
                 <Mail className="w-4 h-4" />
               </button>
               <button className="p-2 bg-slate-800 border border-slate-700 text-slate-300 rounded-lg hover:text-white hover:border-slate-600 transition-all">
                 <Github className="w-4 h-4" />
               </button>
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              {userData.name}
              <ShieldCheck className="w-5 h-5 text-cyan-400" />
            </h2>
            <p className="text-cyan-400 text-sm font-medium mb-4">Level {userData.level} • {userData.role}</p>
            
            <p className="text-slate-400 text-sm leading-relaxed mb-6">
              {userData.bio}
            </p>

            <div className="flex flex-col gap-3 text-sm text-slate-500">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                {userData.location}
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Joined {userData.joined}
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-white/5 grid grid-cols-2 gap-4">
               <div className="bg-slate-800/50 rounded-xl p-3 border border-white/5 text-center">
                  <div className="text-2xl font-bold text-white">{userData.xp}</div>
                  <div className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">Total XP</div>
               </div>
               <div className="bg-slate-800/50 rounded-xl p-3 border border-white/5 text-center">
                  <div className="text-2xl font-bold text-white">12</div>
                  <div className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">Answers</div>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfileModal;