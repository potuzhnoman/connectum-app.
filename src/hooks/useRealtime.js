import { useEffect, useState } from 'react';
import { supabase } from '../api';

export const useRealtimeSubscription = (table, event = '*', filter = '*', callback) => {
  const [subscription, setSubscription] = useState(null);

  useEffect(() => {
    const channel = supabase
      .channel(`realtime-${table}`)
      .on(
        'postgres_changes',
        { 
          event, 
          schema: 'public', 
          table, 
          filter 
        },
        (payload) => {
          if (callback) {
            callback(payload);
          }
        }
      )
      .subscribe();

    setSubscription(channel);

    return () => {
      if (subscription) {
        supabase.removeChannel(subscription);
      }
    };
  }, [table, event, filter, callback]);

  return subscription;
};

export const useQuestionsRealtime = (onQuestionChange, onReplyChange) => {
  useRealtimeSubscription(
    'questions',
    '*',
    '*',
    (payload) => {
      if (onQuestionChange) {
        onQuestionChange(payload);
      }
    }
  );

  useRealtimeSubscription(
    'replies',
    '*',
    '*',
    (payload) => {
      if (onReplyChange) {
        onReplyChange(payload);
      }
    }
  );
};

export const usePresence = (userId, username) => {
  const [onlineUsers, setOnlineUsers] = useState(new Set());

  useEffect(() => {
    if (!userId) return;

    const channel = supabase.channel('online-users', {
      config: {
        presence: {
          key: userId,
        },
      },
    });

    channel
      .on('presence', { event: 'sync' }, () => {
        const newState = channel.presenceState();
        const users = new Set();
        
        Object.values(newState).forEach(presences => {
          presences.forEach(presence => {
            if (presence.user_id !== userId) {
              users.add(presence.username);
            }
          });
        });
        
        setOnlineUsers(users);
      })
      .on('presence', { event: 'join' }, ({ key, newPresences }) => {
        console.log('User joined:', newPresences);
      })
      .on('presence', { event: 'leave' }, ({ key, leftPresences }) => {
        console.log('User left:', leftPresences);
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          await channel.track({
            user_id: userId,
            username: username,
            online_at: new Date().toISOString(),
          });
        }
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId, username]);

  return { onlineUsers: Array.from(onlineUsers) };
};
