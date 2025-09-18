import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { ArrowLeft, Target, Clock, Sparkles } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface GoalSettingScreenProps {
  onContinue: () => void;
  onBack: () => void;
}

export default function GoalSettingScreen({ onContinue, onBack }: GoalSettingScreenProps) {
  const [goalHours, setGoalHours] = useState([3]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const getGoalValue = () => goalHours[0];
  const getGoalMinutes = () => getGoalValue() * 60;

  const formatTime = (hours: number) => {
    if (hours === 1) return "1 hour";
    return `${hours} hours`;
  };

  const handleSetGoal = async () => {
    setIsLoading(true);
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: "Authentication required",
          description: "Please sign in to continue",
          variant: "destructive",
        });
        return;
      }

      const { error } = await supabase
        .from('user_settings')
        .insert({
          user_id: user.id,
          daily_screen_time_limit: getGoalMinutes(),
          minutes_per_rep: 1 // Default value
        } as any);

      if (error) {
        console.error('Error saving goal:', error);
        toast({
          title: "Error saving goal",
          description: "Please try again",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Goal set successfully",
        description: `Your daily screen time goal: ${formatTime(getGoalValue())}`,
      });

      onContinue();
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Something went wrong",
        description: "Please try again",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 relative">
      {/* Back Arrow */}
      <button
        onClick={onBack}
        className="absolute top-6 left-6 w-10 h-10 rounded-full bg-muted/20 backdrop-blur-sm flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/30 transition-all duration-300"
      >
        <ArrowLeft className="w-5 h-5" />
      </button>
      
      <div className="w-full max-w-lg space-y-10 text-center">
        {/* Header */}
        <div className="space-y-4">
          <div className="w-20 h-20 mx-auto bg-gradient-primary rounded-2xl flex items-center justify-center shadow-xl shadow-primary/25">
            <Target className="w-10 h-10 text-primary-foreground" />
          </div>
          
          <h1 className="text-3xl font-bold text-foreground">
            Set Your Daily <span className="text-primary">Screen Time</span> Goal
          </h1>
          <p className="text-muted-foreground">
            Choose your target to start building healthier digital habits
          </p>
        </div>

        {/* Current Usage Mock */}
        <div className="bg-muted/30 rounded-xl p-4 border border-border/50">
          <div className="flex items-center justify-center gap-2 text-muted-foreground">
            <Clock className="w-4 h-4" />
            <span className="text-sm">Your current average: <strong className="text-foreground">6.5 hours/day</strong></span>
          </div>
        </div>

        {/* Goal Slider */}
        <div className="space-y-8 bg-card p-8 rounded-2xl border border-border/50">
          <div className="space-y-6">
            <div className="text-center">
              <div className="text-5xl font-black text-foreground mb-2">
                {formatTime(getGoalValue())}
                <span className="text-lg text-muted-foreground font-normal">/day</span>
              </div>
              <p className="text-sm text-muted-foreground">
                {getGoalMinutes()} minutes daily limit
              </p>
            </div>

            <div className="px-4">
              <Slider
                value={goalHours}
                onValueChange={setGoalHours}
                max={8}
                min={1}
                step={0.5}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-muted-foreground mt-2">
                <span>1h</span>
                <span>8h</span>
              </div>
            </div>
          </div>

          {/* Motivational Text */}
          <div className="bg-success/10 border border-success/20 rounded-xl p-4">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Sparkles className="w-4 h-4 text-success" />
              <span className="text-success font-semibold text-sm">Recommended</span>
            </div>
            <p className="text-success/80 text-sm">
              2-3 hours daily for better focus and mental well-being
            </p>
          </div>
        </div>

        {/* CTA */}
        <Button 
          onClick={handleSetGoal}
          disabled={isLoading}
          className="w-full py-6 text-xl font-bold bg-gradient-primary hover:shadow-lg hover:shadow-primary/25 transition-all duration-300"
          size="lg"
        >
          {isLoading ? "Setting Goal..." : "Set My Goal"}
        </Button>

        <p className="text-xs text-muted-foreground">
          You can adjust this goal anytime in your settings
        </p>
      </div>
    </div>
  );
}