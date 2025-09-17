import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  User, 
  Crown, 
  Trophy, 
  Target, 
  Calendar,
  Edit,
  Star,
  Flame,
  Award
} from "lucide-react";

export default function ProfileScreen() {
  const userProfile = {
    name: "Alex Chen",
    email: "alex.chen@email.com",
    joinDate: "January 2024",
    level: 7,
    totalReps: 847,
    totalTimeBlocked: 12430, // minutes
    currentStreak: 5,
    longestStreak: 18
  };

  const subscriptionInfo = {
    plan: "Premium",
    status: "Active",
    nextBilling: "February 15, 2024",
    price: "$9.99/month"
  };

  const badges = [
    { name: "Early Adopter", description: "Joined in the first month", icon: "🚀", earned: true },
    { name: "Consistency Pro", description: "7-day streak", icon: "📅", earned: true },
    { name: "Rep Master", description: "500+ total reps", icon: "💪", earned: true },
    { name: "Time Guardian", description: "Blocked 100+ hours", icon: "⏰", earned: true },
    { name: "Streak Legend", description: "30-day streak", icon: "🔥", earned: false },
    { name: "Iron Discipline", description: "1000+ total reps", icon: "🏆", earned: false }
  ];

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    return hours > 0 ? `${hours}h` : `${minutes}m`;
  };

  const levelProgress = ((userProfile.totalReps % 100) / 100) * 100;

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-md mx-auto space-y-6">
        {/* Profile Header */}
        <Card className="p-6">
          <div className="text-center space-y-4">
            <div className="relative">
              <div className="w-20 h-20 bg-gradient-primary rounded-full flex items-center justify-center mx-auto">
                <User className="w-10 h-10 text-primary-foreground" />
              </div>
              <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-warning rounded-full flex items-center justify-center border-2 border-background">
                <Crown className="w-4 h-4 text-warning-foreground" />
              </div>
            </div>
            
            <div>
              <h1 className="text-xl font-bold">{userProfile.name}</h1>
              <p className="text-sm text-muted-foreground">{userProfile.email}</p>
              <div className="flex items-center justify-center gap-2 mt-2">
                <Badge variant="secondary">Level {userProfile.level}</Badge>
                <Badge variant="outline">Member since {userProfile.joinDate}</Badge>
              </div>
            </div>
            
            <Button variant="outline" size="sm">
              <Edit className="w-4 h-4 mr-2" />
              Edit Profile
            </Button>
          </div>
        </Card>

        {/* Level Progress */}
        <Card className="p-4">
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <h3 className="font-semibold">Level Progress</h3>
              <span className="text-sm text-muted-foreground">Level {userProfile.level}</span>
            </div>
            <Progress value={levelProgress} className="h-2" />
            <p className="text-xs text-muted-foreground text-center">
              {100 - (userProfile.totalReps % 100)} more reps to level {userProfile.level + 1}
            </p>
          </div>
        </Card>

        {/* Stats Overview */}
        <Card className="p-4">
          <div className="space-y-4">
            <h3 className="font-semibold">Your Stats</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Trophy className="w-5 h-5 text-primary" />
                </div>
                <div className="text-2xl font-bold text-primary">{userProfile.totalReps}</div>
                <p className="text-xs text-muted-foreground">Total Reps</p>
              </div>
              
              <div className="text-center">
                <div className="w-10 h-10 bg-warning/10 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Target className="w-5 h-5 text-warning" />
                </div>
                <div className="text-2xl font-bold text-warning">{formatTime(userProfile.totalTimeBlocked)}</div>
                <p className="text-xs text-muted-foreground">Time Blocked</p>
              </div>
              
              <div className="text-center">
                <div className="w-10 h-10 bg-energy/10 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Flame className="w-5 h-5 text-energy" />
                </div>
                <div className="text-2xl font-bold text-energy">{userProfile.currentStreak}</div>
                <p className="text-xs text-muted-foreground">Current Streak</p>
              </div>
              
              <div className="text-center">
                <div className="w-10 h-10 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Star className="w-5 h-5 text-success" />
                </div>
                <div className="text-2xl font-bold text-success">{userProfile.longestStreak}</div>
                <p className="text-xs text-muted-foreground">Best Streak</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Subscription */}
        <Card className="p-4 bg-gradient-to-r from-primary/10 to-transparent border-primary/20">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Crown className="w-4 h-4 text-primary" />
              <h3 className="font-semibold">Subscription</h3>
              <Badge className="bg-primary text-primary-foreground">{subscriptionInfo.plan}</Badge>
            </div>
            
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Status</span>
                <span className="text-success font-medium">{subscriptionInfo.status}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Price</span>
                <span>{subscriptionInfo.price}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Next billing</span>
                <span>{subscriptionInfo.nextBilling}</span>
              </div>
            </div>
            
            <Button variant="outline" size="sm" className="w-full">
              Manage Subscription
            </Button>
          </div>
        </Card>

        {/* Badges */}
        <Card className="p-4">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-muted-foreground" />
              <h3 className="font-semibold">Badges</h3>
              <Badge variant="secondary">{badges.filter(b => b.earned).length}/{badges.length}</Badge>
            </div>
            
            <div className="grid grid-cols-3 gap-3">
              {badges.map((badge, index) => (
                <div 
                  key={badge.name}
                  className={`text-center p-3 rounded-lg border ${
                    badge.earned 
                      ? 'bg-success/10 border-success/20' 
                      : 'bg-muted/20 border-muted opacity-50'
                  }`}
                >
                  <div className={`text-2xl mb-1 ${!badge.earned && 'grayscale'}`}>
                    {badge.icon}
                  </div>
                  <h4 className="text-xs font-medium">{badge.name}</h4>
                  <p className="text-xs text-muted-foreground mt-1">{badge.description}</p>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}