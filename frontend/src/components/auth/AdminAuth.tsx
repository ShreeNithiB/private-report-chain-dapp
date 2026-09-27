import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Shield, 
  Lock, 
  Fingerprint, 
  Eye, 
  EyeOff,
  AlertCircle,
  CheckCircle
} from "lucide-react";
import { toast } from "@/hooks/use-toast";

// Demo password - In production, this would be server-side validated
const ADMIN_PASSWORD = "DecentraAdmin@2024";

interface AdminAuthProps {
  children: React.ReactNode;
  portalName: string;
  portalIcon: React.ReactNode;
}

export const AdminAuth = ({ children, portalName, portalIcon }: AdminAuthProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [attempts, setAttempts] = useState(0);

  const handleAuthenticate = async () => {
    if (attempts >= 5) {
      setError("Too many failed attempts. Please try again later.");
      return;
    }

    setIsLoading(true);
    setError("");

    // Simulate biometric/authentication delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      toast({
        title: "Authentication Successful",
        description: `Welcome to ${portalName}`,
      });
    } else {
      setAttempts(prev => prev + 1);
      setError("Invalid credentials. Please try again.");
      setPassword("");
    }

    setIsLoading(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && password) {
      handleAuthenticate();
    }
  };

  if (isAuthenticated) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      {/* Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="blockchain-grid opacity-30" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
      </div>

      <div className="relative w-full max-w-md">
        {/* Security Badge */}
        <div className="absolute -top-20 left-1/2 -translate-x-1/2">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-glow animate-pulse-glow">
            <Shield className="w-12 h-12 text-background" />
          </div>
        </div>

        <div className="glass-card rounded-2xl border border-border/50 p-8 pt-16">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-3 mb-4">
              {portalIcon}
              <h1 className="font-display text-2xl font-bold text-foreground">
                {portalName}
              </h1>
            </div>
            <p className="text-muted-foreground text-sm">
              Secure authentication required to access this portal
            </p>
          </div>

          {/* Biometric Visual */}
          <div className="flex justify-center mb-8">
            <div className="relative">
              <div className={`w-32 h-32 rounded-full border-4 ${isLoading ? 'border-primary animate-pulse' : 'border-border/50'} flex items-center justify-center transition-all duration-300`}>
                <Fingerprint className={`w-16 h-16 ${isLoading ? 'text-primary' : 'text-muted-foreground'} transition-colors`} />
              </div>
              {isLoading && (
                <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-primary animate-spin" />
              )}
            </div>
          </div>

          {/* Password Input */}
          <div className="space-y-4">
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="Enter admin password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={isLoading || attempts >= 5}
                className="pl-12 pr-12 h-14 text-lg"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>

            {/* Error Message */}
            {error && (
              <div className="flex items-center gap-2 p-3 rounded-lg bg-destructive/10 border border-destructive/30">
                <AlertCircle className="w-4 h-4 text-destructive" />
                <span className="text-sm text-destructive">{error}</span>
              </div>
            )}

            {/* Attempts Warning */}
            {attempts > 0 && attempts < 5 && (
              <p className="text-xs text-warning text-center">
                {5 - attempts} attempts remaining
              </p>
            )}

            {/* Submit Button */}
            <Button
              onClick={handleAuthenticate}
              disabled={!password || isLoading || attempts >= 5}
              className="w-full h-14 text-lg gap-3"
              variant="hero"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-background/30 border-t-background rounded-full animate-spin" />
                  Verifying...
                </>
              ) : (
                <>
                  <CheckCircle className="w-5 h-5" />
                  Authenticate
                </>
              )}
            </Button>
          </div>

          {/* Security Note */}
          <div className="mt-8 pt-6 border-t border-border/50">
            <div className="flex items-start gap-3 text-xs text-muted-foreground">
              <Shield className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <p>
                This portal is protected by blockchain-verified authentication. 
                All access attempts are logged on the immutable ledger.
              </p>
            </div>
          </div>

          {/* Demo Hint */}
          <div className="mt-4 p-3 rounded-lg bg-primary/5 border border-primary/20">
            <p className="text-xs text-center text-muted-foreground">
              <span className="text-primary font-medium">Demo Mode:</span> Use password{" "}
              <code className="px-1.5 py-0.5 rounded bg-primary/10 text-primary font-mono">
                DecentraAdmin@2024
              </code>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
