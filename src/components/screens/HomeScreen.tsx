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
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-md mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold">Your Dashboard</h1>
          <p className="text-sm text-muted-foreground">Track your digital wellness journey</p>
        </div>

        {/* Timer Section */}
        <Card className="p-6 bg-gradient-to-br from-primary/10 to-primary-glow/5 border-primary/20">
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center gap-2">
              <Timer className="w-5 h-5 text-primary" />
              <h2 className="text-lg font-semibold">Screen Time Today</h2>
            </div>
            
            <div className="space-y-3">
              <div className="text-4xl font-bold text-primary">
                {formattedTime}
              </div>
              
              <div className="text-sm text-muted-foreground">
                Time remaining of {formatMinutes(dailyGoal)} daily limit
              </div>
              
              <Progress value={Math.max(0, (remainingMinutes / dailyGoal) * 100)} className="h-2" />
              
              {remainingMinutes > 0 ? (
                <div className="flex justify-center">
                  <Button variant="secondary" onClick={toggleTimer} size="sm">
                    <Clock className="w-4 h-4 mr-2" />
                    {isActive ? 'Pause Timer' : 'Resume Timer'}
                  </Button>
                </div>
              ) : (
                <div className="text-center">
                  <p className="text-sm text-muted-foreground mb-3">
                    No time remaining. Exercise to unlock!
                  </p>
                  <Button size="sm" onClick={onStartExercise} className="bg-gradient-energy">
                    <Dumbbell className="w-4 h-4 mr-2" />
                    Start Exercise
                  </Button>
                </div>
              )}
            </div>
          </div>
        </Card>

        {/* Daily Stats */}
        <div className="grid grid-cols-2 gap-4">
          <Card className="p-4 text-center">
            <div className="space-y-2">
              <Target className="w-6 h-6 text-warning mx-auto" />
              <div className="text-2xl font-bold text-warning">{formatMinutes(timeUsed)}</div>
              <p className="text-xs text-muted-foreground">Time Used</p>
            </div>
          </Card>

          <Card className="p-4 text-center">
            <div className="space-y-2">
              <Dumbbell className="w-6 h-6 text-success mx-auto" />
              <div className="text-2xl font-bold text-success">{formatMinutes(exerciseTimeToday)}</div>
              <p className="text-xs text-muted-foreground">Exercise Time</p>
            </div>
          </Card>

          <Card className="p-4 text-center">
            <div className="space-y-2">
              <TrendingUp className="w-6 h-6 text-primary mx-auto" />
              <div className="text-2xl font-bold text-primary">{repsToday}</div>
              <p className="text-xs text-muted-foreground">Reps Today</p>
            </div>
          </Card>

          <Card className="p-4 text-center">
            <div className="space-y-2">
              <Flame className="w-6 h-6 text-energy mx-auto" />
              <div className="text-2xl font-bold text-energy">{dayStreak}</div>
              <p className="text-xs text-muted-foreground">Day Streak</p>
            </div>
          </Card>
        </div>

        {/* Achievement */}
        <Card className="p-4 bg-gradient-to-r from-success/10 to-transparent border-success/20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-success/10 rounded-full flex items-center justify-center">
              <Trophy className="w-5 h-5 text-success" />
            </div>
            <div>
              <h3 className="font-semibold text-success">Fitness Rookie</h3>
              <p className="text-xs text-muted-foreground">Complete 50 total reps to unlock next badge</p>
              <Progress value={(repsToday / 50) * 100} className="h-1 mt-2" />
            </div>
          </div>
        </Card>

        {/* Quick Actions */}
        <div className="space-y-3">
          <Button 
            onClick={onStartExercise}
            className="w-full bg-gradient-energy text-energy-foreground hover:shadow-energy"
          >
            <Dumbbell className="w-4 h-4 mr-2" />
            Earn More Time
          </Button>
          
          <div className="text-center">
            <p className="text-xs text-muted-foreground">
              Keep going! Every rep counts towards a healthier you 💪
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}