import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    console.error("Missing Supabase Environment Variables!");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// --- Storage Utilities ---

export const uploadAvatar = async (file, userId) => {
  const fileExt = file.name.split('.').pop();
  const fileName = `${userId}/avatar.${fileExt}`;
  
  const { data, error } = await supabase.storage
    .from('avatars')
    .upload(fileName, file, {
      cacheControl: '3600',
      upsert: true
    });

  if (error) throw error;

  const { data: { publicUrl } } = supabase.storage
    .from('avatars')
    .getPublicUrl(fileName);

  return publicUrl;
};

export const uploadAttachment = async (file, questionId) => {
  const fileExt = file.name.split('.').pop();
  const fileName = `${questionId}/${Date.now()}.${fileExt}`;
  
  const { data, error } = await supabase.storage
    .from('attachments')
    .upload(fileName, file, {
      cacheControl: '3600'
    });

  if (error) throw error;

  const { data: { publicUrl } } = supabase.storage
    .from('attachments')
    .getPublicUrl(fileName);

  return {
    url: publicUrl,
    name: file.name,
    size: file.size,
    type: file.type
  };
};

export const deleteFile = async (bucket, path) => {
  const { error } = await supabase.storage
    .from(bucket)
    .remove([path]);

  if (error) throw error;
};

// --- Profile Management ---

export const updateProfile = async (userId, updates) => {
  const { data, error } = await supabase
    .from('profiles')
    .upsert({
      id: userId,
      ...updates,
      updated_at: new Date().toISOString()
    })
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const getProfile = async (userId) => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (error && error.code !== 'PGRST116') {
    throw error;
  }

  return data;
};

export const searchProfiles = async (query) => {
  const { data, error } = await supabase
    .from('profiles')
    .select('id, username, full_name, avatar_url, xp, reputation')
    .or(`username.ilike.%${query}%,full_name.ilike.%${query}%`)
    .limit(10);

  if (error) throw error;
  return data;
};

// --- Notifications ---

export const createNotification = async (userId, type, content, relatedId = null) => {
  const { data, error } = await supabase
    .from('notifications')
    .insert({
      user_id: userId,
      type,
      content,
      related_id: relatedId,
      read: false
    })
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const getNotifications = async (userId, limit = 20) => {
  const { data, error } = await supabase
    .from('notifications')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) throw error;
  return data;
};

export const markNotificationRead = async (notificationId) => {
  const { error } = await supabase
    .from('notifications')
    .update({ read: true })
    .eq('id', notificationId);

  if (error) throw error;
};

export const getUnreadNotificationCount = async (userId) => {
  const { count, error } = await supabase
    .from('notifications')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)
    .eq('read', false);

  if (error) throw error;
  return count;
};

// --- Leaderboard ---

export const getLeaderboard = async (limit = 50, timeframe = 'all') => {
  let query = supabase
    .from('profiles')
    .select('id, username, full_name, avatar_url, xp, reputation, created_at')
    .order('xp', { ascending: false })
    .limit(limit);

  if (timeframe === 'monthly') {
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);
    
    query = query.gte('created_at', startOfMonth.toISOString());
  } else if (timeframe === 'weekly') {
    const startOfWeek = new Date();
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
    startOfWeek.setHours(0, 0, 0, 0);
    
    query = query.gte('created_at', startOfWeek.toISOString());
  }

  const { data, error } = await query;
  
  if (error) throw error;
  return data;
};

// --- XP System ---

export const awardXP = async (userId, amount, reason, relatedId = null) => {
  // Update user's XP
  const { error: updateError } = await supabase.rpc('award_xp', {
    user_id: userId,
    xp_amount: amount
  });

  if (updateError) throw updateError;

  // Create XP transaction record
  const { error: transactionError } = await supabase
    .from('xp_transactions')
    .insert({
      user_id: userId,
      amount,
      reason,
      related_id: relatedId
    });

  if (transactionError) throw transactionError;

  // Create notification
  await createNotification(
    userId,
    'xp_awarded',
    `You earned ${amount} XP for ${reason}`,
    relatedId
  );
};

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
