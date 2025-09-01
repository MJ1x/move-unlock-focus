import { Button } from "@/components/ui/button";
import { Clock } from "lucide-react";

interface LaunchScreenProps {
  onContinue: () => void;
}

export default function LaunchScreen({ onContinue }: LaunchScreenProps) {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-primary/5" />
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-accent/10 rounded-full blur-3xl" />
      
      <div className="relative z-10 w-full max-w-md space-y-12 text-center">
        {/* Logo */}
        <div className="space-y-6">
          <div className="w-32 h-32 mx-auto bg-gradient-primary rounded-3xl flex items-center justify-center shadow-2xl shadow-primary/25">
            <Clock className="w-16 h-16 text-primary-foreground" />
          </div>
          
          <div className="space-y-2">
            <h1 className="text-5xl font-black bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
              Time Is Limited
            </h1>
            <p className="text-lg text-muted-foreground font-medium">
              Make every moment count
            </p>
          </div>
        </div>

        {/* CTA */}
        <Button 
          onClick={onContinue}
          className="w-full py-6 text-xl font-bold bg-gradient-primary hover:shadow-lg hover:shadow-primary/25 transition-all duration-300"
          size="lg"
        >
          Transform Your Life
        </Button>
      </div>
    </div>
  );
}