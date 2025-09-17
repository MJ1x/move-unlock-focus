import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Home, 
  Shield, 
  TrendingUp, 
  Settings, 
  User 
} from "lucide-react";
import HomeScreen from "./screens/HomeScreen";
import BlockedAppsScreen from "./screens/BlockedAppsScreen";
import ProgressScreen from "./screens/ProgressScreen";
import SettingsScreen from "./screens/SettingsScreen";
import ProfileScreen from "./screens/ProfileScreen";

interface MainAppLayoutProps {
  earnedTime: number;
  selectedApps: string[];
  onStartExercise: () => void;
}

export default function MainAppLayout({ 
  earnedTime, 
  selectedApps, 
  onStartExercise 
}: MainAppLayoutProps) {
  const [activeTab, setActiveTab] = useState("home");

  return (
    <div className="min-h-screen bg-background">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex flex-col h-screen">
        {/* Main Content Area */}
        <div className="flex-1 overflow-auto pb-20">
          <TabsContent value="home" className="m-0 h-full">
            <HomeScreen 
              earnedTime={earnedTime}
              selectedApps={selectedApps}
              onStartExercise={onStartExercise}
            />
          </TabsContent>
          
          <TabsContent value="blocked" className="m-0 h-full">
            <BlockedAppsScreen selectedApps={selectedApps} />
          </TabsContent>
          
          <TabsContent value="progress" className="m-0 h-full">
            <ProgressScreen />
          </TabsContent>
          
          <TabsContent value="settings" className="m-0 h-full">
            <SettingsScreen />
          </TabsContent>
          
          <TabsContent value="profile" className="m-0 h-full">
            <ProfileScreen />
          </TabsContent>
        </div>

        {/* Bottom Tab Navigation */}
        <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border">
          <TabsList className="grid w-full grid-cols-5 h-16 bg-card rounded-none">
            <TabsTrigger 
              value="home" 
              className="flex flex-col items-center gap-1 py-2 data-[state=active]:bg-primary/10 data-[state=active]:text-primary transition-all duration-200"
            >
              <Home className="w-5 h-5" />
              <span className="text-xs font-medium">Home</span>
            </TabsTrigger>
            
            <TabsTrigger 
              value="blocked" 
              className="flex flex-col items-center gap-1 py-2 data-[state=active]:bg-primary/10 data-[state=active]:text-primary transition-all duration-200"
            >
              <Shield className="w-5 h-5" />
              <span className="text-xs font-medium">Blocked</span>
            </TabsTrigger>
            
            <TabsTrigger 
              value="progress" 
              className="flex flex-col items-center gap-1 py-2 data-[state=active]:bg-primary/10 data-[state=active]:text-primary transition-all duration-200"
            >
              <TrendingUp className="w-5 h-5" />
              <span className="text-xs font-medium">Progress</span>
            </TabsTrigger>
            
            <TabsTrigger 
              value="settings" 
              className="flex flex-col items-center gap-1 py-2 data-[state=active]:bg-primary/10 data-[state=active]:text-primary transition-all duration-200"
            >
              <Settings className="w-5 h-5" />
              <span className="text-xs font-medium">Settings</span>
            </TabsTrigger>
            
            <TabsTrigger 
              value="profile" 
              className="flex flex-col items-center gap-1 py-2 data-[state=active]:bg-primary/10 data-[state=active]:text-primary transition-all duration-200"
            >
              <User className="w-5 h-5" />
              <span className="text-xs font-medium">Profile</span>
            </TabsTrigger>
          </TabsList>
        </div>
      </Tabs>
    </div>
  );
}