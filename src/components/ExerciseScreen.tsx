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
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-lg mx-auto">
          {/* Minimal Header */}
          <div className="flex items-center gap-4 mb-8">
            <Button variant="ghost" size="icon" onClick={() => setSelectedExercise(null)}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="flex-1">
              <h1 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                <span className="text-lg">{selectedExercise.icon}</span>
                {selectedExercise.name}
              </h1>
            </div>
          </div>

          {/* Earnings Rate - Minimal */}
          <Card className="p-5 mb-6 border">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Rate</span>
              <Select value={minutesPerRep.toString()} onValueChange={(value) => setMinutesPerRep(Number(value))}>
                <SelectTrigger className="w-28 h-9">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 min</SelectItem>
                  <SelectItem value="2">2 min</SelectItem>
                  <SelectItem value="3">3 min</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </Card>

          {/* Clean Progress Display */}
          <Card className="p-8 mb-6 relative overflow-hidden border-2">
            {showRepFeedback && (
              <div className="absolute inset-0 bg-primary/10 flex items-center justify-center z-10">
                <CheckCircle className="w-12 h-12 text-primary animate-scale-in" />
              </div>
            )}
            <div className="space-y-6">
              <div className="text-center space-y-2">
                <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  {currentReps >= MIN_REPS ? 'Time Earned' : 'Not Started'}
                </div>
                <div className={`text-6xl font-bold tabular-nums ${currentReps >= MIN_REPS ? 'text-primary' : 'text-muted-foreground'}`}>
                  {currentReps >= MIN_REPS ? totalTimeEarned : 0}
                </div>
                <p className="text-sm text-muted-foreground">minutes</p>
              </div>
              
              <div className="flex items-center justify-between text-sm pt-4 border-t">
                <span className="text-muted-foreground uppercase tracking-wider text-xs font-semibold">Reps</span>
                <span className="font-bold text-lg tabular-nums">
                  {currentReps}<span className="text-muted-foreground">/{MIN_REPS}</span>
                </span>
              </div>
              
              {currentReps < MIN_REPS && (
                <p className="text-xs text-center text-muted-foreground pt-2">
                  {MIN_REPS - currentReps} more to start earning
                </p>
              )}
            </div>
          </Card>

          {/* Minimal Camera Section */}
          <Card className="p-6 mb-6 border-2">
            <div className="space-y-4">
              <div className="aspect-video bg-muted rounded-lg flex items-center justify-center relative overflow-hidden border">
                {cameraActive ? (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center space-y-4">
                      <div className="w-16 h-16 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
                      <p className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Tracking</p>
                    </div>
                  </div>
                ) : (
                  <div className="text-center">
                    <Camera className="w-10 h-10 text-muted-foreground mx-auto mb-2" />
                    <p className="text-xs text-muted-foreground uppercase tracking-wider">Camera Ready</p>
                  </div>
                )}
              </div>
              
              <div className="flex gap-2">
                {!isActive ? (
                  <Button onClick={handleStartCamera} className="flex-1" size="lg">
                    <Play className="w-4 h-4 mr-2" />
                    Start
                  </Button>
                ) : (
                  <Button variant="outline" onClick={() => {setIsActive(false); setCameraActive(false);}} className="flex-1">
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

          {/* Clean Manual Counter */}
          {isActive && (
            <div className="space-y-3">
              <Card className="p-5 border">
                <p className="text-xs text-center text-muted-foreground uppercase tracking-wider mb-3">
                  Demo Mode
                </p>
                <Button 
                  size="lg"
                  onClick={handleRep}
                  className="w-full"
                >
                  Count Rep {currentReps >= MIN_REPS && `(+${minutesPerRep} min)`}
                </Button>
              </Card>
              
              {currentReps < MIN_REPS ? (
                <Button 
                  variant="outline" 
                  onClick={handleCancelSession}
                  className="w-full"
                >
                  Cancel
                </Button>
              ) : (
                <Button 
                  onClick={handleFinishWorkout}
                  size="lg"
                  className="w-full"
                >
                  Finish Workout
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-lg mx-auto">
        {/* Minimal Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Choose Exercise</h1>
          </div>
        </div>

        {/* Clean Exercise Options */}
        <div className="space-y-3">
          {exercises.map((exercise) => (
            <Card 
              key={exercise.id}
              className="p-6 cursor-pointer border-2 hover:border-primary transition-all duration-200"
              onClick={() => handleStartExercise(exercise)}
            >
              <div className="flex items-center gap-4">
                <div className="text-3xl">{exercise.icon}</div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold">{exercise.name}</h3>
                  <p className="text-sm text-muted-foreground">{exercise.description}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>

        <Card className="mt-6 p-5 border">
          <div className="text-center">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Note</p>
            <p className="text-sm text-foreground">
              Complete at least 5 reps to start earning screen time
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}