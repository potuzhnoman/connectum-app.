import React, { useState } from 'react';
import { MessageCircle, Share2, MoreHorizontal, CornerDownRight, CheckCircle, Award, Languages, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { translateText } from '../api';

const QuestionCard = ({
  data,
  onSubmitAnswer,
  onMarkBestAnswer,
  session,
  onLoginGithub,
  onLoginGoogle,
  onUserClick,
  supabase,
  onErrorToast,
  defaultExpanded = false
}) => {
  const [showReplyInput, setShowReplyInput] = useState(defaultExpanded);
  const [replyText, setReplyText] = useState('');
  const [isTranslated, setIsTranslated] = useState(false);
  const [translatedText, setTranslatedText] = useState(null);
  const [isTranslating, setIsTranslating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Translation Logic
  const handleTranslate = async () => {
    if (isTranslated) {
      setIsTranslated(false);
      return;
    }
    if (translatedText) {
      setIsTranslated(true);
      return;
    }

    try {
      const text = await translateText(data.questionOriginal, 'EN');
      setTranslatedText(text);
      setIsTranslated(true);
    } catch (error) {
      setTranslatedText("[Mock Translation]: " + data.questionOriginal);
      setIsTranslated(true);
      if (onErrorToast) onErrorToast("Translation service unavailable", "error");
    } finally {
      setIsTranslating(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!replyText.trim()) return;

    setIsSubmitting(true);
    try {
      await onSubmitAnswer(data.id, replyText);
      setReplyText('');
      // Keep expanded to see the new answer
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div id={`question-${data.id}`} className="glass-card rounded-3xl p-6 sm:p-8 animate-fade-in group relative overflow-hidden">
      {/* Background Accent */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 rounded-full blur-3xl -z-10 transition-all duration-500 group-hover:bg-cyan-500/10" />

      {/* Header */}
      <div className="flex justify-between items-start mb-6">
        <div className="flex items-center gap-4">
          <button onClick={() => onUserClick(data.authorId)} className="relative group/avatar">
            <div className="w-12 h-12 rounded-2xl bg-slate-800 p-0.5 ring-2 ring-white/5 group-hover/avatar:ring-cyan-500/50 transition-all overflow-hidden">
              <img src={data.avatarUrl} alt={data.name} className="w-full h-full rounded-[14px] object-cover" />
            </div>
            {data.country === 'UA' && (
              <div className="absolute -bottom-1 -right-1 text-base animate-bounce-in" title="Ukraine">🇺🇦</div>
            )}
          </button>

          <div>
            <div className="flex items-center gap-2">
              <span
                className="font-bold text-white hover:text-cyan-400 cursor-pointer transition-colors"
                onClick={() => onUserClick(data.authorId)}
              >
                {data.name}
              </span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700">
                {data.language}
              </span>
            </div>
            <div className="text-xs text-slate-500 mt-1 flex items-center gap-2">
              <span>{data.timeAgo}</span>
              <span>•</span>
              <span className="flex items-center gap-1 text-cyan-500/80">
                <Award className="w-3 h-3" />
                {data.xp} XP reward
              </span>
            </div>
          </div>
        </div>

        <button className="text-slate-500 hover:text-white transition-colors">
          <MoreHorizontal className="w-5 h-5" />
        </button>
      </div>

      {/* Content */}
      <div className="mb-6 relative">
        <h3 className="text-xl sm:text-2xl font-semibold text-slate-100 leading-relaxed">
          {isTranslated ? translatedText : data.questionOriginal}
        </h3>

        {/* Translation Toggle */}
        <button
          onClick={handleTranslate}
          className="mt-3 flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-cyan-400 transition-colors uppercase tracking-wider"
        >
          {isTranslating ? (
            <span className="animate-pulse">Translating...</span>
          ) : (
            <>
              <Languages className="w-3 h-3" />
              {isTranslated ? "Show Original" : "Translate to English"}
            </>
          )}
        </button>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-4 border-t border-white/5 pt-6">
        <button
          onClick={() => setShowReplyInput(!showReplyInput)}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${showReplyInput
            ? 'bg-cyan-500/10 text-cyan-300 ring-1 ring-cyan-500/30'
            : 'bg-slate-800/50 text-slate-400 hover:bg-slate-800 hover:text-white'
            }`}
        >
          <MessageCircle className="w-4 h-4" />
          <span className="text-sm font-bold">{data.comments} Answers</span>
        </button>

        <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800/50 text-slate-400 hover:bg-slate-800 hover:text-white transition-all">
          <Share2 className="w-4 h-4" />
          <span className="text-sm font-bold">Share</span>
        </button>

        {/* Deep Link to Question Page */}
        <Link
          to={`/question/${data.id}`}
          className="ml-auto text-xs font-bold text-slate-600 hover:text-white transition-colors"
        >
          View Thread →
        </Link>
      </div>

      {/* Replies Section */}
      {showReplyInput && (
        <div className="mt-6 pt-6 border-t border-white/5 animate-slide-in">
          {/* Input */}
          {session ? (
            <form onSubmit={handleSubmit} className="flex gap-3 mb-8">
              <img
                src={session.user.user_metadata.avatar_url}
                alt="Me"
                className="w-10 h-10 rounded-xl bg-slate-800 object-cover"
              />
              <div className="flex-1 relative group-focus-within:ring-2 ring-cyan-500/20 rounded-2xl transition-all">
                <textarea
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Write a helpful answer..."
                  className="w-full bg-slate-900/50 border border-white/10 rounded-2xl p-4 text-sm text-slate-200 focus:outline-none focus:bg-slate-900 transition-all resize-none h-[100px]"
                />
                <div className="absolute bottom-3 right-3">
                  <button
                    type="submit"
                    disabled={!replyText.trim() || isSubmitting}
                    className="bg-cyan-600 hover:bg-cyan-500 disabled:bg-slate-600 text-white p-2 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-cyan-500/20"
                  >
                    {isSubmitting ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <CornerDownRight className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>
            </form>
          ) : (
            <div className="p-4 rounded-2xl bg-slate-900/50 border border-white/5 text-center mb-8">
              <p className="text-slate-400 text-sm mb-3">Login to join the conversation and earn XP.</p>
              <div className="flex justify-center gap-3">
                <button onClick={onLoginGoogle} className="px-4 py-2 bg-white text-slate-900 rounded-lg text-sm font-bold">Google</button>
                <button onClick={onLoginGithub} className="px-4 py-2 bg-slate-800 text-white rounded-lg text-sm font-bold">GitHub</button>
              </div>
            </div>
          )}

          {/* List of Replies */}
          <div className="space-y-6">
            {data.replies.map((reply) => (
              <div key={reply.id} className={`relative pl-4 sm:pl-0 ${reply.isBestAnswer ? 'bg-emerald-500/5 -mx-4 px-4 py-4 rounded-2xl border border-emerald-500/10' : ''}`}>
                {reply.isBestAnswer && (
                  <div className="absolute top-2 right-4 flex items-center gap-1 text-emerald-400 text-xs font-bold uppercase tracking-wider">
                    <CheckCircle className="w-3 h-3" /> Best Answer
                  </div>
                )}

                <div className="flex gap-3">
                  <div className="flex flex-col items-center gap-1">
                    <img
                      src={reply.avatar}
                      alt={reply.author}
                      className={`w-8 h-8 rounded-lg object-cover ${reply.isBestAnswer ? 'ring-2 ring-emerald-500/50' : 'bg-slate-800'}`}
                    />
                    {/* Vote buttons could go here */}
                  </div>

                  <div className="flex-1">
                    <div className="flex items-baseline justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <span className={`text-sm font-bold ${reply.isBestAnswer ? 'text-emerald-200' : 'text-slate-300'}`}>
                          {reply.author}
                        </span>
                        <span className="text-xs text-slate-500">{reply.time}</span>
                      </div>

                      {/* Only Author of question can mark best answer */}
                      {session && session.user.id === data.authorId && !data.replies.some(r => r.isBestAnswer) && (
                        <button
                          onClick={() => onMarkBestAnswer(data.id, reply.id, reply.authorId)}
                          className="text-[10px] font-bold text-slate-500 hover:text-emerald-400 transition-colors uppercase tracking-wider border border-slate-800 hover:border-emerald-500/30 px-2 py-1 rounded-full"
                        >
                          Mark as Best
                        </button>
                      )}
                    </div>

                    <p className="text-slate-300 text-sm leading-relaxed">{reply.text}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default QuestionCard;