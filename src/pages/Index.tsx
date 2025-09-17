import { useState } from "react";
import LaunchScreen from "@/components/onboarding/LaunchScreen";
import VideoScreen from "@/components/onboarding/VideoScreen";
import SignUpScreen from "@/components/onboarding/SignUpScreen";
import CommitmentScreen from "@/components/onboarding/CommitmentScreen";
import PricingScreen from "@/components/onboarding/PricingScreen";
import WelcomeScreen from "@/components/WelcomeScreen";
import AppSelectionScreen from "@/components/AppSelectionScreen";
import ExerciseScreen from "@/components/ExerciseScreen";
import MainAppLayout from "@/components/MainAppLayout";

type Screen = "launch" | "video" | "signup" | "pricing" | "welcome" | "app-selection" | "exercise" | "main-app";

const Index = () => {
  const [currentScreen, setCurrentScreen] = useState<Screen>("launch");
  const [selectedApps, setSelectedApps] = useState<string[]>([]);
  const [earnedTime, setEarnedTime] = useState(0);

  const handleLaunchContinue = () => {
    setCurrentScreen("video");
  };

  const handleVideoContinue = () => {
    setCurrentScreen("signup");
  };

  const handleSignUpContinue = () => {
    setCurrentScreen("pricing");
  };

  const handleSignUpBack = () => {
    setCurrentScreen("video");
  };

  const handleVideoBack = () => {
    setCurrentScreen("launch");
  };

  const handlePricingBack = () => {
    setCurrentScreen("signup");
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
    setCurrentScreen("main-app");
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
    setCurrentScreen("main-app");
  };

  switch (currentScreen) {
    case "launch":
      return <LaunchScreen onContinue={handleLaunchContinue} />;
    
    case "video":
      return <VideoScreen onContinue={handleVideoContinue} onBack={handleVideoBack} />;
    
    case "signup":
      return <SignUpScreen onContinue={handleSignUpContinue} onBack={handleSignUpBack} />;
    
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
    
    case "main-app":
      return (
        <MainAppLayout 
          earnedTime={earnedTime}
          selectedApps={selectedApps}
          onStartExercise={handleStartExercise}
        />
      );
    
    default:
      return <LaunchScreen onContinue={handleLaunchContinue} />;
  }
};

export default Index;
