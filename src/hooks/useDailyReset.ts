import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface DailyResetOptions {
  dailyGoal: number; // in minutes
  onReset?: () => void;
}

export function useDailyReset({ dailyGoal, onReset }: DailyResetOptions) {
  const [lastResetDate, setLastResetDate] = useState<string | null>(null);
  const [timeUntilReset, setTimeUntilReset] = useState<number>(0);

  // Calculate time until next midnight
  const calculateTimeUntilReset = () => {
    const now = new Date();
    const midnight = new Date();
    midnight.setHours(24, 0, 0, 0); // Next midnight
    
    const msUntilReset = midnight.getTime() - now.getTime();
    return Math.floor(msUntilReset / 1000); // Convert to seconds
  };

  // Check if it's a new day and reset if needed
  const checkAndReset = async () => {
    const today = new Date().toDateString();
    
    // Get stored reset date from localStorage (for demo purposes)
    const storedResetDate = localStorage.getItem('lastResetDate');
    
    if (storedResetDate !== today) {
      // It's a new day, perform reset
      localStorage.setItem('lastResetDate', today);
      setLastResetDate(today);
      
      // In a real app, you would:
      // 1. Reset available time to daily goal
      // 2. Preserve exercise stats but refresh time bank
      // 3. Update database records
      
      onReset?.();
    }
  };

  // Update countdown timer
  useEffect(() => {
    const updateCountdown = () => {
      setTimeUntilReset(calculateTimeUntilReset());
    };

    // Update immediately
    updateCountdown();
    
    // Update every second
    const interval = setInterval(updateCountdown, 1000);
    
    return () => clearInterval(interval);
  }, []);

  // Check for daily reset every minute
  useEffect(() => {
    // Check immediately
    checkAndReset();
    
    // Check every minute
    const interval = setInterval(checkAndReset, 60000);
    
    return () => clearInterval(interval);
  }, [onReset]);

  // Format time until reset
  const formatTimeUntilReset = () => {
    const hours = Math.floor(timeUntilReset / 3600);
    const minutes = Math.floor((timeUntilReset % 3600) / 60);
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  return {
    timeUntilReset: formatTimeUntilReset(),
    isNewDay: lastResetDate === new Date().toDateString()
  };
}