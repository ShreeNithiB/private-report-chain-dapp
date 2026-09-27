import { 
  FileUp, 
  Brain, 
  HardDrive, 
  Blocks, 
  Building2,
  Hash,
  ArrowRight,
  CheckCircle
} from "lucide-react";

const steps = [
  {
    step: 1,
    icon: FileUp,
    title: "Submit Complaint",
    description: "User submits complaint with title, description, and evidence anonymously.",
    color: "from-primary to-primary/70",
  },
  {
    step: 2,
    icon: Brain,
    title: "AI Verification",
    description: "Evidence is analyzed by AI to detect manipulation or fake content.",
    color: "from-accent to-accent/70",
  },
  {
    step: 3,
    icon: HardDrive,
    title: "IPFS Upload",
    description: "Verified evidence is uploaded to IPFS, generating a unique CID hash.",
    color: "from-success to-success/70",
  },
  {
    step: 4,
    icon: Blocks,
    title: "Blockchain Record",
    description: "CID and AI verification hash are permanently stored on blockchain.",
    color: "from-primary to-accent",
  },
  {
    step: 5,
    icon: Building2,
    title: "e-Sakshya Sync",
    description: "Complaint is automatically enrolled in the government portal.",
    color: "from-amber-500 to-amber-500/70",
  },
  {
    step: 6,
    icon: Hash,
    title: "Track with CID",
    description: "User can track complaint status anytime using their CID hash.",
    color: "from-accent to-success",
  },
];

export function WorkflowSection() {
  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-card/50 to-transparent" />
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/50 border border-border/50 mb-6">
            <ArrowRight className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-muted-foreground">Workflow</span>
          </div>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            <span className="text-foreground">How It</span>{" "}
            <span className="text-gradient">Works</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            A seamless 6-step process from submission to tracking, 
            ensuring complete transparency and security.
          </p>
        </div>

        {/* Workflow Steps */}
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <div
                key={index}
                className="relative group"
              >
                {/* Card */}
                <div className="relative p-8 rounded-3xl glass-card border border-border/50 hover:border-primary/30 transition-all duration-500 h-full overflow-hidden">
                  {/* Step Number Background */}
                  <div className="absolute -top-4 -right-4 font-display text-[120px] font-bold text-primary/5 select-none">
                    {step.step}
                  </div>
                  
                  {/* Step Badge */}
                  <div className="flex items-center gap-4 mb-6 relative z-10">
                    <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center text-primary-foreground font-display font-bold text-lg shadow-lg`}>
                      {step.step}
                    </div>
                    <div className="w-10 h-10 rounded-xl bg-secondary/50 flex items-center justify-center">
                      <step.icon className="w-5 h-5 text-primary" />
                    </div>
                  </div>

                  {/* Content */}
                  <h3 className="font-display text-xl font-semibold text-foreground mb-3 relative z-10">
                    {step.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed relative z-10">
                    {step.description}
                  </p>

                  {/* Completion Indicator */}
                  <div className="absolute bottom-4 right-4 w-8 h-8 rounded-full bg-success/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <CheckCircle className="w-4 h-4 text-success" />
                  </div>
                </div>

                {/* Connector Arrow */}
                {index < steps.length - 1 && (index + 1) % 3 !== 0 && (
                  <div className="hidden lg:flex absolute top-1/2 -right-4 transform -translate-y-1/2 z-20">
                    <div className="w-8 h-8 rounded-full bg-secondary border border-border flex items-center justify-center">
                      <ArrowRight className="w-4 h-4 text-primary" />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Blockchain Chain Visualization */}
        <div className="mt-20 flex items-center justify-center gap-2 md:gap-4 overflow-hidden">
          {[...Array(7)].map((_, i) => (
            <div key={i} className="flex items-center gap-2 md:gap-4">
              <div 
                className="w-10 h-10 md:w-14 md:h-14 rounded-xl bg-secondary border border-border/50 flex items-center justify-center chain-link hover:border-primary/50 hover:bg-primary/5 transition-all cursor-pointer" 
                style={{ animationDelay: `${i * 0.3}s` }}
              >
                <Blocks className="w-4 h-4 md:w-6 md:h-6 text-primary" />
              </div>
              {i < 6 && (
                <div 
                  className="w-6 md:w-10 h-0.5 bg-gradient-to-r from-primary to-accent chain-link rounded-full" 
                  style={{ animationDelay: `${i * 0.3 + 0.15}s` }} 
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
