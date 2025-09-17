import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { 
  Settings, 
  Bell, 
  Moon, 
  Volume2, 
  Smartphone,
  Shield,
  User,
  HelpCircle,
  LogOut,
  ChevronRight
} from "lucide-react";

export default function SettingsScreen() {
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [sounds, setSounds] = useState(true);
  const [appBlocking, setAppBlocking] = useState(true);

  const settingSections = [
    {
      title: "Preferences",
      items: [
        {
          icon: Bell,
          label: "Notifications",
          description: "Exercise reminders and achievements",
          control: <Switch checked={notifications} onCheckedChange={setNotifications} />
        },
        {
          icon: Moon,
          label: "Dark Mode",
          description: "Switch to dark theme",
          control: <Switch checked={darkMode} onCheckedChange={setDarkMode} />
        },
        {
          icon: Volume2,
          label: "Sound Effects",
          description: "Audio feedback for actions",
          control: <Switch checked={sounds} onCheckedChange={setSounds} />
        }
      ]
    },
    {
      title: "App Control",
      items: [
        {
          icon: Shield,
          label: "App Blocking",
          description: "Enable/disable app restrictions",
          control: <Switch checked={appBlocking} onCheckedChange={setAppBlocking} />
        },
        {
          icon: Smartphone,
          label: "Block Settings",
          description: "Configure blocking behavior",
          control: <ChevronRight className="w-4 h-4 text-muted-foreground" />
        }
      ]
    },
    {
      title: "Account",
      items: [
        {
          icon: User,
          label: "Profile Settings",
          description: "Update your personal information",
          control: <ChevronRight className="w-4 h-4 text-muted-foreground" />
        },
        {
          icon: HelpCircle,
          label: "Help & Support",
          description: "Get help or contact us",
          control: <ChevronRight className="w-4 h-4 text-muted-foreground" />
        }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-md mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
            <Settings className="w-6 h-6 text-primary" />
          </div>
          <h1 className="text-2xl font-bold">Settings</h1>
          <p className="text-sm text-muted-foreground">Customize your app experience</p>
        </div>

        {/* Settings Sections */}
        {settingSections.map((section, sectionIndex) => (
          <Card key={section.title} className="p-4">
            <div className="space-y-4">
              <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
                {section.title}
              </h3>
              
              <div className="space-y-1">
                {section.items.map((item, itemIndex) => (
                  <div 
                    key={item.label} 
                    className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-muted/50 rounded-lg flex items-center justify-center">
                        <item.icon className="w-4 h-4 text-muted-foreground" />
                      </div>
                      <div>
                        <h4 className="font-medium">{item.label}</h4>
                        <p className="text-xs text-muted-foreground">{item.description}</p>
                      </div>
                    </div>
                    {item.control}
                  </div>
                ))}
              </div>
            </div>
          </Card>
        ))}

        {/* App Info */}
        <Card className="p-4">
          <div className="space-y-4">
            <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
              About
            </h3>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm">Version</span>
                <Badge variant="secondary">1.0.0</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Build</span>
                <span className="text-xs text-muted-foreground">2024.1.1</span>
              </div>
            </div>
          </div>
        </Card>

        {/* Danger Zone */}
        <Card className="p-4 border-destructive/20">
          <div className="space-y-4">
            <h3 className="font-semibold text-sm text-destructive uppercase tracking-wide">
              Danger Zone
            </h3>
            
            <Button 
              variant="outline" 
              className="w-full border-destructive/50 text-destructive hover:bg-destructive/10"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </Card>

        {/* Footer */}
        <div className="text-center py-4">
          <p className="text-xs text-muted-foreground">
            Made with ❤️ for your digital wellness
          </p>
        </div>
      </div>
    </div>
  );
}