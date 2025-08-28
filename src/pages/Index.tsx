import { useState } from "react";
import WelcomeScreen from "@/components/WelcomeScreen";
import AppSelectionScreen from "@/components/AppSelectionScreen";
import ExerciseScreen from "@/components/ExerciseScreen";
import DashboardScreen from "@/components/DashboardScreen";

type Screen = "welcome" | "app-selection" | "exercise" | "dashboard";

const Index = () => {
  const [currentScreen, setCurrentScreen] = useState<Screen>("welcome");
  const [selectedApps, setSelectedApps] = useState<string[]>([]);
  const [earnedTime, setEarnedTime] = useState(0);

  const handleGetStarted = () => {
    setCurrentScreen("app-selection");
  };

  const handleAppSelection = (apps: string[]) => {
    setSelectedApps(apps);
    setCurrentScreen("dashboard");
  };

  const handleStartExercise = () => {
    setCurrentScreen("exercise");
  };

  const handleRepComplete = (totalTimeEarned: number) => {
    setEarnedTime(totalTimeEarned);
  };

  const handleBackFromApps = () => {
    setCurrentScreen("welcome");
  };

  const handleBackFromExercise = () => {
    setCurrentScreen("dashboard");
  };

  switch (currentScreen) {
    case "welcome":
      return <WelcomeScreen onGetStarted={handleGetStarted} />;
    
    case "app-selection":
      return (
        <AppSelectionScreen 
          onBack={handleBackFromApps}
          onContinue={handleAppSelection}
        />
      );
    
    case "exercise":
      return (
        <ExerciseScreen 
          onBack={handleBackFromExercise}
          onComplete={handleRepComplete}
        />
      );
    
    case "dashboard":
      return (
        <DashboardScreen 
          earnedTime={earnedTime}
          onStartExercise={handleStartExercise}
          selectedApps={selectedApps}
        />
      );
    
    default:
      return <WelcomeScreen onGetStarted={handleGetStarted} />;
  }
};

export default Index;
