// Utility functions for managing the countdown timer across the app

const STORAGE_KEY = 'countdown_timer_state';

interface TimerState {
  remainingSeconds: number;
  lastUpdate: number;
  dailyStartingTime: number;
}

/**
 * Add earned time to the timer
 * This can be called from anywhere to update the timer balance
 */
export function addTimeToTimer(minutesEarned: number): void {
  const stored = localStorage.getItem(STORAGE_KEY);
  
  if (stored) {
    const state: TimerState = JSON.parse(stored);
    const newRemainingSeconds = state.remainingSeconds + (minutesEarned * 60);
    
    const updatedState: TimerState = {
      ...state,
      remainingSeconds: newRemainingSeconds,
      lastUpdate: Date.now()
    };
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedState));
    
    // Dispatch custom event to notify timer hook
    window.dispatchEvent(new Event('timerUpdate'));
  }
}

/**
 * Get the current remaining time in minutes
 */
export function getRemainingMinutes(): number {
  const stored = localStorage.getItem(STORAGE_KEY);
  
  if (stored) {
    const state: TimerState = JSON.parse(stored);
    return Math.floor(state.remainingSeconds / 60);
  }
  
  return 0;
}

/**
 * Get the formatted remaining time
 */
export function getFormattedRemainingTime(): string {
  const stored = localStorage.getItem(STORAGE_KEY);
  
  if (stored) {
    const state: TimerState = JSON.parse(stored);
    const hours = Math.floor(state.remainingSeconds / 3600);
    const minutes = Math.floor((state.remainingSeconds % 3600) / 60);
    const seconds = state.remainingSeconds % 60;
    
    if (hours > 0) {
      return `${hours}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    }
    return `${minutes}:${String(seconds).padStart(2, '0')}`;
  }
  
  return '0:00';
}
