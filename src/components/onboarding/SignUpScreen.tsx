import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Crown, Eye, EyeOff } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";

// Strong validation schema for security
const signUpSchema = z.object({
  email: z.string()
    .trim()
    .email({ message: "Please enter a valid email address" })
    .max(255, { message: "Email must be less than 255 characters" }),
  password: z.string()
    .min(8, { message: "Password must be at least 8 characters" })
    .max(72, { message: "Password must be less than 72 characters" })
    .regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter" })
    .regex(/[a-z]/, { message: "Password must contain at least one lowercase letter" })
    .regex(/[0-9]/, { message: "Password must contain at least one number" })
});

interface SignUpScreenProps {
  onContinue: () => void;
  onBack: () => void;
}

export default function SignUpScreen({ onContinue, onBack }: SignUpScreenProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate inputs using zod schema
    const validation = signUpSchema.safeParse({ 
      email: email.trim(), 
      password 
    });
    
    if (!validation.success) {
      const firstError = validation.error.errors[0];
      toast({
        title: "Invalid Input",
        description: firstError.message,
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    
    try {
      const redirectUrl = `${window.location.origin}/`;
      const validData = validation.data;
      
      const { data, error } = await supabase.auth.signUp({
        email: validData.email,
        password: validData.password,
        options: {
          emailRedirectTo: redirectUrl
        }
      });

      if (error) {
        if (error.message.includes("already registered")) {
          toast({
            title: "Account exists",
            description: "This email is already registered. Try signing in instead.",
            variant: "destructive"
          });
        } else {
          toast({
            title: "Sign up failed",
            description: error.message,
            variant: "destructive"
          });
        }
        return;
      }

      // Check if session was established (email confirmation disabled)
      if (data.session) {
        toast({
          title: "Account created!",
          description: "Welcome! Let's set up your preferences.",
        });
        onContinue();
      } else {
        // Email confirmation is required
        toast({
          title: "Verify your email",
          description: "Please check your email and click the verification link to continue.",
        });
        // Don't proceed to questionnaire until email is verified
      }
    } catch (error) {
      toast({
        title: "Something went wrong",
        description: "Please try again",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
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

      <div className="w-full max-w-md space-y-8 text-center">
        {/* Header */}
        <div className="space-y-4">
          <div className="w-20 h-20 mx-auto bg-gradient-primary rounded-2xl flex items-center justify-center shadow-xl shadow-primary/25">
            <Crown className="w-10 h-10 text-primary-foreground" />
          </div>
          
          <h1 className="text-3xl font-bold text-foreground">
            Create your <span className="text-primary">account</span>
          </h1>
          <p className="text-muted-foreground">
            Join the community of achievers who value their time.
          </p>
        </div>

        {/* Sign Up Form */}
        <form onSubmit={handleSignUp} className="space-y-6 bg-card p-8 rounded-2xl border border-border/50">
          <div className="space-y-4 text-left">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium text-foreground">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="h-12 text-base"
                disabled={isLoading}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium text-foreground">
                Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 8 characters (A-Z, a-z, 0-9)"
                  className="h-12 text-base pr-12"
                  disabled={isLoading}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  disabled={isLoading}
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>
          </div>

          <Button 
            type="submit"
            className="w-full py-6 text-lg font-bold bg-gradient-primary hover:shadow-lg hover:shadow-primary/25 transition-all duration-300"
            size="lg"
            disabled={isLoading}
          >
            {isLoading ? "Creating account..." : "Create Account"}
          </Button>
          
          <Button 
            type="button"
            variant="outline"
            className="w-full py-3"
            onClick={onContinue}
            disabled={isLoading}
          >
            Skip (Testing)
          </Button>
        </form>

        <p className="text-xs text-muted-foreground">
          By creating an account, you agree to our terms and privacy policy
        </p>
      </div>
    </div>
  );
}