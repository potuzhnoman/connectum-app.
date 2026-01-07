import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { supabase, fetchQuestionsService, addReplyService, markBestAnswerService } from '../api';
import { useSearch } from '../contexts';
import StartScreen from '../components/StartScreen';
import QuestionCard from '../components/QuestionCard';

const Home = () => {
    const { openAskModal, openProfile, showStatusToast, session, loginWithGithub, loginWithGoogle, awardXP } = useOutletContext();
    const { searchQuery } = useSearch();

    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(true);

    // --- Data Fetching ---
    const fetchQuestions = async (showLoading = true) => {
        try {
            if (showLoading) setLoading(true);
            const data = await fetchQuestionsService();
            setQuestions(data);
        } catch (error) {
            showStatusToast(error.message || 'Failed to fetch questions', 'error');
        } finally {
            if (showLoading) setLoading(false);
        }
    };

    // --- Realtime Subscription ---
    useEffect(() => {
        // Initial Fetch
        fetchQuestions();

        const channel = supabase
            .channel('public:questions')
            .on(
                'postgres_changes',
                { event: '*', schema: 'public', table: 'questions' },
                () => fetchQuestions(false)
            )
            .on(
                'postgres_changes',
                { event: '*', schema: 'public', table: 'replies' },
                () => fetchQuestions(false)
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, []);

    // Derived State: Filtered Questions
    const filteredQuestions = searchQuery.trim() === ''
        ? questions
        : questions.filter(q =>
            q.questionOriginal.toLowerCase().includes(searchQuery.toLowerCase()) ||
            q.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            q.category?.toLowerCase().includes(searchQuery.toLowerCase())
        );

    const handleResultClick = (result) => {
        const questionElement = document.getElementById(`question-${result.id}`);
        if (questionElement) {
            questionElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
            questionElement.classList.add('ring-2', 'ring-cyan-400', 'ring-offset-2', 'ring-offset-slate-950');
            setTimeout(() => {
                questionElement.classList.remove('ring-2', 'ring-cyan-400', 'ring-offset-2', 'ring-offset-slate-950');
            }, 2000);
        }
    };

    // Pass this down to QuestionCard
    const handleSubmitAnswer = async (questionId, text) => {
        // Allow anonymous answers for testing
        // if (!session) return alert("Please login first."); // Todo: nice toast

        const replyPayload = {
            question_id: questionId,
            text: text,
            author_name: session?.user?.user_metadata?.full_name || session?.user?.email || 'Anonymous',
            author_id: session?.user?.id || 'anonymous_' + Date.now(),
            avatar: session?.user?.user_metadata?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=Anonymous`
        };

        try {
            await addReplyService(replyPayload);
            showStatusToast("Answer posted", 'success');

            // Award XP for posting answer (only if logged in)
            if (session) {
                await awardXP(10, 'Posted answer');
            }

            // Reload questions to show new answer
            await fetchQuestions();
        } catch (error) {
            showStatusToast(error.message || "Failed to post answer", 'error');
        }
    };

    // markBestAnswer implementation
    const handleMarkBestAnswer = async (questionId, replyId, replyAuthorId) => {
        if (!session) {
            showStatusToast("Please login first", "error");
            return;
        }

        try {
            await markBestAnswerService(replyId);
            showStatusToast("Best answer selected!", 'success');

            // Award XP to the answer author
            await awardXP(25, 'Answer marked as best');
        } catch (error) {
            showStatusToast(error.message || "Failed to mark best answer", 'error');
        }
    };

    return (
        <>
            <StartScreen
                onOpenModal={openAskModal}
                supabase={supabase}
                onSearch={(query) => {
                  // Можно добавить глобальный поиск
                  console.log('Global search:', query);
                }}
                onResultClick={handleResultClick}
            />

            <section id="questions-section" className="py-24 px-6 relative z-10">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-5xl h-full bg-cyan-900/10 blur-[100px] -z-10 rounded-full mix-blend-screen" />
                <div className="max-w-3xl mx-auto">
                    <div className="text-center mb-16 animate-fade-in">
                        <h2 className="text-3xl font-bold text-white mb-3">Live Questions</h2>
                        <p className="text-slate-400">Real-time knowledge exchange happening right now.</p>
                    </div>

                    {loading ? (
                        <div className="flex justify-center"><Loader2 className="animate-spin text-cyan-500" /></div>
                    ) : (
                        <div className="space-y-6">
                            {filteredQuestions.map(q => (
                                <QuestionCard
                                    key={q.id}
                                    id={`question-${q.id}`}
                                    data={q}
                                    onSubmitAnswer={handleSubmitAnswer}
                                    onMarkBestAnswer={handleMarkBestAnswer}
                                    session={session}
                                    onLoginGithub={loginWithGithub}
                                    onLoginGoogle={loginWithGoogle}
                                    onUserClick={openProfile} // passed from context
                                    supabase={supabase}
                                    onErrorToast={showStatusToast}
                                />
                            ))}
                            {filteredQuestions.length === 0 && !loading && (
                                <div className="text-center py-20 bg-slate-900/40 rounded-3xl border border-white/5">
                                    <p className="text-slate-500">No questions match your search.</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </section>
        </>
    );
};

export default Home;
