import React, { useState, useEffect } from 'react';
import { useParams, useOutletContext, Link } from 'react-router-dom';
import { fetchQuestionByIdService, addReplyService, markBestAnswerService } from '../services/questions';
import QuestionCard from '../components/QuestionCard';
import { Loader2, ArrowLeft } from 'lucide-react';

const QuestionPage = () => {
    const { id } = useParams();
    const { openProfile, showStatusToast, session, loginWithGithub, loginWithGoogle, supabase, awardXP } = useOutletContext();

    const [question, setQuestion] = useState(null);
    const [loading, setLoading] = useState(true);

    const loadQuestion = async () => {
        try {
            setLoading(true);
            const data = await fetchQuestionByIdService(id);
            setQuestion(data);
        } catch (error) {
            console.error(error);
            showStatusToast("Failed to load question", "error");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (id) loadQuestion();

        // Subscription for single question updates
        const channel = supabase
            .channel(`question:${id}`)
            .on('postgres_changes', { event: '*', schema: 'public', table: 'replies', filter: `question_id=eq.${id}` },
                () => loadQuestion()) // Reload on new replies
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [id]);

    const handleSubmitAnswer = async (questionId, text) => {
        if (!session) return alert("Please login first.");

        const replyPayload = {
            question_id: questionId,
            text: text,
            author_name: session.user.user_metadata.full_name || session.user.email,
            author_id: session.user.id,
            avatar: session.user.user_metadata.avatar_url
        };

        try {
            await addReplyService(replyPayload);
            showStatusToast("Answer posted", 'success');

            // Award XP for posting answer
            await awardXP(10, 'Posted answer');
        } catch (error) {
            showStatusToast(error.message || "Failed to post answer", 'error');
        }
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin text-cyan-500" /></div>;

    if (!question) return <div className="text-center text-slate-400 py-20">Question not found.</div>;

    return (
        <div className="max-w-3xl mx-auto py-24 px-6">
            <Link to="/" className="inline-flex items-center text-slate-400 hover:text-white mb-8 transition-colors">
                <ArrowLeft className="w-4 h-4 mr-2" /> Back to Feed
            </Link>

            <QuestionCard
                id={`question-${question.id}`}
                data={question}
                onSubmitAnswer={handleSubmitAnswer}
                onMarkBestAnswer={async (questionId, replyId, replyAuthorId) => {
                    if (!session) return alert("Please login first.");

                    try {
                        await markBestAnswerService(replyId);
                        showStatusToast("Best answer selected!", 'success');

                        // Award XP to the answer author
                        await awardXP(25, 'Answer marked as best');
                    } catch (error) {
                        showStatusToast(error.message || "Failed to mark best answer", 'error');
                    }
                }}
                session={session}
                onLoginGithub={loginWithGithub}
                onLoginGoogle={loginWithGoogle}
                onUserClick={openProfile}
                supabase={supabase}
                onErrorToast={showStatusToast}
                defaultExpanded={true} // Always expand comments on detail page!
            />
        </div>
    );
};

export default QuestionPage;
