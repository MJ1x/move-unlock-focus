import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Zap } from "lucide-react";

interface PricingScreenProps {
  onStartTrial: () => void;
}

export default function PricingScreen({ onStartTrial }: PricingScreenProps) {
  const [price, setPrice] = useState([9]);

  const getPriceValue = () => price[0];
  const getYearlyPrice = () => Math.round(getPriceValue() * 12 * 0.8); // 20% discount for yearly

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-lg space-y-10 text-center">
        {/* Header */}
        <div className="space-y-4">
          <div className="w-20 h-20 mx-auto bg-gradient-primary rounded-2xl flex items-center justify-center shadow-xl shadow-primary/25">
            <Sparkles className="w-10 h-10 text-primary-foreground" />
          </div>
          
          <h1 className="text-3xl font-bold text-foreground">
            How much is your <span className="text-primary">time</span> worth?
          </h1>
          <p className="text-muted-foreground">
            Invest in yourself. Transform your relationship with technology.
          </p>
        </div>

        {/* Pricing Slider */}
        <div className="space-y-8 bg-card p-8 rounded-2xl border border-border/50">
          <div className="space-y-6">
            <div className="text-center">
              <div className="text-5xl font-black text-foreground mb-2">
                ${getPriceValue()}
                <span className="text-lg text-muted-foreground font-normal">/month</span>
              </div>
              <p className="text-sm text-muted-foreground">
                or ${getYearlyPrice()}/year <Badge variant="secondary" className="ml-2">Save 20%</Badge>
              </p>
            </div>

            <div className="px-4">
              <Slider
                value={price}
                onValueChange={setPrice}
                max={15}
                min={3}
                step={1}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-muted-foreground mt-2">
                <span>$3</span>
                <span>$15</span>
              </div>
            </div>
          </div>

          {/* Features */}
          <div className="space-y-3 text-left">
            <div className="flex items-center gap-2 text-sm">
              <Zap className="w-4 h-4 text-primary" />
              <span>AI-powered habit tracking</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Zap className="w-4 h-4 text-primary" />
              <span>Advanced app blocking</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Zap className="w-4 h-4 text-primary" />
              <span>Personalized coaching</span>
            </div>
          </div>
        </div>

        {/* Trial Badge */}
        <div className="bg-success/10 border border-success/20 rounded-xl p-4">
          <p className="text-success font-semibold text-lg">
            3-day free trial
          </p>
          <p className="text-success/80 text-sm">
            Cancel anytime. No commitment required.
          </p>
        </div>

        {/* CTA */}
        <Button 
          onClick={onStartTrial}
          className="w-full py-6 text-xl font-bold bg-gradient-primary hover:shadow-lg hover:shadow-primary/25 transition-all duration-300"
          size="lg"
        >
          Start Transformation
        </Button>

        <p className="text-xs text-muted-foreground">
          By continuing, you agree to our terms and privacy policy
        </p>
      </div>
    </div>
  );
}