import { 
  Shield, 
  Brain, 
  HardDrive, 
  Blocks, 
  Zap, 
  Search,
  Building2,
  Lock
} from "lucide-react";

const features = [
  {
    icon: Shield,
    title: "Anonymous Reporting",
    description: "No wallet connection, no personal data. Submit complaints with complete anonymity and privacy protection.",
    color: "from-primary to-primary/50",
    iconBg: "bg-primary/10",
  },
  {
    icon: Brain,
    title: "AI Verification",
    description: "Advanced AI algorithms detect fake images, manipulations, and deepfakes to ensure evidence authenticity.",
    color: "from-accent to-accent/50",
    iconBg: "bg-accent/10",
  },
  {
    icon: HardDrive,
    title: "IPFS Storage",
    description: "Evidence stored on decentralized IPFS network. Immutable, censorship-resistant, and always available.",
    color: "from-success to-success/50",
    iconBg: "bg-success/10",
  },
  {
    icon: Blocks,
    title: "Blockchain Records",
    description: "All complaints recorded on Ethereum/Polygon with cryptographic proof and full audit trail.",
    color: "from-primary to-accent",
    iconBg: "bg-primary/10",
  },
  {
    icon: Zap,
    title: "Gasless Transactions",
    description: "Submit complaints without paying gas fees. We handle all blockchain costs for you.",
    color: "from-warning to-warning/50",
    iconBg: "bg-warning/10",
  },
  {
    icon: Search,
    title: "Real-time Tracking",
    description: "Track your complaint status using your unique CID hash. Full transparency at every step.",
    color: "from-accent to-primary",
    iconBg: "bg-accent/10",
  },
  {
    icon: Building2,
    title: "Government Integration",
    description: "Seamless integration with e-Sakshya government portal for official complaint enrollment.",
    color: "from-amber-500 to-amber-500/50",
    iconBg: "bg-amber-500/10",
  },
  {
    icon: Lock,
    title: "Tamper-Proof",
    description: "Once submitted, evidence cannot be altered or deleted. Blockchain ensures data integrity forever.",
    color: "from-success to-accent",
    iconBg: "bg-success/10",
  },
];

export function FeaturesSection() {
  return (
    <section className="py-24 relative">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/50 border border-border/50 mb-6">
            <Blocks className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-muted-foreground">Technology Stack</span>
          </div>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            <span className="text-gradient">Decentralized</span>{" "}
            <span className="text-foreground">Infrastructure</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Built with cutting-edge Web3 technologies to ensure maximum security, 
            transparency, and trust in the complaint reporting process.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group relative p-6 rounded-2xl glass-card border border-border/50 hover:border-primary/30 transition-all duration-500 hover:shadow-glow overflow-hidden"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Gradient Overlay on Hover */}
              <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />
              
              {/* Icon */}
              <div className={`relative w-14 h-14 rounded-2xl ${feature.iconBg} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300`}>
                <feature.icon className="w-7 h-7 text-primary" />
              </div>

              {/* Content */}
              <h3 className="font-display text-lg font-semibold text-foreground mb-3 group-hover:text-primary transition-colors">
                {feature.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {feature.description}
              </p>

              {/* Corner Decoration */}
              <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-primary/5 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
