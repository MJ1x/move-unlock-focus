import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Bell, Clock } from "lucide-react";

interface ReminderFrequencyScreenProps {
  onContinue: (frequency: number) => void;
  onBack: () => void;
  initialValue?: number;
}

export default function ReminderFrequencyScreen({ onContinue, onBack, initialValue }: ReminderFrequencyScreenProps) {
  const [selectedFrequency, setSelectedFrequency] = useState(initialValue || 15);

  const frequencyOptions = [
    { value: 5, label: "5 minutes", description: "Frequent check-ins" },
    { value: 10, label: "10 minutes", description: "Regular awareness" },
    { value: 15, label: "15 minutes", description: "Balanced approach" },
    { value: 20, label: "20 minutes", description: "Gentle reminders" },
    { value: 30, label: "30 minutes", description: "Minimal interruption" },
  ];

  const handleContinue = () => {
    onContinue(selectedFrequency);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 relative">
      {/* Back Arrow */}
      <button
        onClick={onBack}
        className="absolute top-6 left-6 w-10 h-10 rounded-full bg-muted/20 backdrop-blur-sm flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/30 transition-all duration-300"
      >
        <ArrowLeft className="w-5 h-5" />
      </button>
      
      <div className="w-full max-w-lg space-y-8 text-center">
        {/* Header */}
        <div className="space-y-4">
          <div className="w-20 h-20 mx-auto bg-gradient-primary rounded-2xl flex items-center justify-center shadow-xl shadow-primary/25">
            <Bell className="w-10 h-10 text-primary-foreground" />
          </div>
          
          <h1 className="text-3xl font-bold text-foreground">
            Usage Awareness <span className="text-primary">Reminders</span>
          </h1>
          <p className="text-muted-foreground">
            Get gentle reminders to take breaks every:
          </p>
        </div>

        {/* Frequency Options */}
        <div className="space-y-3">
          {frequencyOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => setSelectedFrequency(option.value)}
              className={`w-full p-4 rounded-xl border-2 transition-all duration-300 text-left ${
                selectedFrequency === option.value
                  ? "border-primary bg-primary/10 shadow-lg shadow-primary/25"
                  : "border-border bg-card hover:border-primary/50 hover:bg-primary/5"
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-semibold text-foreground">{option.label}</div>
                  <div className="text-sm text-muted-foreground">{option.description}</div>
                </div>
                <div className={`w-4 h-4 rounded-full border-2 ${
                  selectedFrequency === option.value
                    ? "border-primary bg-primary"
                    : "border-muted-foreground"
                }`}>
                  {selectedFrequency === option.value && (
                    <div className="w-full h-full rounded-full bg-primary-foreground scale-50" />
                  )}
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Explanation */}
        <div className="bg-primary/10 border border-primary/20 rounded-xl p-4">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Clock className="w-4 h-4 text-primary" />
            <span className="text-primary font-semibold text-sm">Mindful Breaks</span>
          </div>
          <p className="text-primary/80 text-sm">
            Dismissible awareness prompts to help you stay mindful of your usage
          </p>
        </div>

        {/* CTA */}
        <Button 
          onClick={handleContinue}
          className="w-full py-6 text-xl font-bold bg-gradient-primary hover:shadow-lg hover:shadow-primary/25 transition-all duration-300"
          size="lg"
        >
          Next
        </Button>
      </div>
    </div>
  );
}