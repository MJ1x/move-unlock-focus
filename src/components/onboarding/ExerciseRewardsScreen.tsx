import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Dumbbell, Calculator } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface ExerciseRewardsScreenProps {
  onContinue: () => void;
  onBack: () => void;
  dailyLimit: number;
  reminderFrequency: number;
}

export default function ExerciseRewardsScreen({ 
  onContinue, 
  onBack, 
  dailyLimit, 
  reminderFrequency 
}: ExerciseRewardsScreenProps) {
  const [selectedReward, setSelectedReward] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const rewardOptions = [
    { value: 0.5, label: "30 seconds", description: "Quick rewards" },
    { value: 1, label: "1 minute", description: "Balanced motivation" },
    { value: 2, label: "2 minutes", description: "Good incentive" },
    { value: 3, label: "3 minutes", description: "High reward" },
  ];

  const calculateExample = (minutes: number) => {
    const reps = 10;
    const totalMinutes = reps * minutes;
    return `10 pushups = ${totalMinutes} minute${totalMinutes !== 1 ? 's' : ''} of extra time`;
  };

  const handleSavePreferences = async () => {
    setIsLoading(true);
    
    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      
      if (authError || !user) {
        toast({
          title: "Authentication Error",
          description: "Please try signing in again",
          variant: "destructive",
        });
        return;
      }

      // Update user settings with all questionnaire data
      const { error } = await supabase
        .from('user_settings')
        .upsert({
          user_id: user.id,
          daily_screen_time_limit: dailyLimit,
          reminder_frequency_minutes: reminderFrequency,
          minutes_per_exercise_rep: selectedReward,
          minutes_per_rep: selectedReward // Keep old column for compatibility
        });

      if (error) {
        console.error('Error saving preferences:', error);
        toast({
          title: "Failed to save preferences",
          description: error.message || "Please try again",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Preferences saved! 🎯",
        description: "Your personalized experience is ready",
      });

      // Small delay to show success message before continuing
      setTimeout(() => {
        onContinue();
      }, 1000);

    } catch (error) {
      console.error('Unexpected error:', error);
      toast({
        title: "Something went wrong",
        description: "Please check your connection and try again",
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
      
      <div className="w-full max-w-lg space-y-8 text-center">
        {/* Header */}
        <div className="space-y-4">
          <div className="w-20 h-20 mx-auto bg-gradient-primary rounded-2xl flex items-center justify-center shadow-xl shadow-primary/25">
            <Dumbbell className="w-10 h-10 text-primary-foreground" />
          </div>
          
          <h1 className="text-3xl font-bold text-foreground">
            Exercise <span className="text-primary">Rewards</span>
          </h1>
          <p className="text-muted-foreground">
            Additional time earned per exercise rep:
          </p>
        </div>

        {/* Reward Options */}
        <div className="space-y-3">
          {rewardOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => setSelectedReward(option.value)}
              className={`w-full p-4 rounded-xl border-2 transition-all duration-300 text-left ${
                selectedReward === option.value
                  ? "border-primary bg-primary/10 shadow-lg shadow-primary/25"
                  : "border-border bg-card hover:border-primary/50 hover:bg-primary/5"
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-semibold text-foreground">{option.label}</div>
                  <div className="text-sm text-muted-foreground">{option.description}</div>
                </div>
                <div className={`w-4 h-4 rounded-full border-2 ${
                  selectedReward === option.value
                    ? "border-primary bg-primary"
                    : "border-muted-foreground"
                }`}>
                  {selectedReward === option.value && (
                    <div className="w-full h-full rounded-full bg-primary-foreground scale-50" />
                  )}
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Example Calculation */}
        <div className="bg-success/10 border border-success/20 rounded-xl p-4">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Calculator className="w-4 h-4 text-success" />
            <span className="text-success font-semibold text-sm">Example</span>
          </div>
          <p className="text-success/80 text-sm">
            {calculateExample(selectedReward)}
          </p>
        </div>

        {/* CTA */}
        <Button 
          onClick={handleSavePreferences}
          disabled={isLoading}
          className="w-full py-6 text-xl font-bold bg-gradient-primary hover:shadow-lg hover:shadow-primary/25 transition-all duration-300"
          size="lg"
        >
          {isLoading ? "Saving Preferences..." : "Save Preferences"}
        </Button>
      </div>
    </div>
  );
}