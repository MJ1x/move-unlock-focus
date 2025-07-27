import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, Play, Pause, RotateCcw, Camera, CheckCircle } from "lucide-react";
import { useCamera } from "@/hooks/useCamera";
import { ExerciseDetector, PoseResults } from "@/utils/poseDetection";

interface Exercise {
  id: string;
  name: string;
  icon: string;
  targetReps: number;
  timePerRep: number;
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
    targetReps: 15,
    timePerRep: 2,
    description: "Keep your body straight and push up from the ground"
  },
  {
    id: "squats", 
    name: "Squats",
    icon: "🦵",
    targetReps: 20,
    timePerRep: 1.5,
    description: "Squat down and stand back up, keeping your back straight"
  },
  {
    id: "jumping",
    name: "Jumping Jacks",
    icon: "🤸",
    targetReps: 25,
    timePerRep: 1,
    description: "Jump with arms and legs apart, then back together"
  }
];

export default function ExerciseScreen({ onBack, onComplete }: ExerciseScreenProps) {
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
  const [currentReps, setCurrentReps] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [cameraActive, setCameraActive] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [poseResults, setPoseResults] = useState<PoseResults | null>(null);
  
  const { videoRef, isStreaming, error, startCamera, stopCamera } = useCamera();
  const detectorRef = useRef<ExerciseDetector | null>(null);

  const handleStartExercise = (exercise: Exercise) => {
    setSelectedExercise(exercise);
    setCurrentReps(0);
    setIsActive(false);
    setCameraActive(false);
    setShowSuccess(false);
  };

  const handleStartCamera = async () => {
    setCameraActive(true);
    setIsActive(true);
    await startCamera();
    
    // Initialize pose detection after camera starts
    if (videoRef.current && selectedExercise) {
      const exerciseType = selectedExercise.id as 'pushups' | 'squats' | 'jumping';
      detectorRef.current = new ExerciseDetector(
        videoRef.current,
        (results) => setPoseResults(results),
        exerciseType
      );
      
      detectorRef.current.setOnRepDetected(() => {
        handleRep();
      });
      
      // Start detection after a small delay to ensure video is ready
      setTimeout(() => {
        detectorRef.current?.start();
      }, 1000);
    }
  };

  const handleRep = () => {
    if (selectedExercise && currentReps < selectedExercise.targetReps) {
      const newReps = currentReps + 1;
      setCurrentReps(newReps);
      
      if (newReps >= selectedExercise.targetReps) {
        setIsActive(false);
        setCameraActive(false);
        setShowSuccess(true);
        
        // Calculate time earned: each rep gives 2 minutes
        const timeEarned = newReps * selectedExercise.timePerRep;
        setTimeout(() => {
          onComplete(timeEarned);
        }, 2000);
      }
    }
  };

  const resetExercise = () => {
    setCurrentReps(0);
    setIsActive(false);
    setCameraActive(false);
    setShowSuccess(false);
    stopCamera();
    detectorRef.current?.stop();
    detectorRef.current?.resetCount();
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopCamera();
      detectorRef.current?.stop();
    };
  }, [stopCamera]);

  const progress = selectedExercise ? (currentReps / selectedExercise.targetReps) * 100 : 0;

  if (showSuccess) {
    const timeEarned = selectedExercise!.targetReps * selectedExercise!.timePerRep;
    return (
      <div className="min-h-screen bg-gradient-success flex items-center justify-center p-6">
        <Card className="w-full max-w-md p-8 text-center bg-white/95">
          <div className="space-y-6">
            <div className="w-20 h-20 mx-auto bg-gradient-success rounded-full flex items-center justify-center">
              <CheckCircle className="w-10 h-10 text-success-foreground" />
            </div>
            
            <div>
              <h1 className="text-2xl font-bold text-success">Exercise Complete!</h1>
              <p className="text-muted-foreground mt-2">Great job on those {selectedExercise?.name}!</p>
            </div>

            <div className="bg-success/10 rounded-lg p-4">
              <h2 className="text-3xl font-bold text-success">{Math.round(timeEarned)} minutes</h2>
              <p className="text-sm text-muted-foreground">Screen time earned</p>
            </div>

            <Button variant="success" onClick={() => onComplete(timeEarned)} className="w-full">
              Unlock Apps
            </Button>
          </div>
        </Card>
      </div>
    );
  }

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

          {/* Progress */}
          <Card className="p-6 mb-6">
            <div className="space-y-4">
              <div className="text-center">
                <div className="text-4xl font-bold text-primary">
                  {currentReps} / {selectedExercise.targetReps}
                </div>
                <p className="text-sm text-muted-foreground">Repetitions</p>
              </div>
              
              <Progress value={progress} className="h-3" />
              
              <div className="text-center text-sm text-muted-foreground">
                Earn {selectedExercise.timePerRep} min per rep
              </div>
            </div>
          </Card>

          {/* Camera Section */}
          <Card className="p-6 mb-6">
            <div className="space-y-4">
              <div className="aspect-video bg-muted rounded-lg flex items-center justify-center relative overflow-hidden">
                {cameraActive && isStreaming ? (
                  <video
                    ref={videoRef}
                    className="w-full h-full object-cover rounded-lg"
                    autoPlay
                    playsInline
                    muted
                  />
                ) : cameraActive ? (
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-success/20 flex items-center justify-center">
                    <div className="text-center">
                      <Camera className="w-12 h-12 text-primary mx-auto mb-2" />
                      <p className="text-sm">Starting Camera...</p>
                      <div className="mt-4 flex justify-center">
                        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center">
                    <Camera className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">Camera will verify your reps</p>
                    {error && (
                      <p className="text-xs text-destructive mt-2">{error}</p>
                    )}
                  </div>
                )}
                
                {/* Pose detection overlay */}
                {isStreaming && poseResults?.landmarks && (
                  <div className="absolute top-2 right-2 bg-success/90 text-success-foreground px-2 py-1 rounded text-xs">
                    AI Tracking Active
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
                  <Button variant="secondary" onClick={() => {
                    setIsActive(false); 
                    setCameraActive(false);
                    stopCamera();
                    detectorRef.current?.stop();
                  }} className="flex-1">
                    <Pause className="w-4 h-4 mr-2" />
                    Stop
                  </Button>
                )}
                
                <Button variant="outline" size="icon" onClick={resetExercise}>
                  <RotateCcw className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </Card>

          {/* AI Detection Status */}
          {isActive && (
            <Card className="p-4">
              <div className="text-center space-y-4">
                <div className="flex items-center justify-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${isStreaming && poseResults?.landmarks ? 'bg-success animate-pulse' : 'bg-muted'}`} />
                  <p className="text-sm text-muted-foreground">
                    {isStreaming && poseResults?.landmarks 
                      ? 'AI is tracking your movements' 
                      : 'Position yourself in camera view'
                    }
                  </p>
                </div>
                
                {/* Fallback manual counter for testing */}
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handleRep}
                  disabled={currentReps >= selectedExercise.targetReps}
                  className="text-xs"
                >
                  Manual Count (for testing)
                </Button>
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
            <p className="text-sm text-muted-foreground">Complete exercises to earn screen time</p>
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
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span>{exercise.targetReps} reps</span>
                    <span>•</span>
                    <span>Earn {exercise.targetReps * exercise.timePerRep} min</span>
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
              The camera uses AI to verify your form and count reps automatically
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}