import { supabase } from './supabase';

export const getFlagAndCountry = (language) => {
    switch (language) {
        case 'Ukrainian': return { flag: '🇺🇦', country: 'UA' };
        case 'Japanese': return { flag: '🇯🇵', country: 'JP' };
        case 'Spanish': return { flag: '🇪🇸', country: 'ES' };
        case 'German': return { flag: '🇩🇪', country: 'DE' };
        case 'French': return { flag: '🇫🇷', country: 'FR' };
        case 'Chinese': return { flag: '🇨🇳', country: 'CN' };
        default: return { flag: '🇺🇸', country: 'US' };
    }
};

export const formatTimeAgo = (dateString) => {
    if (!dateString) return 'Just now';
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now - date) / 1000);
    if (seconds < 60) return 'Just now';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
};

export const fetchQuestionsService = async () => {
    const { data, error } = await supabase
        .from('questions')
        .select('*, replies(*)')
        .order('created_at', { ascending: false, foreignTable: 'replies' })
        .order('created_at', { ascending: false });

    if (error) throw error;

    return data.map(q => {
        const { flag, country } = getFlagAndCountry(q.language);
        return {
            id: q.id,
            authorId: q.author_id,
            name: q.author_name || 'Anonymous',
            country: country,
            flag: flag,
            language: q.language,
            avatarUrl: q.author_avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${q.author_name}`,
            timeAgo: formatTimeAgo(q.created_at),
            questionOriginal: q.text,
            questionTranslated: null,
            xp: q.xp_reward || 0,
            comments: q.replies ? q.replies.length : 0,
            replies: q.replies ? q.replies
                .map(r => ({
                    id: r.id,
                    authorId: r.author_id,
                    author: r.author_name,
                    text: r.text,
                    time: formatTimeAgo(r.created_at),
                    avatar: r.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${r.author_name}`,
                    isBestAnswer: r.is_best_answer || false
                }))
                .sort((a, b) => b.isBestAnswer - a.isBestAnswer)
                : [],
            isNew: false
        };
    });
};

export const fetchQuestionByIdService = async (id) => {
    const { data, error } = await supabase
        .from('questions')
        .select('*, replies(*)')
        .eq('id', id)
        .order('created_at', { ascending: false, foreignTable: 'replies' })
        .single();

    if (error) throw error;

    const { flag, country } = getFlagAndCountry(data.language);

    return {
        id: data.id,
        authorId: data.author_id,
        name: data.author_name || 'Anonymous',
        country: country,
        flag: flag,
        language: data.language,
        avatarUrl: data.author_avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${data.author_name}`,
        timeAgo: formatTimeAgo(data.created_at),
        questionOriginal: data.text,
        questionTranslated: null,
        xp: data.xp_reward || 0,
        comments: data.replies ? data.replies.length : 0,
        replies: data.replies ? data.replies
            .map(r => ({
                id: r.id,
                authorId: r.author_id,
                author: r.author_name,
                text: r.text,
                time: formatTimeAgo(r.created_at),
                avatar: r.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${r.author_name}`,
                isBestAnswer: r.is_best_answer || false
            }))
            .sort((a, b) => b.isBestAnswer - a.isBestAnswer)
            : [],
        isNew: false
    };
};

export const addQuestionService = async (questionData) => {
    const { data, error } = await supabase.from('questions').insert([questionData]).select();
    if (error) throw error;
    return data;
};

export const addReplyService = async (replyData) => {
    const { data, error } = await supabase.from('replies').insert([replyData]).select();
    if (error) throw error;
    return data;
};
