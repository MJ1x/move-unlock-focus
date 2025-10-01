import { useState, useEffect, useCallback } from 'react';

interface TimerState {
  remainingSeconds: number;
  lastUpdate: number;
  dailyStartingTime: number;
}

const STORAGE_KEY = 'countdown_timer_state';
const LAST_RESET_KEY = 'last_timer_reset';

export function useCountdownTimer(dailyStartingMinutes: number, onTimeExpired: () => void) {
  const [remainingSeconds, setRemainingSeconds] = useState<number>(0);
  const [isActive, setIsActive] = useState(true);

  // Initialize timer from storage or daily limit
  useEffect(() => {
    const initializeTimer = () => {
      const today = new Date().toDateString();
      const lastReset = localStorage.getItem(LAST_RESET_KEY);
      const stored = localStorage.getItem(STORAGE_KEY);

      // Check if it's a new day
      if (lastReset !== today) {
        // Reset to daily starting time
        const initialSeconds = dailyStartingMinutes * 60;
        setRemainingSeconds(initialSeconds);
        localStorage.setItem(LAST_RESET_KEY, today);
        localStorage.setItem(STORAGE_KEY, JSON.stringify({
          remainingSeconds: initialSeconds,
          lastUpdate: Date.now(),
          dailyStartingTime: initialSeconds
        }));
      } else if (stored) {
        // Load from storage
        const state: TimerState = JSON.parse(stored);
        const now = Date.now();
        const elapsedSeconds = Math.floor((now - state.lastUpdate) / 1000);
        const newRemaining = Math.max(0, state.remainingSeconds - elapsedSeconds);
        setRemainingSeconds(newRemaining);
      } else {
        // First time initialization
        const initialSeconds = dailyStartingMinutes * 60;
        setRemainingSeconds(initialSeconds);
        localStorage.setItem(LAST_RESET_KEY, today);
      }
    };

    initializeTimer();

    // Listen for storage changes (when time is added from another component)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY && e.newValue) {
        const state: TimerState = JSON.parse(e.newValue);
        setRemainingSeconds(state.remainingSeconds);
        setIsActive(true); // Resume timer when time is added
      }
    };

    // Also listen for custom event (for same-tab updates)
    const handleTimerUpdate = () => {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const state: TimerState = JSON.parse(stored);
        setRemainingSeconds(state.remainingSeconds);
        setIsActive(true);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('timerUpdate', handleTimerUpdate);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('timerUpdate', handleTimerUpdate);
    };
  }, [dailyStartingMinutes]);

  // Countdown effect - updates every second
  useEffect(() => {
    if (!isActive || remainingSeconds <= 0) return;

    const interval = setInterval(() => {
      setRemainingSeconds(prev => {
        const newValue = Math.max(0, prev - 1);
        
        // Save to storage
        localStorage.setItem(STORAGE_KEY, JSON.stringify({
          remainingSeconds: newValue,
          lastUpdate: Date.now(),
          dailyStartingTime: dailyStartingMinutes * 60
        }));

        // Trigger callback when timer expires
        if (newValue === 0) {
          setIsActive(false);
          onTimeExpired();
        }

        return newValue;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isActive, remainingSeconds, dailyStartingMinutes, onTimeExpired]);

  // Check for midnight reset every minute
  useEffect(() => {
    const checkMidnightReset = () => {
      const today = new Date().toDateString();
      const lastReset = localStorage.getItem(LAST_RESET_KEY);
      
      if (lastReset !== today) {
        const initialSeconds = dailyStartingMinutes * 60;
        setRemainingSeconds(initialSeconds);
        localStorage.setItem(LAST_RESET_KEY, today);
        localStorage.setItem(STORAGE_KEY, JSON.stringify({
          remainingSeconds: initialSeconds,
          lastUpdate: Date.now(),
          dailyStartingTime: initialSeconds
        }));
      }
    };

    const interval = setInterval(checkMidnightReset, 60000);
    return () => clearInterval(interval);
  }, [dailyStartingMinutes]);

  // Add time earned from exercise
  const addEarnedTime = useCallback((minutesEarned: number) => {
    setRemainingSeconds(prev => {
      const newValue = prev + (minutesEarned * 60);
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        remainingSeconds: newValue,
        lastUpdate: Date.now(),
        dailyStartingTime: dailyStartingMinutes * 60
      }));
      return newValue;
    });
    setIsActive(true);
  }, [dailyStartingMinutes]);

  // Pause/Resume timer
  const toggleTimer = useCallback(() => {
    setIsActive(prev => !prev);
  }, []);

  // Format time display
  const formatTime = useCallback(() => {
    const hours = Math.floor(remainingSeconds / 3600);
    const minutes = Math.floor((remainingSeconds % 3600) / 60);
    const seconds = remainingSeconds % 60;
    
    if (hours > 0) {
      return `${hours}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    }
    return `${minutes}:${String(seconds).padStart(2, '0')}`;
  }, [remainingSeconds]);

  const remainingMinutes = Math.floor(remainingSeconds / 60);

  return {
    remainingSeconds,
    remainingMinutes,
    formattedTime: formatTime(),
    isActive,
    addEarnedTime,
    toggleTimer
  };
}
