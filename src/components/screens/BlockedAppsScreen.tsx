import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Shield, 
  Plus, 
  X, 
  Search,
  Smartphone,
  Lock
} from "lucide-react";

interface BlockedAppsScreenProps {
  selectedApps: string[];
}

export default function BlockedAppsScreen({ selectedApps }: BlockedAppsScreenProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddingApp, setIsAddingApp] = useState(false);

  const popularApps = [
    "Instagram", "TikTok", "Facebook", "Twitter", "YouTube", 
    "Snapchat", "WhatsApp", "Telegram", "Discord", "Reddit"
  ];

  const filteredApps = popularApps.filter(app => 
    app.toLowerCase().includes(searchTerm.toLowerCase()) &&
    !selectedApps.includes(app.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-md mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
            <Shield className="w-6 h-6 text-primary" />
          </div>
          <h1 className="text-2xl font-bold">Blocked Apps</h1>
          <p className="text-sm text-muted-foreground">Manage apps that require exercise to unlock</p>
        </div>

        {/* Current Blocked Apps */}
        <Card className="p-4">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Lock className="w-4 h-4 text-muted-foreground" />
              <h3 className="font-semibold">Currently Blocked</h3>
              <Badge variant="secondary">{selectedApps.length}</Badge>
            </div>
            
            {selectedApps.length > 0 ? (
              <div className="grid gap-2">
                {selectedApps.map((app) => (
                  <div key={app} className="flex items-center justify-between p-2 bg-muted/50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                        <Smartphone className="w-4 h-4 text-primary" />
                      </div>
                      <span className="font-medium capitalize">{app}</span>
                    </div>
                    <Button variant="ghost" size="sm" className="text-destructive">
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Smartphone className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>No apps blocked yet</p>
                <p className="text-xs">Add apps below to start your digital wellness journey</p>
              </div>
            )}
          </div>
        </Card>

        {/* Add New Apps */}
        <Card className="p-4">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Plus className="w-4 h-4 text-primary" />
              <h3 className="font-semibold">Add Apps to Block</h3>
            </div>

            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search for apps..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>

            {/* Popular Apps */}
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-muted-foreground">Popular Apps</h4>
              <div className="grid gap-2">
                {filteredApps.slice(0, 6).map((app) => (
                  <div key={app} className="flex items-center justify-between p-2 border rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                        <Smartphone className="w-4 h-4 text-primary-foreground" />
                      </div>
                      <span className="font-medium">{app}</span>
                    </div>
                    <Button size="sm" variant="outline">
                      <Plus className="w-4 h-4 mr-1" />
                      Add
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            {/* Custom App Input */}
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-muted-foreground">Add Custom App</h4>
              <div className="flex gap-2">
                <Input placeholder="Enter app name..." />
                <Button size="sm">Add</Button>
              </div>
            </div>
          </div>
        </Card>

        {/* Blocking Info */}
        <Card className="p-4 bg-gradient-to-r from-warning/10 to-transparent border-warning/20">
          <div className="space-y-2">
            <h3 className="font-semibold text-warning">How Blocking Works</h3>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Blocked apps require exercise to unlock</li>
              <li>• Each minute of exercise = 2 minutes of app time</li>
              <li>• Timer counts down only when apps are active</li>
              <li>• Build healthy habits through movement</li>
            </ul>
          </div>
        </Card>
      </div>
    </div>
  );
}