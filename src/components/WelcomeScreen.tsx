import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Smartphone, Dumbbell, Target, Trophy } from "lucide-react";

interface WelcomeScreenProps {
  onGetStarted: () => void;
}

export default function WelcomeScreen({ onGetStarted }: WelcomeScreenProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-md space-y-8 text-center">
        {/* Hero Icon */}
        <div className="relative">
          <div className="w-24 h-24 mx-auto bg-gradient-primary rounded-full flex items-center justify-center shadow-primary">
            <Dumbbell className="w-12 h-12 text-primary-foreground" />
          </div>
          <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-energy rounded-full flex items-center justify-center">
            <Smartphone className="w-4 h-4 text-energy-foreground" />
          </div>
        </div>

        {/* Title */}
        <div className="space-y-3">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
            Perfect!
          </h1>
          <p className="text-xl text-muted-foreground">
            Your preferences are set. Now let's select which apps to <span className="text-primary font-semibold">time-limit</span>
          </p>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 gap-4">
          <Card className="p-4 border-primary/20 bg-gradient-to-r from-primary/5 to-transparent">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                <Target className="w-5 h-5 text-primary" />
              </div>
              <div className="text-left">
                <h3 className="font-semibold text-sm">Block Distracting Apps</h3>
                <p className="text-xs text-muted-foreground">Choose which apps to limit</p>
              </div>
            </div>
          </Card>

          <Card className="p-4 border-success/20 bg-gradient-to-r from-success/5 to-transparent">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-success/10 rounded-lg flex items-center justify-center">
                <Dumbbell className="w-5 h-5 text-success" />
              </div>
              <div className="text-left">
                <h3 className="font-semibold text-sm">Exercise to Unlock</h3>
                <p className="text-xs text-muted-foreground">Earn screen time with workouts</p>
              </div>
            </div>
          </Card>

          <Card className="p-4 border-energy/20 bg-gradient-to-r from-energy/5 to-transparent">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-energy/10 rounded-lg flex items-center justify-center">
                <Trophy className="w-5 h-5 text-energy" />
              </div>
              <div className="text-left">
                <h3 className="font-semibold text-sm">Track Progress</h3>
                <p className="text-xs text-muted-foreground">Build healthy habits daily</p>
              </div>
            </div>
          </Card>
        </div>

        {/* CTA */}
        <div className="space-y-4">
          <Button 
            variant="hero" 
            onClick={onGetStarted}
            className="w-full"
          >
            Choose Apps to Limit
          </Button>
          <p className="text-xs text-muted-foreground">
            Only selected apps will use your daily time allowance
          </p>
        </div>
      </div>
    </div>
  );
}