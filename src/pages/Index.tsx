import { useState } from "react";
import LaunchScreen from "@/components/onboarding/LaunchScreen";
import VideoScreen from "@/components/onboarding/VideoScreen";
import SignUpScreen from "@/components/onboarding/SignUpScreen";
import CommitmentScreen from "@/components/onboarding/CommitmentScreen";
import PricingScreen from "@/components/onboarding/PricingScreen";
import GoalSettingScreen from "@/components/onboarding/GoalSettingScreen";
import ReminderFrequencyScreen from "@/components/onboarding/ReminderFrequencyScreen";
import ExerciseRewardsScreen from "@/components/onboarding/ExerciseRewardsScreen";
import WelcomeScreen from "@/components/WelcomeScreen";
import AppSelectionScreen from "@/components/AppSelectionScreen";
import ExerciseScreen from "@/components/ExerciseScreen";
import MainAppLayout from "@/components/MainAppLayout";

type Screen = "launch" | "video" | "signup" | "pricing" | "goal-setting" | "reminder-frequency" | "exercise-rewards" | "welcome" | "app-selection" | "exercise" | "main-app";

const Index = () => {
  const [currentScreen, setCurrentScreen] = useState<Screen>("launch");
  const [selectedApps, setSelectedApps] = useState<string[]>([]);
  const [earnedTime, setEarnedTime] = useState(0);
  
  // Questionnaire state
  const [dailyLimit, setDailyLimit] = useState(180); // 3 hours default
  const [reminderFrequency, setReminderFrequency] = useState(15);

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
    setCurrentScreen("goal-setting");
  };

  const handleGoalSettingContinue = () => {
    setCurrentScreen("reminder-frequency");
  };

  const handleGoalSettingBack = () => {
    setCurrentScreen("pricing");
  };
  
  const handleReminderFrequencyContinue = (frequency: number) => {
    setReminderFrequency(frequency);
    setCurrentScreen("exercise-rewards");
  };

  const handleReminderFrequencyBack = () => {
    setCurrentScreen("goal-setting");
  };
  
  const handleExerciseRewardsContinue = () => {
    setCurrentScreen("welcome");
  };

  const handleExerciseRewardsBack = () => {
    setCurrentScreen("reminder-frequency");
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

  const handleRepComplete = (timeEarned: number) => {
    setEarnedTime(prevTime => prevTime + timeEarned); // Add to existing balance
    setCurrentScreen("main-app"); // Return to dashboard after completing exercise
  };
  
  const handleTimeReset = (newTime: number) => {
    setEarnedTime(newTime);
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

    case "goal-setting":
      return <GoalSettingScreen onContinue={handleGoalSettingContinue} onBack={handleGoalSettingBack} />;

    case "reminder-frequency":
      return <ReminderFrequencyScreen onContinue={handleReminderFrequencyContinue} onBack={handleReminderFrequencyBack} />;

    case "exercise-rewards":
      return <ExerciseRewardsScreen 
        onContinue={handleExerciseRewardsContinue} 
        onBack={handleExerciseRewardsBack}
        dailyLimit={dailyLimit}
        reminderFrequency={reminderFrequency}
      />;

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
          onTimeReset={handleTimeReset}
        />
      );
    
    default:
      return <LaunchScreen onContinue={handleLaunchContinue} />;
  }
};

export default Index;
