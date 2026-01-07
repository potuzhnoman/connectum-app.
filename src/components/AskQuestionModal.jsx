import React, { useState } from 'react';
import { X, MessageCircle, Mail, Github, Globe, Code2, Send } from 'lucide-react';

const AskQuestionModal = ({ isOpen, onClose, onSubmit, session, onLoginGithub, onLoginGoogle }) => {
  const [formData, setFormData] = useState({ title: '', language: 'English', category: 'Technology', details: '' });
  
  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title) return;
    onSubmit(formData);
    setFormData({ title: '', language: 'English', category: 'Technology', details: '' }); // Reset
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-950/80 backdrop-blur-md transition-opacity" 
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div className="relative w-full max-w-lg bg-slate-900/70 backdrop-blur-md border border-white/10 rounded-3xl shadow-[0_0_50px_rgba(0,0,0,0.5)] shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] p-8 animate-scale-in overflow-hidden">
        {/* Glow effect */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 via-purple-500 to-cyan-500" />
        
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-500 hover:text-white transition-colors p-2 hover:bg-white/5 rounded-full"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="mb-8 text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-full flex items-center justify-center mb-4 border border-cyan-500/30 mx-auto">
             <MessageCircle className="w-8 h-8 text-cyan-400" />
          </div>
          <h2 className="text-3xl font-bold text-white mb-2">Ask the HiveMind</h2>
          <p className="text-slate-400 text-sm">Your question will be instantly translated to experts worldwide.</p>
        </div>

        {!session ? (
          <div className="text-center py-6 bg-slate-950/50 rounded-2xl border border-white/5 p-6 mb-6">
             <p className="text-slate-300 mb-4">Login to earn XP and connect with experts worldwide.</p>
             <div className="space-y-3">
               <button
                   onClick={onLoginGoogle}
                   className="flex items-center justify-center gap-2 w-full px-5 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold rounded-xl hover:scale-[1.01] hover:shadow-lg hover:shadow-cyan-500/20 transition-all focus:outline-none focus:ring-2 focus:ring-cyan-400/40"
                 >
                   <Mail className="w-5 h-5" />
                   Login with Google
               </button>
               <button
                   onClick={onLoginGithub}
                   className="flex items-center justify-center gap-2 w-full px-5 py-4 bg-slate-900/80 border border-cyan-500/30 text-cyan-100 font-bold rounded-xl hover:bg-slate-900/60 hover:border-cyan-400/50 hover:scale-[1.01] transition-all focus:outline-none focus:ring-2 focus:ring-cyan-400/40"
                 >
                   <Github className="w-5 h-5" />
                   Login with GitHub
               </button>
             </div>
             <p className="text-slate-500 text-sm mt-4">Or continue anonymously (questions won't earn XP)</p>
          </div>
        ) : null}

        {/* Form is always available */}
        <form onSubmit={handleSubmit} className={`space-y-6 ${session ? "" : "opacity-75"}`}>
            <div className="space-y-2">
              <label className="block text-xs font-bold text-cyan-400 uppercase tracking-widest">Question</label>
              <input 
                type="text" 
                placeholder="e.g. Best strategies for..." 
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-4 text-white placeholder:text-slate-600 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all text-lg"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                autoFocus
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest">Language</label>
                <div className="relative">
                  <select 
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-500 transition-all appearance-none"
                    value={formData.language}
                    onChange={(e) => setFormData({...formData, language: e.target.value})}
                  >
                    <option>English</option>
                    <option>Ukrainian</option>
                    <option>Japanese</option>
                    <option>Spanish</option>
                    <option>German</option>
                    <option>French</option>
                    <option>Chinese</option>
                  </select>
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                    <Globe className="w-4 h-4 text-slate-500" />
                  </div>
                </div>
              </div>
               <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest">Category</label>
                <div className="relative">
                  <select 
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-500 transition-all appearance-none"
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                  >
                    <option>Life & Advice</option>
                    <option>School & Education</option>
                    <option>Gaming</option>
                    <option>Technology</option>
                    <option>Relationships</option>
                    <option>Art & Music</option>
                  </select>
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                    <Code2 className="w-4 h-4 text-slate-500" />
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-2">
               <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest">Context (Optional)</label>
               <textarea 
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white placeholder:text-slate-600 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all min-h-[100px] resize-none"
                  placeholder="Provide more details to get better answers..."
                  value={formData.details}
                  onChange={(e) => setFormData({...formData, details: e.target.value})}
               />
            </div>

            <button 
              type="submit" 
              className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold py-4 rounded-xl shadow-lg shadow-cyan-500/25 transition-all flex items-center justify-center gap-2 group transform hover:-translate-y-1 hover:scale-[1.01] focus:outline-none focus:ring-2 focus:ring-cyan-400/40"
            >
              <span className="relative flex h-3 w-3 mr-1">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-white/50"></span>
              </span>
              Broadcast to Network
              <Send className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </form>
      </div>
    </div>
  );
};

export default AskQuestionModal;