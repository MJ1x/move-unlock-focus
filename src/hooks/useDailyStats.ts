import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { startOfDay, endOfDay, subDays, isAfter, isBefore } from 'date-fns';

interface DailyStats {
  repsToday: number;
  exerciseTimeToday: number;
  dayStreak: number;
  timeUsed: number;
  loading: boolean;
  error: string | null;
}

export function useDailyStats(dailyLimitMinutes: number) {
  const [stats, setStats] = useState<DailyStats>({
    repsToday: 0,
    exerciseTimeToday: 0,
    dayStreak: 0,
    timeUsed: 0,
    loading: true,
    error: null
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        
        if (authError || !user) {
          setStats(prev => ({ ...prev, loading: false }));
          return;
        }

        // Get today's date range
        const today = new Date();
        const todayStart = startOfDay(today);
        const todayEnd = endOfDay(today);

        // Fetch today's exercise sessions
        const { data: todaySessions, error: sessionsError } = await supabase
          .from('exercise_session')
          .select('reps_completed, time_earned, session_date')
          .eq('user_id', user.id)
          .gte('session_date', todayStart.toISOString())
          .lte('session_date', todayEnd.toISOString());

        if (sessionsError) {
          throw sessionsError;
        }

        // Calculate today's stats
        const repsToday = todaySessions?.reduce((sum, session) => sum + (session.reps_completed || 0), 0) || 0;
        const exerciseTimeToday = todaySessions?.reduce((sum, session) => sum + (session.time_earned || 0), 0) || 0;

        // Calculate day streak
        const { data: allSessions, error: allSessionsError } = await supabase
          .from('exercise_session')
          .select('session_date')
          .eq('user_id', user.id)
          .order('session_date', { ascending: false });

        if (allSessionsError) {
          throw allSessionsError;
        }

        let streak = 0;
        let checkDate = new Date();
        
        if (allSessions && allSessions.length > 0) {
          // Group sessions by date
          const sessionsByDate = new Map<string, boolean>();
          allSessions.forEach(session => {
            const dateKey = new Date(session.session_date).toDateString();
            sessionsByDate.set(dateKey, true);
          });

          // Count consecutive days
          while (sessionsByDate.has(checkDate.toDateString())) {
            streak++;
            checkDate = subDays(checkDate, 1);
          }
        }

        // Calculate time used (daily limit - remaining time from localStorage)
        const storedTimer = localStorage.getItem('countdown_timer_state');
        let timeUsed = 0;
        
        if (storedTimer) {
          const timerState = JSON.parse(storedTimer);
          const remainingMinutes = Math.floor(timerState.remainingSeconds / 60);
          timeUsed = Math.max(0, dailyLimitMinutes - remainingMinutes);
        }

        setStats({
          repsToday,
          exerciseTimeToday,
          dayStreak: streak,
          timeUsed,
          loading: false,
          error: null
        });

      } catch (err: any) {
        console.error('Error fetching daily stats:', err);
        setStats(prev => ({
          ...prev,
          loading: false,
          error: err.message || 'Failed to load stats'
        }));
      }
    };

    fetchStats();

    // Refresh stats every minute
    const interval = setInterval(fetchStats, 60000);
    return () => clearInterval(interval);
  }, [dailyLimitMinutes]);

  return stats;
}
