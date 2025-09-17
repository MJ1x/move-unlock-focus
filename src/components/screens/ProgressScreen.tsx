import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  TrendingUp, 
  Trophy, 
  Target, 
  Flame, 
  Calendar,
  Clock,
  Dumbbell,
  BarChart3
} from "lucide-react";

export default function ProgressScreen() {
  const weeklyStats = {
    timeBlocked: 1847, // minutes this week
    exerciseTime: 145, // minutes this week
    repsCompleted: 312,
    currentStreak: 5,
    longestStreak: 12
  };

  const dailyData = [
    { day: "Mon", blocked: 267, exercise: 22, reps: 44 },
    { day: "Tue", blocked: 312, exercise: 28, reps: 56 },
    { day: "Wed", blocked: 289, exercise: 18, reps: 36 },
    { day: "Thu", blocked: 156, exercise: 12, reps: 24 },
    { day: "Fri", blocked: 423, exercise: 35, reps: 70 },
    { day: "Sat", blocked: 234, exercise: 18, reps: 36 },
    { day: "Sun", blocked: 166, exercise: 12, reps: 46 }
  ];

  const achievements = [
    { name: "First Steps", description: "Complete your first exercise", unlocked: true, icon: "🏃‍♂️" },
    { name: "Dedicated", description: "Exercise 7 days in a row", unlocked: true, icon: "📅" },
    { name: "Strong Start", description: "Complete 100 total reps", unlocked: true, icon: "💪" },
    { name: "Time Master", description: "Block 10+ hours in a day", unlocked: false, icon: "⏰" },
    { name: "Consistency King", description: "Maintain 30-day streak", unlocked: false, icon: "👑" },
    { name: "Iron Will", description: "Complete 1000 total reps", unlocked: false, icon: "🏆" }
  ];

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-md mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 bg-success/10 rounded-full flex items-center justify-center mx-auto">
            <TrendingUp className="w-6 h-6 text-success" />
          </div>
          <h1 className="text-2xl font-bold">Your Progress</h1>
          <p className="text-sm text-muted-foreground">Track your digital wellness journey</p>
        </div>

        {/* Weekly Overview */}
        <Card className="p-4">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-muted-foreground" />
              <h3 className="font-semibold">This Week</h3>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-warning">{formatTime(weeklyStats.timeBlocked)}</div>
                <p className="text-xs text-muted-foreground">Time Blocked</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-success">{formatTime(weeklyStats.exerciseTime)}</div>
                <p className="text-xs text-muted-foreground">Exercise Time</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">{weeklyStats.repsCompleted}</div>
                <p className="text-xs text-muted-foreground">Total Reps</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-energy">{weeklyStats.currentStreak}</div>
                <p className="text-xs text-muted-foreground">Day Streak</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Daily Breakdown */}
        <Card className="p-4">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-muted-foreground" />
              <h3 className="font-semibold">Daily Breakdown</h3>
            </div>
            
            <div className="space-y-3">
              {dailyData.map((day, index) => (
                <div key={day.day} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">{day.day}</span>
                    <div className="flex gap-4 text-xs text-muted-foreground">
                      <span>{formatTime(day.blocked)} blocked</span>
                      <span>{day.reps} reps</span>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <div className="flex-1 bg-muted rounded-full h-2">
                      <div 
                        className="bg-warning rounded-full h-2 transition-all duration-300"
                        style={{ width: `${Math.min((day.blocked / 500) * 100, 100)}%` }}
                      />
                    </div>
                    <div className="flex-1 bg-muted rounded-full h-2">
                      <div 
                        className="bg-success rounded-full h-2 transition-all duration-300"
                        style={{ width: `${Math.min((day.exercise / 60) * 100, 100)}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* Streak Info */}
        <Card className="p-4 bg-gradient-to-r from-energy/10 to-transparent border-energy/20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-energy/10 rounded-full flex items-center justify-center">
              <Flame className="w-5 h-5 text-energy" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-energy">Streak Active</h3>
                <Badge variant="secondary">{weeklyStats.currentStreak} days</Badge>
              </div>
              <p className="text-xs text-muted-foreground">Personal best: {weeklyStats.longestStreak} days</p>
            </div>
          </div>
        </Card>

        {/* Achievements */}
        <Card className="p-4">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Trophy className="w-4 h-4 text-muted-foreground" />
              <h3 className="font-semibold">Achievements</h3>
            </div>
            
            <div className="grid gap-3">
              {achievements.map((achievement, index) => (
                <div 
                  key={achievement.name} 
                  className={`flex items-center gap-3 p-3 rounded-lg border ${
                    achievement.unlocked 
                      ? 'bg-success/10 border-success/20' 
                      : 'bg-muted/20 border-muted'
                  }`}
                >
                  <div className={`text-2xl ${!achievement.unlocked && 'grayscale opacity-50'}`}>
                    {achievement.icon}
                  </div>
                  <div className="flex-1">
                    <h4 className={`font-medium ${achievement.unlocked ? 'text-success' : 'text-muted-foreground'}`}>
                      {achievement.name}
                    </h4>
                    <p className="text-xs text-muted-foreground">{achievement.description}</p>
                  </div>
                  {achievement.unlocked && (
                    <Badge variant="secondary" className="bg-success/20 text-success">
                      Unlocked
                    </Badge>
                  )}
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}