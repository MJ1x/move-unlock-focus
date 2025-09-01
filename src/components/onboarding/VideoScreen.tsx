import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Play, ArrowLeft, Crown } from "lucide-react";

interface VideoScreenProps {
  onContinue: () => void;
  onBack: () => void;
}

export default function VideoScreen({ onContinue, onBack }: VideoScreenProps) {
  const [hasWatched, setHasWatched] = useState(false);
  const [showOverlay, setShowOverlay] = useState(false);

  const handlePlayVideo = () => {
    // Simulate watching the video
    setTimeout(() => {
      setHasWatched(true);
      // Delay overlay appearance for smooth transition
      setTimeout(() => {
        setShowOverlay(true);
      }, 300);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Back Arrow */}
      <button
        onClick={onBack}
        className="absolute top-6 left-6 z-50 w-10 h-10 rounded-full bg-black/20 backdrop-blur-sm flex items-center justify-center text-white/80 hover:text-white hover:bg-black/30 transition-all duration-300"
      >
        <ArrowLeft className="w-5 h-5" />
      </button>

      {/* TikTok-style Video Player */}
      <div className="relative w-full h-screen flex items-center justify-center p-4">
        <div className="relative w-full max-w-sm h-[95vh] bg-gradient-to-br from-muted to-muted/50 rounded-3xl border border-border overflow-hidden shadow-2xl">
          {/* Video Content */}
          {!hasWatched ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <Button
                onClick={handlePlayVideo}
                variant="secondary"
                size="lg"
                className="w-20 h-20 rounded-full bg-white/90 hover:bg-white text-foreground shadow-2xl"
              >
                <Play className="w-7 h-7 ml-1" />
              </Button>
            </div>
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-accent/30" />
          )}

          {/* Bottom Text Overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 via-black/40 to-transparent">
            <h2 className="text-2xl font-bold text-white leading-tight">
              See what's possible in <span className="text-primary">12 months</span>
            </h2>
          </div>

          {/* Question Overlay */}
          {hasWatched && (
            <>
              {/* Blur Backdrop */}
              <div 
                className={`absolute inset-0 bg-black/60 backdrop-blur-md transition-opacity duration-500 ${
                  showOverlay ? 'opacity-100' : 'opacity-0'
                }`}
              />
              
              {/* Question Content */}
              <div 
                className={`absolute inset-0 flex flex-col items-center justify-center p-8 transition-all duration-700 ${
                  showOverlay ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                }`}
              >
                <div className="text-center space-y-8">
                  {/* Crown Icon */}
                  <div 
                    className={`w-20 h-20 mx-auto bg-gradient-primary rounded-full flex items-center justify-center shadow-2xl shadow-primary/25 transition-all duration-700 delay-200 ${
                      showOverlay ? 'opacity-100 scale-100' : 'opacity-0 scale-75'
                    }`}
                  >
                    <Crown className="w-10 h-10 text-primary-foreground" />
                  </div>

                  {/* Question */}
                  <div 
                    className={`space-y-4 transition-all duration-700 delay-300 ${
                      showOverlay ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                    }`}
                  >
                    <h1 className="text-3xl font-black text-white leading-tight">
                      Are you really <span className="text-primary">great</span>?
                    </h1>
                    <p className="text-lg text-white/80">
                      Greatness requires commitment.
                    </p>
                  </div>

                  {/* Buttons */}
                  <div 
                    className={`space-y-4 w-full transition-all duration-700 delay-500 ${
                      showOverlay ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                    }`}
                  >
                    <Button
                      onClick={onContinue}
                      className="w-full py-4 text-lg font-bold bg-gradient-primary hover:shadow-lg hover:shadow-primary/25 transition-all duration-300"
                      size="lg"
                    >
                      <Crown className="w-5 h-5 mr-2" />
                      I Am
                    </Button>

                    <Button
                      onClick={onBack}
                      variant="ghost"
                      className="w-full py-3 text-white/60 hover:text-white/80 hover:bg-white/10 transition-colors duration-300"
                    >
                      Delete App
                    </Button>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}