import { Shield, FileCheck, Users, Blocks, TrendingUp } from "lucide-react";

const stats = [
  {
    icon: FileCheck,
    value: "10,247",
    label: "Complaints Filed",
    suffix: "+",
    change: "+12%",
  },
  {
    icon: Shield,
    value: "99.8",
    label: "AI Accuracy",
    suffix: "%",
    change: "Verified",
  },
  {
    icon: Blocks,
    value: "50,000",
    label: "Blocks Verified",
    suffix: "+",
    change: "+8%",
  },
  {
    icon: Users,
    value: "0",
    label: "Data Breaches",
    suffix: "",
    change: "Secure",
  },
];

export function StatsSection() {
  return (
    <section className="py-16 relative">
      {/* Background Line */}
      <div className="absolute top-1/2 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="group relative text-center p-6 md:p-8 rounded-3xl glass-card border border-border/50 hover:border-primary/30 transition-all duration-300 overflow-hidden"
            >
              {/* Background Glow */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              
              {/* Icon */}
              <div className="w-14 h-14 mx-auto rounded-2xl bg-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <stat.icon className="w-7 h-7 text-primary" />
              </div>
              
              {/* Value */}
              <div className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-gradient mb-2">
                {stat.value}{stat.suffix}
              </div>
              
              {/* Label */}
              <div className="text-sm md:text-base text-muted-foreground mb-3">
                {stat.label}
              </div>
              
              {/* Change Indicator */}
              <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-success/10 text-success text-xs font-medium">
                <TrendingUp className="w-3 h-3" />
                {stat.change}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
