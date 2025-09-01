import { Button } from "@/components/ui/button";
import { Crown, X } from "lucide-react";

interface CommitmentScreenProps {
  onCommit: () => void;
  onDeleteApp: () => void;
}

export default function CommitmentScreen({ onCommit, onDeleteApp }: CommitmentScreenProps) {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-md space-y-12 text-center">
        {/* Icon */}
        <div className="w-24 h-24 mx-auto bg-gradient-primary rounded-full flex items-center justify-center shadow-2xl shadow-primary/25">
          <Crown className="w-12 h-12 text-primary-foreground" />
        </div>

        {/* Question */}
        <div className="space-y-4">
          <h1 className="text-4xl font-black text-foreground leading-tight">
            Are you really <span className="text-primary">great</span>?
          </h1>
          <p className="text-lg text-muted-foreground">
            Greatness requires commitment. Choose wisely.
          </p>
        </div>

        {/* Options */}
        <div className="space-y-4">
          <Button
            onClick={onCommit}
            className="w-full py-6 text-xl font-bold bg-gradient-primary hover:shadow-lg hover:shadow-primary/25 transition-all duration-300 relative overflow-hidden"
            size="lg"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20 opacity-0 hover:opacity-100 transition-opacity duration-300" />
            <span className="relative flex items-center justify-center gap-2">
              <Crown className="w-5 h-5" />
              I Am
            </span>
          </Button>

          <Button
            onClick={onDeleteApp}
            variant="ghost"
            className="w-full py-4 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors duration-300"
          >
            <X className="w-4 h-4 mr-2" />
            Delete App
          </Button>
        </div>
      </div>
    </div>
  );
}