import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Play, Pause, RotateCcw, Camera, CheckCircle, Coins, Settings } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useUserSettings } from "@/hooks/useUserSettings";

interface Exercise {
  id: string;
  name: string;
  icon: string;
  description: string;
}

interface ExerciseScreenProps {
  onBack: () => void;
  onComplete: (timeEarned: number) => void;
}

const exercises: Exercise[] = [
  {
    id: "pushups",
    name: "Push-ups",
    icon: "💪",
    description: "Keep your body straight and push up from the ground"
  },
  {
    id: "squats", 
    name: "Squats",
    icon: "🦵",
    description: "Squat down and stand back up, keeping your back straight"
  },
  {
    id: "jumping",
    name: "Jumping Jacks",
    icon: "🤸",
    description: "Jump with arms and legs apart, then back together"
  }
];

export default function ExerciseScreen({ onBack, onComplete }: ExerciseScreenProps) {
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
  const [currentReps, setCurrentReps] = useState(0);
  const [totalTimeEarned, setTotalTimeEarned] = useState(0);
  const [minutesPerRep, setMinutesPerRep] = useState(2);
  const [isActive, setIsActive] = useState(false);
  const [cameraActive, setCameraActive] = useState(false);
  const [showRepFeedback, setShowRepFeedback] = useState(false);
  const { toast } = useToast();
  const { settings } = useUserSettings();
  
  const MIN_REPS = 5;

  // Initialize minutes per rep from user settings
  useEffect(() => {
    if (settings?.minutes_per_exercise_rep) {
      setMinutesPerRep(settings.minutes_per_exercise_rep);
    }
  }, [settings]);

  const handleStartExercise = (exercise: Exercise) => {
    setSelectedExercise(exercise);
    setCurrentReps(0);
    setTotalTimeEarned(0);
    setIsActive(false);
    setCameraActive(false);
    setShowRepFeedback(false);
  };

  const handleStartCamera = () => {
    setCameraActive(true);
    setIsActive(true);
  };

  const handleRep = () => {
    if (selectedExercise) {
      const newReps = currentReps + 1;
      
      setCurrentReps(newReps);
      
      // Show immediate feedback
      setShowRepFeedback(true);
      setTimeout(() => setShowRepFeedback(false), 1000);
      
      // Only calculate time earned after 5 reps, but don't give it yet
      if (newReps >= MIN_REPS) {
        const newTimeEarned = newReps * minutesPerRep;
        setTotalTimeEarned(newTimeEarned);
      }
    }
  };
  
  const handleFinishWorkout = async () => {
    if (currentReps >= MIN_REPS) {
      const finalTimeEarned = currentReps * minutesPerRep;
      
      try {
        // Get authenticated user
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        
        if (authError || !user) {
          toast({
            title: "Session not saved",
            description: "Please sign in to save your exercise progress",
            variant: "destructive"
          });
          onComplete(finalTimeEarned);
          return;
        }

        // Save exercise session to database
        const { error: insertError } = await supabase
          .from('exercise_session')
          .insert({
            user_id: user.id,
            exercise_type: selectedExercise?.name || 'Unknown',
            reps_completed: currentReps,
            time_earned: finalTimeEarned,
            session_date: new Date().toISOString()
          } as any);

        if (insertError) {
          console.error('Error saving exercise session:', insertError);
          toast({
            title: "Session not saved",
            description: "Your time was earned but session wasn't saved to history",
            variant: "destructive"
          });
        } else {
          toast({
            title: "Workout Complete! 🎉",
            description: `You earned ${finalTimeEarned} minutes of screen time!`,
          });
        }

        onComplete(finalTimeEarned);
      } catch (error) {
        console.error('Unexpected error:', error);
        toast({
          title: "Error",
          description: "Something went wrong saving your workout",
          variant: "destructive"
        });
        onComplete(finalTimeEarned);
      }
    }
  };
  
  const handleCancelSession = () => {
    resetExercise();
    setSelectedExercise(null);
  };

  const resetExercise = () => {
    setCurrentReps(0);
    setTotalTimeEarned(0);
    setIsActive(false);
    setCameraActive(false);
    setShowRepFeedback(false);
  };


  if (selectedExercise) {
    return (
      <div className="min-h-screen bg-background p-4">
        <div className="max-w-md mx-auto">
          {/* Header */}
          <div className="flex items-center gap-4 mb-6">
            <Button variant="ghost" size="icon" onClick={() => setSelectedExercise(null)}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="flex-1">
              <h1 className="text-xl font-bold flex items-center gap-2">
                <span className="text-2xl">{selectedExercise.icon}</span>
                {selectedExercise.name}
              </h1>
              <p className="text-sm text-muted-foreground">{selectedExercise.description}</p>
            </div>
          </div>

          {/* Earnings Rate Setting */}
          <Card className="p-4 mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Settings className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-medium">Earning Rate</span>
              </div>
              <Select value={minutesPerRep.toString()} onValueChange={(value) => setMinutesPerRep(Number(value))}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 min/rep</SelectItem>
                  <SelectItem value="2">2 min/rep</SelectItem>
                  <SelectItem value="3">3 min/rep</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </Card>

          {/* Progress Display */}
          <Card className="p-6 mb-6 relative overflow-hidden">
            {showRepFeedback && (
              <div className="absolute inset-0 bg-primary/20 flex items-center justify-center z-10 animate-pulse">
                <div className="text-center">
                  <CheckCircle className="w-8 h-8 text-primary mx-auto mb-1" />
                  <p className="text-sm font-bold text-primary">Rep counted!</p>
                </div>
              </div>
            )}
            <div className="space-y-4">
              <div className="text-center">
                <div className={`text-4xl font-bold ${currentReps >= MIN_REPS ? 'text-success' : 'text-muted-foreground'}`}>
                  {currentReps >= MIN_REPS ? totalTimeEarned : 0}
                </div>
                <p className="text-sm text-muted-foreground">Minutes Will Be Earned</p>
              </div>
              
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Reps completed:</span>
                <span className="font-medium">
                  {currentReps}/{MIN_REPS} minimum
                </span>
              </div>
              
              <div className="text-center">
                {currentReps < MIN_REPS ? (
                  <p className="text-sm text-warning animate-fade-in">
                    Complete {MIN_REPS - currentReps} more reps to start earning time
                  </p>
                ) : (
                  <div className="animate-scale-in">
                    <p className="text-sm text-success font-medium">
                      🎉 Minimum reached! Earning {minutesPerRep} minutes per rep
                    </p>
                  </div>
                )}
              </div>
            </div>
          </Card>

          {/* Camera Section */}
          <Card className="p-6 mb-6">
            <div className="space-y-4">
              <div className="aspect-video bg-muted rounded-lg flex items-center justify-center relative overflow-hidden">
                {cameraActive ? (
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-success/20 flex items-center justify-center">
                    <div className="text-center">
                      <Camera className="w-12 h-12 text-primary mx-auto mb-2" />
                      <p className="text-sm">Camera Active - AI Counting Reps</p>
                      <div className="mt-4 flex justify-center">
                        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center">
                    <Camera className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">Camera will verify your reps</p>
                  </div>
                )}
              </div>
              
              <div className="flex gap-2">
                {!isActive ? (
                  <Button variant="success" onClick={handleStartCamera} className="flex-1">
                    <Play className="w-4 h-4 mr-2" />
                    Start Exercise
                  </Button>
                ) : (
                  <Button variant="secondary" onClick={() => {setIsActive(false); setCameraActive(false);}} className="flex-1">
                    <Pause className="w-4 h-4 mr-2" />
                    Pause
                  </Button>
                )}
                
                <Button variant="outline" size="icon" onClick={resetExercise}>
                  <RotateCcw className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </Card>

          {/* Manual Counter and Actions */}
          {isActive && (
            <Card className="p-4">
              <div className="text-center space-y-4">
                <p className="text-sm text-muted-foreground">Demo: Tap to simulate AI detection</p>
                <Button 
                  variant="energy" 
                  size="lg"
                  onClick={handleRep}
                  className="w-full"
                >
                  Count Rep {currentReps >= MIN_REPS && `(+${minutesPerRep} min)`}
                </Button>
                
                <div className="flex gap-2">
                  {currentReps < MIN_REPS ? (
                    <Button 
                      variant="outline" 
                      onClick={handleCancelSession}
                      className="w-full"
                    >
                      Cancel Session
                    </Button>
                  ) : (
                    <Button 
                      variant="success" 
                      onClick={handleFinishWorkout}
                      className="w-full animate-scale-in"
                    >
                      Finish Workout
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Choose Exercise</h1>
            <p className="text-sm text-muted-foreground">Start exercising to earn screen time instantly</p>
          </div>
        </div>

        {/* Exercise Options */}
        <div className="space-y-4">
          {exercises.map((exercise) => (
            <Card 
              key={exercise.id}
              className="p-6 cursor-pointer hover:border-primary/50 transition-all duration-200"
              onClick={() => handleStartExercise(exercise)}
            >
              <div className="flex items-center gap-4">
                <div className="text-4xl">{exercise.icon}</div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold">{exercise.name}</h3>
                  <p className="text-sm text-muted-foreground mb-2">{exercise.description}</p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Coins className="w-3 h-3" />
                    <span>Earn instantly per rep</span>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        <Card className="mt-6 p-4 bg-primary/5 border-primary/20">
          <div className="text-center">
            <p className="text-sm font-medium text-primary">💡 Pro Tip</p>
            <p className="text-xs text-muted-foreground mt-1">
              Complete at least 5 reps to start earning screen time!
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}