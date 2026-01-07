import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    console.error("Missing Supabase Environment Variables!");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// --- Utilities ---

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

// --- Question Service ---

export const fetchQuestionsService = async () => {
    try {
        const { data, error } = await supabase
            .from('questions')
            .select('*, replies(*)')
            .order('created_at', { ascending: false, foreignTable: 'replies' })
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Supabase error:', error);
            throw new Error(`Failed to fetch questions: ${error.message}`);
        }

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
    } catch (error) {
        // Fallback: get from localStorage
        const localQuestions = JSON.parse(localStorage.getItem('local_questions') || '[]');
        return localQuestions.map(q => {
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
                replies: q.replies || [],
                isNew: false
            };
        });
    }
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
    try {
        const { data, error } = await supabase.from('questions').insert([questionData]).select();
        if (error) {
            console.error('Supabase error:', error);
            throw new Error(`Failed to add question: ${error.message}`);
        }
        return data;
    } catch (error) {
        console.warn('Using localStorage fallback for question:', error);
        // Fallback: store in localStorage for testing
        try {
            const questions = JSON.parse(localStorage.getItem('local_questions') || '[]');
            const newQuestion = {
                id: Date.now().toString(),
                ...questionData,
                created_at: new Date().toISOString(),
                replies: []
            };
            questions.unshift(newQuestion);
            localStorage.setItem('local_questions', JSON.stringify(questions));
            return [newQuestion];
        } catch (localError) {
            throw new Error('Failed to save question locally');
        }
    }
};

export const addReplyService = async (replyData) => {
    try {
        const { data, error } = await supabase.from('replies').insert([replyData]).select();
        if (error) throw error;
        return data;
    } catch (error) {
        // Fallback: add reply to localStorage
        const questions = JSON.parse(localStorage.getItem('local_questions') || '[]');
        const questionIndex = questions.findIndex(q => q.id === replyData.question_id);

        if (questionIndex !== -1) {
            const newReply = {
                id: Date.now().toString(),
                ...replyData,
                created_at: new Date().toISOString(),
                is_best_answer: false
            };

            questions[questionIndex].replies = questions[questionIndex].replies || [];
            questions[questionIndex].replies.push(newReply);
            localStorage.setItem('local_questions', JSON.stringify(questions));

            return [newReply];
        }

        throw new Error('Question not found');
    }
};

export const markBestAnswerService = async (replyId) => {
    const { data: replyData } = await supabase
        .from('replies')
        .select('question_id')
        .eq('id', replyId)
        .single();

    if (replyData) {
        await supabase
            .from('replies')
            .update({ is_best_answer: false })
            .eq('question_id', replyData.question_id);
    }

    const { data, error } = await supabase
        .from('replies')
        .update({ is_best_answer: true })
        .eq('id', replyId)
        .select();

    if (error) throw error;
    return data;
};

// --- Translation Service ---

export function getUserLanguage() {
    const browserLang = navigator.language?.split('-')[0]?.toUpperCase();
    const supportedLangs = ['EN', 'DE', 'FR', 'ES', 'IT', 'PT', 'RU', 'JA', 'ZH', 'UK', 'NL', 'PL'];
    return supportedLangs.includes(browserLang) ? browserLang : 'EN';
}

export function getCachedTranslation(text, targetLang) {
    try {
        const CACHE_KEY = 'connectum_translations';
        const cache = JSON.parse(localStorage.getItem(CACHE_KEY) || '{}');
        const cacheKey = `${targetLang}:${text.substring(0, 100)}`;
        return cache[cacheKey] || null;
    } catch (error) {
        return null;
    }
}

export function cacheTranslation(text, targetLang, translation) {
    try {
        const CACHE_KEY = 'connectum_translations';
        const cache = JSON.parse(localStorage.getItem(CACHE_KEY) || '{}');
        const cacheKey = `${targetLang}:${text.substring(0, 100)}`;
        cache[cacheKey] = translation;
        const entries = Object.entries(cache);
        if (entries.length > 100) {
            const newCache = Object.fromEntries(entries.slice(20));
            localStorage.setItem(CACHE_KEY, JSON.stringify(newCache));
        } else {
            localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
        }
    } catch (error) { }
}

export async function translateText(text, targetLang = null) {
    if (!text || text.trim().length === 0) throw new Error('Text is required');
    const lang = targetLang || getUserLanguage();
    const cached = getCachedTranslation(text, lang);
    if (cached) return cached;

    try {
        const response = await fetch('/api/translate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text, targetLang: lang })
        });
        if (!response.ok) throw new Error(`Translation failed: ${response.status}`);
        const data = await response.json();
        const translatedText = data.translatedText;
        if (!translatedText) throw new Error('No translation returned');
        cacheTranslation(text, lang, translatedText);
        return translatedText;
    } catch (error) {
        throw error;
    }
}
