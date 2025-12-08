import React, { useState, useEffect } from 'react';
import { Zap, Loader2, Sparkles, Languages, MessageSquare, Mail, Github, Send, CheckCircle2 } from 'lucide-react';

const QuestionCard = ({ 
  data, 
  onSubmitAnswer, 
  session, 
  onLoginGithub, 
  onLoginGoogle,
  onUserClick // Added prop
}) => {
  const [translated, setTranslated] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isSimulatingAI, setIsSimulatingAI] = useState(data.isNew || false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [answerText, setAnswerText] = useState("");

  useEffect(() => {
    if (isSimulatingAI) {
      const timer = setTimeout(() => {
        setIsSimulatingAI(false);
      }, 2000); 
      return () => clearTimeout(timer);
    }
  }, [isSimulatingAI]);

  const handleAnswerSubmit = () => {
    if (!session) {
      alert("Please login to answer questions.");
      return;
    }
    if (!answerText.trim()) return;
    onSubmitAnswer(data.id, answerText);
    setAnswerText("");
  };

  const handleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div 
      className={`relative p-6 rounded-3xl bg-slate-900/45 backdrop-blur-2xl border border-white/10 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] shadow-black/30 transition-all duration-500 hover:-translate-y-0.5 hover:shadow-[0_25px_70px_-40px_rgba(0,0,0,0.9)] hover:shadow-lg hover:shadow-black/40 hover:bg-slate-900/30 group ${data.isNew ? 'animate-slide-in' : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Card Glow */}
      <div className={`absolute -inset-0.5 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-3xl opacity-0 group-hover:opacity-10 transition-opacity duration-500 blur-lg`} />
      <div className="absolute inset-0 bg-white/5 group-hover:bg-white/10 transition-colors duration-500 pointer-events-none" />
      <div className="absolute inset-0 pointer-events-none shadow-[inset_0_25px_60px_-50px_rgba(255,255,255,0.35)]" />

      {/* Header */}
      <div className="flex items-center justify-between mb-5 relative z-10">
        <div className="flex items-center gap-4">
          <div 
            className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-cyan-500/20 overflow-hidden border border-white/10 cursor-pointer"
            onClick={() => onUserClick && onUserClick(data.authorId)} // Added handler
          >
             {data.avatarUrl ? (
               <img src={data.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
             ) : (
               <span>{data.avatar}</span>
             )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 
                className="text-base font-bold text-white group-hover:text-cyan-200 transition-colors cursor-pointer"
                onClick={() => onUserClick && onUserClick(data.authorId)} // Added handler
              >
                {data.name}
              </h4>
              <span 
                className="text-[10px] bg-slate-800/80 px-2 py-0.5 rounded-full text-slate-300 flex items-center gap-1 border border-slate-700"
                title={`${data.country}${data.language ? ' • ' + data.language : ''}`}
              >
                {data.flag} {data.country}
              </span>
            </div>
            <p className="text-[11px] font-mono text-slate-500 mt-0.5">{data.timeAgo}</p>
          </div>
        </div>
        <div className="flex items-center gap-1 text-amber-400 bg-amber-400/10 px-3 py-1 rounded-full border border-amber-400/20 shadow-[0_0_15px_rgba(245,158,11,0.1)]">
          <Zap className="w-3.5 h-3.5 fill-current" />
          <span className="text-xs font-bold">{data.xp} XP</span>
        </div>
      </div>

      {/* Content Area */}
      <div className="mb-5 min-h-[80px] relative z-10">
        {isSimulatingAI ? (
          <div className="flex flex-col items-center justify-center py-6 space-y-3 animate-pulse bg-slate-950/30 rounded-xl border border-indigo-500/20">
            <Loader2 className="w-8 h-8 text-indigo-400 animate-spin" />
            <p className="text-xs font-mono text-indigo-300">ANALYZING LANGUAGE PATTERNS...</p>
          </div>
        ) : (
          <div className="space-y-4 animate-fade-in">
             {/* Original Text */}
            <div className={`transition-all duration-500 ${translated ? 'opacity-40 scale-95 origin-left' : 'opacity-100'}`}>
              <p className="text-[19px] text-slate-100 font-medium leading-relaxed">
                "{data.questionOriginal}"
              </p>
            </div>

            {/* Translation Reveal */}
            <div className={`overflow-hidden transition-all duration-500 ease-in-out ${translated ? 'max-h-32 opacity-100' : 'max-h-0 opacity-0'}`}>
              <div className="flex gap-4 pl-4 border-l-2 border-cyan-500 bg-gradient-to-r from-cyan-900/10 to-transparent p-3 rounded-r-xl">
                <Sparkles className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-1" />
                <p className="text-base text-gray-300 font-normal leading-relaxed">
                  {data.questionTranslated}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between pt-5 border-t border-white/5 relative z-10">
        <button 
          onClick={() => !isSimulatingAI && setTranslated(!translated)}
          disabled={isSimulatingAI}
          className={`flex items-center gap-2 text-xs font-bold px-4 py-2 rounded-xl transition-all hover:scale-[1.01] focus:outline-none focus:ring-2 focus:ring-cyan-400/40 ${
            translated 
              ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-cyan-50 border border-cyan-400/40 shadow-[0_10px_30px_-20px_rgba(34,211,238,0.8)]' 
              : 'bg-slate-800/60 text-slate-300 hover:text-white hover:bg-slate-800 border border-cyan-400/30'
          } ${isSimulatingAI ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          <Languages className="w-3.5 h-3.5" />
          {translated ? 'Show Original' : 'AI Translate'}
        </button>

        <div className="flex items-center gap-3">
           <button 
             onClick={() => !isSimulatingAI && handleExpand()}
             disabled={isSimulatingAI}
             className="text-amber-50 transition-colors flex items-center gap-1.5 text-xs font-medium p-2 rounded-lg border border-orange-400/30 bg-gradient-to-r from-orange-400 via-pink-500 to-purple-600 hover:brightness-110 hover:scale-[1.01] disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-orange-400/40"
           >
             <MessageSquare className="w-4 h-4" /> 
             {data.comments}
           </button>
           <button 
             onClick={() => !isSimulatingAI && handleExpand()}
             className={`px-5 py-2 text-xs font-bold rounded-xl transition-all shadow-lg disabled:opacity-50 hover:scale-[1.01] focus:outline-none focus:ring-2 focus:ring-orange-400/40 ${isExpanded 
              ? 'bg-gradient-to-r from-rose-500 to-orange-500 text-amber-50 shadow-rose-500/30' 
              : 'bg-gradient-to-r from-orange-400 via-pink-500 to-purple-600 text-amber-50 hover:brightness-110'}`} 
             disabled={isSimulatingAI}
           >
             {isExpanded ? 'Close' : 'Answer'}
           </button>
        </div>
      </div>

      {/* Expandable Reply Section */}
      {isExpanded && (
        <div className="mt-6 pt-6 border-t border-white/5 animate-fade-in relative z-10">
          {/* Existing Replies */}
          {data.replies && data.replies.length > 0 && (
            <div className="mb-6 space-y-4">
              <h5 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Top Answers</h5>
              {data.replies.map((reply) => (
                <div key={reply.id} className="bg-slate-950/60 rounded-xl p-4 border border-white/5 flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-slate-800 overflow-hidden border border-white/10">
                    <img src={reply.avatar} alt={reply.author} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-cyan-300">{reply.author}</span>
                      <span className="text-[10px] text-slate-500">{reply.time}</span>
                    </div>
                    <p className="text-sm text-slate-300 leading-relaxed">{reply.text}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* New Answer Input */}
          <div className="relative group/input">
            {!session && (
              <div className="absolute inset-0 z-20 bg-slate-950/90 backdrop-blur-sm flex flex-col items-center justify-center rounded-xl border border-slate-800">
                 <p className="text-slate-300 text-sm mb-4 font-bold">Join the HiveMind to answer</p>
                 <div className="flex gap-3">
                   <button onClick={onLoginGoogle} className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-xs font-bold rounded-lg transition-all hover:shadow-lg hover:shadow-cyan-500/20 hover:scale-[1.01] focus:outline-none focus:ring-2 focus:ring-cyan-400/40">
                     <Mail className="w-3 h-3" /> Google
                   </button>
                   <button onClick={onLoginGithub} className="flex items-center gap-2 px-4 py-2 bg-slate-900/70 border border-cyan-500/30 text-cyan-100 text-xs font-bold rounded-lg transition-all hover:bg-slate-900/50 hover:border-cyan-400/50 hover:scale-[1.01] focus:outline-none focus:ring-2 focus:ring-cyan-400/40">
                     <Github className="w-3 h-3" /> GitHub
                   </button>
                 </div>
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 rounded-xl blur-md opacity-0 group-focus-within/input:opacity-100 transition-opacity duration-500 -z-10" />
            <textarea 
              value={answerText}
              onChange={(e) => setAnswerText(e.target.value)}
              placeholder={session ? "Type your answer here... Earn +100 XP" : "Login to answer..."}
              className="w-full bg-slate-950/80 border border-slate-700 rounded-xl p-4 pr-14 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 transition-all resize-none min-h-[100px]"
              disabled={!session}
            />
            <button 
              onClick={handleAnswerSubmit}
              disabled={!answerText.trim() || !session}
              className="absolute bottom-3 right-3 p-2 bg-emerald-500 hover:bg-emerald-400 disabled:bg-slate-800 disabled:text-slate-600 text-white rounded-lg transition-colors shadow-lg shadow-emerald-500/20"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
          <div className="mt-3 flex items-center gap-2 text-[10px] text-slate-500 justify-end">
             <CheckCircle2 className="w-3 h-3 text-emerald-500" />
             <span>Submitting a helpful answer earns <span className="text-emerald-400 font-bold">+100 XP</span></span>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuestionCard;