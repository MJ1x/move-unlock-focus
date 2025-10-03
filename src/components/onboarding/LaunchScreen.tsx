import { Button } from "@/components/ui/button";
import { Clock } from "lucide-react";

interface LaunchScreenProps {
  onContinue: () => void;
}

export default function LaunchScreen({ onContinue }: LaunchScreenProps) {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 relative overflow-hidden">
      <div className="relative z-10 w-full max-w-md space-y-16 text-center">
        {/* Minimal Logo */}
        <div className="space-y-8">
          <div className="w-24 h-24 mx-auto border-2 border-primary rounded-2xl flex items-center justify-center">
            <Clock className="w-12 h-12 text-primary" />
          </div>
          
          <div className="space-y-3">
            <h1 className="text-6xl font-bold tracking-tight text-foreground">
              Time Is Limited
            </h1>
            <p className="text-base text-muted-foreground">
              Make every moment count
            </p>
          </div>
        </div>

        {/* Clean CTA */}
        <Button 
          onClick={onContinue}
          size="lg"
          className="w-full text-base font-semibold"
        >
          Get Started
        </Button>
      </div>
    </div>
  );
}