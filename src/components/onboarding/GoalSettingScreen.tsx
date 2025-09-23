import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { ArrowLeft, Target, Clock, Sparkles } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface GoalSettingScreenProps {
  onContinue: (dailyLimit: number) => void;
  onBack: () => void;
  initialValue?: number;
}

export default function GoalSettingScreen({ onContinue, onBack, initialValue }: GoalSettingScreenProps) {
  const [goalHours, setGoalHours] = useState([initialValue ? initialValue / 60 : 3]);
  const { toast } = useToast();

  const getGoalValue = () => goalHours[0];
  const getGoalMinutes = () => getGoalValue() * 60;

  const formatTime = (hours: number) => {
    if (hours === 1) return "1 hour";
    return `${hours} hours`;
  };

  const handleContinue = () => {
    onContinue(getGoalMinutes());
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
            Set Your Daily <span className="text-primary">Starting Time</span>
          </h1>
          <p className="text-muted-foreground">
            How much time do you want to start with each day for distracting apps?
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
                max={6}
                min={1}
                step={0.5}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-muted-foreground mt-2">
                <span>1h</span>
                <span>6h</span>
              </div>
            </div>
          </div>

          {/* Explanation */}
          <div className="bg-primary/10 border border-primary/20 rounded-xl p-4 space-y-2">
            <p className="text-primary/80 text-sm">
              You'll get this amount fresh each morning. Exercises will be needed for more screen time.
            </p>
            <p className="text-primary/60 text-xs">
              <strong>Note:</strong> Only selected apps take from your time. Other apps like calls, messages, work apps are never restricted.
            </p>
          </div>
        </div>

        {/* CTA */}
        <Button 
          onClick={handleContinue}
          className="w-full py-6 text-xl font-bold bg-gradient-primary hover:shadow-lg hover:shadow-primary/25 transition-all duration-300"
          size="lg"
        >
          Next
        </Button>

        <p className="text-xs text-muted-foreground">
          You can adjust this goal anytime in your settings
        </p>
      </div>
    </div>
  );
}