import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Play, ArrowRight } from "lucide-react";

interface VideoScreenProps {
  onContinue: () => void;
}

export default function VideoScreen({ onContinue }: VideoScreenProps) {
  const [hasWatched, setHasWatched] = useState(false);

  const handlePlayVideo = () => {
    // Simulate watching the video
    setTimeout(() => {
      setHasWatched(true);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-2xl space-y-8">
        {/* Video Player Mockup */}
        <div className="relative aspect-video bg-gradient-to-br from-muted to-muted/50 rounded-2xl border border-border overflow-hidden">
          {!hasWatched ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <Button
                onClick={handlePlayVideo}
                variant="secondary"
                size="lg"
                className="w-24 h-24 rounded-full bg-background/90 hover:bg-background text-foreground shadow-2xl"
              >
                <Play className="w-8 h-8 ml-1" />
              </Button>
            </div>
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
              <div className="text-center space-y-4">
                <div className="w-16 h-16 mx-auto bg-success rounded-full flex items-center justify-center">
                  <ArrowRight className="w-8 h-8 text-success-foreground" />
                </div>
                <p className="text-foreground font-medium">Video completed</p>
              </div>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="text-center space-y-6">
          <h2 className="text-3xl font-bold text-foreground">
            See what's possible in <span className="text-primary">12 months</span>
          </h2>
          
          {hasWatched && (
            <Button 
              onClick={onContinue}
              className="w-full max-w-sm mx-auto py-4 text-lg font-semibold bg-gradient-primary hover:shadow-lg hover:shadow-primary/25 transition-all duration-300"
              size="lg"
            >
              Continue Your Journey
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}