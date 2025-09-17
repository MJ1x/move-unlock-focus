import { useState, useEffect } from "react";
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
  Lock,
  Play
} from "lucide-react";

interface HomeScreenProps {
  earnedTime: number;
  onStartExercise: () => void;
  selectedApps: string[];
}

interface DailyStats {
  blockedTime: number;
  exerciseTime: number;
  repsCompleted: number;
  streak: number;
}

export default function HomeScreen({ 
  earnedTime, 
  onStartExercise, 
  selectedApps 
}: HomeScreenProps) {
  const [currentTime, setCurrentTime] = useState(earnedTime);
  const [isTimerActive, setIsTimerActive] = useState(false);

  const dailyStats: DailyStats = {
    blockedTime: 247, // minutes blocked today
    exerciseTime: 18, // minutes exercised
    repsCompleted: 47,
    streak: 5
  };

  // Timer countdown
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isTimerActive && currentTime > 0) {
      interval = setInterval(() => {
        setCurrentTime(prev => {
          if (prev <= 1) {
            setIsTimerActive(false);
            return 0;
          }
          return prev - 1;
        });
      }, 60000); // Count down every minute
    }
    
    return () => clearInterval(interval);
  }, [isTimerActive, currentTime]);

  const handleStartTimer = () => {
    if (currentTime > 0) {
      setIsTimerActive(true);
    }
  };

  const handlePauseTimer = () => {
    setIsTimerActive(false);
  };

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  const timeProgress = (currentTime / (earnedTime || 1)) * 100;

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
              <h2 className="text-lg font-semibold">Available Screen Time</h2>
            </div>
            
            <div className="space-y-3">
              <div className="text-4xl font-bold text-primary">
                {formatTime(Math.max(0, currentTime))}
              </div>
              
              <Progress value={Math.max(0, timeProgress)} className="h-2" />
              
              <div className="flex justify-center gap-2">
                {!isTimerActive ? (
                  <Button 
                    variant="default" 
                    onClick={handleStartTimer}
                    disabled={currentTime === 0}
                  >
                    <Play className="w-4 h-4 mr-2" />
                    Start Using Apps
                  </Button>
                ) : (
                  <Button variant="secondary" onClick={handlePauseTimer}>
                    <Clock className="w-4 h-4 mr-2" />
                    Pause Timer
                  </Button>
                )}
              </div>

              {currentTime === 0 && (
                <div className="text-center">
                  <p className="text-sm text-muted-foreground mb-3">
                    No time remaining. Exercise to unlock!
                  </p>
                  <Button 
                    onClick={onStartExercise}
                    className="bg-gradient-energy text-energy-foreground hover:shadow-energy"
                  >
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
              <div className="text-2xl font-bold text-warning">{formatTime(dailyStats.blockedTime)}</div>
              <p className="text-xs text-muted-foreground">Time Blocked</p>
            </div>
          </Card>

          <Card className="p-4 text-center">
            <div className="space-y-2">
              <Dumbbell className="w-6 h-6 text-success mx-auto" />
              <div className="text-2xl font-bold text-success">{formatTime(dailyStats.exerciseTime)}</div>
              <p className="text-xs text-muted-foreground">Exercise Time</p>
            </div>
          </Card>

          <Card className="p-4 text-center">
            <div className="space-y-2">
              <TrendingUp className="w-6 h-6 text-primary mx-auto" />
              <div className="text-2xl font-bold text-primary">{dailyStats.repsCompleted}</div>
              <p className="text-xs text-muted-foreground">Reps Today</p>
            </div>
          </Card>

          <Card className="p-4 text-center">
            <div className="space-y-2">
              <Flame className="w-6 h-6 text-energy mx-auto" />
              <div className="text-2xl font-bold text-energy">{dailyStats.streak}</div>
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
              <Progress value={(dailyStats.repsCompleted / 50) * 100} className="h-1 mt-2" />
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