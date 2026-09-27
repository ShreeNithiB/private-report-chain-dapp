import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  Shield, 
  Lock, 
  Eye, 
  FileSearch, 
  ArrowRight,
  Blocks,
  Fingerprint,
  Sparkles
} from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative py-24 md:py-36 overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Gradient Orbs */}
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-accent/10 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: "1s" }} />
        
        {/* Floating Shapes */}
        <div className="absolute top-20 left-10 w-20 h-20 border border-primary/20 rounded-xl rotate-45 float" />
        <div className="absolute top-40 right-20 w-16 h-16 border border-accent/20 rounded-full float" style={{ animationDelay: "1s" }} />
        <div className="absolute bottom-32 left-1/4 w-12 h-12 bg-primary/10 rounded-lg rotate-12 float" style={{ animationDelay: "2s" }} />
        <div className="absolute bottom-48 right-1/3 w-8 h-8 bg-accent/10 rounded-full float" style={{ animationDelay: "0.5s" }} />
        <div className="absolute top-1/3 right-10 w-6 h-6 border border-primary/30 rounded float" style={{ animationDelay: "1.5s" }} />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-5xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full glass-card border border-primary/30 mb-8 fade-in-up">
            <div className="relative">
              <Blocks className="w-4 h-4 text-primary" />
              <div className="absolute inset-0 w-4 h-4 bg-primary/50 blur-sm rounded-full" />
            </div>
            <span className="text-sm font-medium text-foreground">Powered by Blockchain Technology</span>
            <Sparkles className="w-3 h-3 text-accent" />
          </div>

          {/* Main Heading */}
          <h1 className="font-display text-5xl md:text-7xl lg:text-8xl font-bold mb-8 fade-in-up tracking-tight">
            <span className="text-foreground">Anonymous.</span>
            <br className="md:hidden" />
            <span className="text-gradient neon-text"> Transparent.</span>
            <br className="md:hidden" />
            <span className="text-foreground"> Immutable.</span>
          </h1>

          {/* Subheading */}
          <p className="text-lg md:text-xl lg:text-2xl text-muted-foreground max-w-3xl mx-auto mb-12 fade-in-up leading-relaxed" style={{ animationDelay: "0.1s" }}>
            Report complaints anonymously with <span className="text-primary font-medium">tamper-proof evidence</span> storage. 
            Powered by <span className="text-accent font-medium">AI verification</span>, IPFS, and blockchain technology.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16 fade-in-up" style={{ animationDelay: "0.2s" }}>
            <Link to="/report">
              <Button variant="hero" size="xl" className="gap-3 group">
                <FileSearch className="w-5 h-5" />
                Report Anonymously
                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
            <Link to="/track">
              <Button variant="glass" size="xl" className="gap-3 group">
                <Eye className="w-5 h-5" />
                Track Complaint
                <ArrowRight className="w-5 h-5 opacity-0 -ml-2 transition-all group-hover:opacity-100 group-hover:ml-0" />
              </Button>
            </Link>
          </div>

          {/* Feature Pills */}
          <div className="flex flex-wrap items-center justify-center gap-4 fade-in-up" style={{ animationDelay: "0.3s" }}>
            {[
              { icon: Fingerprint, label: "No Identity Required" },
              { icon: Shield, label: "End-to-End Encrypted" },
              { icon: Lock, label: "Immutable Records" },
            ].map((feature, index) => (
              <div 
                key={index}
                className="flex items-center gap-3 px-5 py-3 rounded-2xl bg-secondary/30 border border-border/50 hover:border-primary/30 hover:bg-secondary/50 transition-all duration-300 cursor-default group"
              >
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <feature.icon className="w-4 h-4 text-primary" />
                </div>
                <span className="text-sm font-medium text-foreground">{feature.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Decorative Bottom Line */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/2 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
      </div>
    </section>
  );
}
