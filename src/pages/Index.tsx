import { useState } from "react";
import LaunchScreen from "@/components/onboarding/LaunchScreen";
import VideoScreen from "@/components/onboarding/VideoScreen";
import CommitmentScreen from "@/components/onboarding/CommitmentScreen";
import PricingScreen from "@/components/onboarding/PricingScreen";
import WelcomeScreen from "@/components/WelcomeScreen";
import AppSelectionScreen from "@/components/AppSelectionScreen";
import ExerciseScreen from "@/components/ExerciseScreen";
import DashboardScreen from "@/components/DashboardScreen";

type Screen = "launch" | "video" | "commitment" | "pricing" | "welcome" | "app-selection" | "exercise" | "dashboard";

const Index = () => {
  const [currentScreen, setCurrentScreen] = useState<Screen>("launch");
  const [selectedApps, setSelectedApps] = useState<string[]>([]);
  const [earnedTime, setEarnedTime] = useState(0);

  const handleLaunchContinue = () => {
    setCurrentScreen("video");
  };

  const handleVideoContinue = () => {
    setCurrentScreen("commitment");
  };

  const handleVideoBack = () => {
    setCurrentScreen("launch");
  };

  const handleCommit = () => {
    setCurrentScreen("pricing");
  };

  const handleCommitmentBack = () => {
    setCurrentScreen("video");
  };

  const handlePricingBack = () => {
    setCurrentScreen("commitment");
  };

  const handleDeleteApp = () => {
    // In a real app, this would close/uninstall the app
    alert("Thanks for trying Time Is Limited!");
  };

  const handleStartTrial = () => {
    setCurrentScreen("welcome");
  };

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
    case "launch":
      return <LaunchScreen onContinue={handleLaunchContinue} />;
    
    case "video":
      return <VideoScreen onContinue={handleVideoContinue} onBack={handleVideoBack} />;
    
    case "commitment":
      return <CommitmentScreen onCommit={handleCommit} onDeleteApp={handleDeleteApp} onBack={handleCommitmentBack} />;
    
    case "pricing":
      return <PricingScreen onStartTrial={handleStartTrial} onBack={handlePricingBack} />;

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
      return <LaunchScreen onContinue={handleLaunchContinue} />;
  }
};

export default Index;
