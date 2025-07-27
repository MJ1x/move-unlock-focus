import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowLeft, Smartphone, Clock } from "lucide-react";

interface App {
  id: string;
  name: string;
  icon: string;
  category: string;
  timeSpent: string;
}

interface AppSelectionScreenProps {
  onBack: () => void;
  onContinue: (selectedApps: string[]) => void;
}

const mockApps: App[] = [
  { id: "instagram", name: "Instagram", icon: "📸", category: "Social", timeSpent: "2h 34m" },
  { id: "tiktok", name: "TikTok", icon: "🎵", category: "Entertainment", timeSpent: "1h 45m" },
  { id: "youtube", name: "YouTube", icon: "📺", category: "Entertainment", timeSpent: "3h 12m" },
  { id: "twitter", name: "Twitter", icon: "🐦", category: "Social", timeSpent: "1h 23m" },
  { id: "facebook", name: "Facebook", icon: "👥", category: "Social", timeSpent: "45m" },
  { id: "snapchat", name: "Snapchat", icon: "👻", category: "Social", timeSpent: "1h 8m" },
  { id: "games", name: "Mobile Games", icon: "🎮", category: "Games", timeSpent: "2h 15m" },
  { id: "netflix", name: "Netflix", icon: "🎬", category: "Entertainment", timeSpent: "1h 30m" },
];

export default function AppSelectionScreen({ onBack, onContinue }: AppSelectionScreenProps) {
  const [selectedApps, setSelectedApps] = useState<string[]>([]);

  const toggleApp = (appId: string) => {
    setSelectedApps(prev => 
      prev.includes(appId) 
        ? prev.filter(id => id !== appId)
        : [...prev, appId]
    );
  };

  const handleContinue = () => {
    if (selectedApps.length > 0) {
      onContinue(selectedApps);
    }
  };

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Choose Apps to Block</h1>
            <p className="text-sm text-muted-foreground">Select apps you want to limit</p>
          </div>
        </div>

        {/* Stats */}
        <Card className="p-4 mb-6 bg-gradient-to-r from-warning/10 to-transparent border-warning/20">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-warning/10 rounded-full flex items-center justify-center">
              <Clock className="w-6 h-6 text-warning" />
            </div>
            <div>
              <h3 className="font-semibold">Daily Average</h3>
              <p className="text-2xl font-bold text-warning">6h 32m</p>
              <p className="text-xs text-muted-foreground">Screen time yesterday</p>
            </div>
          </div>
        </Card>

        {/* App List */}
        <div className="space-y-3 mb-6">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Smartphone className="w-5 h-5" />
            Your Apps
          </h2>
          
          {mockApps.map((app) => (
            <Card 
              key={app.id} 
              className={`p-4 cursor-pointer transition-all duration-200 ${
                selectedApps.includes(app.id) 
                  ? 'border-primary bg-primary/5 shadow-primary/20' 
                  : 'hover:border-muted-foreground/50'
              }`}
              onClick={() => toggleApp(app.id)}
            >
              <div className="flex items-center gap-4">
                <Checkbox 
                  checked={selectedApps.includes(app.id)}
                  onChange={() => toggleApp(app.id)}
                />
                <div className="text-2xl">{app.icon}</div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold">{app.name}</h3>
                    <span className="text-sm font-mono text-muted-foreground">{app.timeSpent}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{app.category}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Continue Button */}
        <div className="space-y-3">
          <Button 
            variant="default" 
            onClick={handleContinue}
            disabled={selectedApps.length === 0}
            className="w-full"
          >
            Continue with {selectedApps.length} app{selectedApps.length !== 1 ? 's' : ''}
          </Button>
          
          {selectedApps.length === 0 && (
            <p className="text-center text-sm text-muted-foreground">
              Select at least one app to continue
            </p>
          )}
        </div>
      </div>
    </div>
  );
}