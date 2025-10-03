import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  Timer, 
  Dumbbell, 
  Target, 
  TrendingUp, 
  Clock, 
  Flame,
  Trophy,
  Lock
} from "lucide-react";
import { useCountdownTimer } from "@/hooks/useCountdownTimer";
import { useDailyStats } from "@/hooks/useDailyStats";
import { useUserSettings } from "@/hooks/useUserSettings";

interface HomeScreenProps {
  onStartExercise: () => void;
  selectedApps: string[];
  onTimeEarned?: (minutes: number) => void;
}

export default function HomeScreen({ 
  onStartExercise, 
  selectedApps,
  onTimeEarned
}: HomeScreenProps) {
  const { settings, loading: settingsLoading } = useUserSettings();
  const dailyGoal = settings?.daily_screen_time_limit || 60;
  
  const { remainingMinutes, formattedTime, isActive, toggleTimer } = useCountdownTimer(
    dailyGoal,
    onStartExercise
  );

  const { repsToday, exerciseTimeToday, dayStreak, timeUsed, loading: statsLoading } = useDailyStats(dailyGoal);

  const formatMinutes = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  if (settingsLoading || statsLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-2">
          <Timer className="w-8 h-8 animate-pulse mx-auto text-primary" />
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-lg mx-auto space-y-8">
        {/* Minimal Header */}
        <div className="text-center space-y-1">
          <h1 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Dashboard</h1>
        </div>

        {/* Hero Timer - Maximum Focus */}
        <Card className="p-8 border-2 border-border">
          <div className="text-center space-y-6">
            <div className="space-y-2">
              <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Time Remaining
              </div>
              <div className="text-7xl font-bold tracking-tight text-foreground tabular-nums">
                {formattedTime}
              </div>
              <div className="text-sm text-muted-foreground">
                of {formatMinutes(dailyGoal)} daily limit
              </div>
            </div>
            
            <Progress value={Math.max(0, (remainingMinutes / dailyGoal) * 100)} className="h-1.5" />
            
            {remainingMinutes > 0 ? (
              <Button variant="outline" onClick={toggleTimer} size="sm">
                {isActive ? 'Pause' : 'Resume'}
              </Button>
            ) : (
              <div className="space-y-3 pt-2">
                <div className="w-12 h-12 mx-auto bg-muted rounded-full flex items-center justify-center">
                  <Lock className="w-6 h-6 text-muted-foreground" />
                </div>
                <p className="text-sm text-muted-foreground">
                  Time's up. Exercise to continue.
                </p>
                <Button onClick={onStartExercise} size="lg" className="w-full">
                  <Dumbbell className="w-4 h-4 mr-2" />
                  Start Exercise
                </Button>
              </div>
            )}
          </div>
        </Card>

        {/* Minimalist Stats Grid */}
        <div className="grid grid-cols-2 gap-3">
          <Card className="p-5 border hover:border-primary/50 transition-colors">
            <div className="space-y-2">
              <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Used</div>
              <div className="text-3xl font-bold tabular-nums">{formatMinutes(timeUsed)}</div>
            </div>
          </Card>

          <Card className="p-5 border hover:border-primary/50 transition-colors">
            <div className="space-y-2">
              <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Earned</div>
              <div className="text-3xl font-bold tabular-nums">{formatMinutes(exerciseTimeToday)}</div>
            </div>
          </Card>

          <Card className="p-5 border hover:border-primary/50 transition-colors">
            <div className="space-y-2">
              <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Reps</div>
              <div className="text-3xl font-bold tabular-nums">{repsToday}</div>
            </div>
          </Card>

          <Card className="p-5 border hover:border-primary/50 transition-colors">
            <div className="space-y-2">
              <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Streak</div>
              <div className="text-3xl font-bold tabular-nums">{dayStreak}</div>
            </div>
          </Card>
        </div>

        {/* Clean CTA */}
        {remainingMinutes > 0 && (
          <Button 
            onClick={onStartExercise}
            size="lg"
            className="w-full"
          >
            <Dumbbell className="w-4 h-4 mr-2" />
            Earn More Time
          </Button>
        )}
      </div>
    </div>
  );
}