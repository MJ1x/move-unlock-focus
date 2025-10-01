import { useState, useEffect } from "react";
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
import { useUserSettings } from "@/hooks/useUserSettings";
import { addTimeToTimer } from "@/lib/timerUtils";

type Screen = "launch" | "video" | "signup" | "pricing" | "goal-setting" | "reminder-frequency" | "exercise-rewards" | "welcome" | "app-selection" | "exercise" | "main-app";

const Index = () => {
  const [currentScreen, setCurrentScreen] = useState<Screen>("launch");
  const [selectedApps, setSelectedApps] = useState<string[]>([]);
  
  // Questionnaire state
  const [dailyLimit, setDailyLimit] = useState(180); // 3 hours default
  const [reminderFrequency, setReminderFrequency] = useState(15);
  const [exerciseReward, setExerciseReward] = useState(1);
  
  // Load existing user settings
  const { settings, loading } = useUserSettings();
  
  // Update state when settings are loaded
  useEffect(() => {
    if (settings) {
      setDailyLimit(settings.daily_screen_time_limit || 180);
      setReminderFrequency(settings.reminder_frequency_minutes || 15);
      setExerciseReward(settings.minutes_per_exercise_rep || 1);
    }
  }, [settings]);

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

  const handleGoalSettingContinue = (newDailyLimit: number) => {
    setDailyLimit(newDailyLimit);
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
    // Add earned time to the timer
    addTimeToTimer(timeEarned);
    // Return to dashboard
    setCurrentScreen("main-app");
  };
  
  const handleTimeReset = (newTime: number) => {
    // Timer resets are now handled by the timer hook automatically at midnight
    // This function is kept for compatibility but doesn't need to do anything
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
      return <GoalSettingScreen 
        onContinue={handleGoalSettingContinue} 
        onBack={handleGoalSettingBack}
        initialValue={dailyLimit}
      />;

    case "reminder-frequency":
      return <ReminderFrequencyScreen 
        onContinue={handleReminderFrequencyContinue} 
        onBack={handleReminderFrequencyBack}
        initialValue={reminderFrequency}
      />;

    case "exercise-rewards":
      return <ExerciseRewardsScreen 
        onContinue={handleExerciseRewardsContinue} 
        onBack={handleExerciseRewardsBack}
        dailyLimit={dailyLimit}
        reminderFrequency={reminderFrequency}
        initialValue={exerciseReward}
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
          selectedApps={selectedApps}
          onStartExercise={handleStartExercise}
        />
      );
    
    default:
      return <LaunchScreen onContinue={handleLaunchContinue} />;
  }
};

export default Index;
