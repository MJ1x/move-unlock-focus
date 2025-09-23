import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface UserSettings {
  daily_screen_time_limit: number;
  reminder_frequency_minutes: number;
  minutes_per_exercise_rep: number;
}

interface UseUserSettingsReturn {
  settings: UserSettings | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useUserSettings(): UseUserSettingsReturn {
  const [settings, setSettings] = useState<UserSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data: { user }, error: authError } = await supabase.auth.getUser();
      
      if (authError || !user) {
        setSettings(null);
        return;
      }

      const { data, error: fetchError } = await supabase
        .from('user_settings')
        .select('daily_screen_time_limit, reminder_frequency_minutes, minutes_per_exercise_rep')
        .eq('user_id', user.id)
        .maybeSingle();

      if (fetchError) {
        console.error('Error fetching user settings:', fetchError);
        setError(fetchError.message);
        return;
      }

      setSettings(data);
    } catch (err) {
      console.error('Unexpected error fetching settings:', err);
      setError('Failed to load settings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  return {
    settings,
    loading,
    error,
    refetch: fetchSettings
  };
}