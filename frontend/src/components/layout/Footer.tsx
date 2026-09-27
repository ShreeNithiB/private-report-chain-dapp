import { ShieldCheck, Github, Twitter, Globe, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export function Footer() {
  return (
    <footer className="relative border-t border-border/50 bg-card/30 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 blockchain-grid opacity-10" />
      
      <div className="container mx-auto px-4 py-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <Link to="/" className="inline-flex items-center gap-3 mb-6 group">
              <div className="w-12 h-12 rounded-xl bg-gradient-primary flex items-center justify-center group-hover:scale-105 transition-transform">
                <ShieldCheck className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <span className="font-display text-2xl font-bold text-gradient block">
                  DecentraReport
                </span>
                <span className="text-xs text-muted-foreground">Blockchain Verified</span>
              </div>
            </Link>
            <p className="text-muted-foreground max-w-md mb-8 leading-relaxed">
              A decentralized, anonymous complaint reporting system powered by blockchain 
              technology. Ensuring transparency, privacy, and tamper-proof evidence storage
              for a more accountable society.
            </p>
            <div className="flex items-center gap-3">
              {[
                { icon: Github, label: "GitHub" },
                { icon: Twitter, label: "Twitter" },
                { icon: Globe, label: "Website" },
              ].map((social, index) => (
                <a 
                  key={index}
                  href="#" 
                  className="w-10 h-10 rounded-xl bg-secondary/50 border border-border/50 flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/50 hover:bg-primary/5 transition-all"
                  aria-label={social.label}
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display font-semibold text-foreground mb-6">Quick Links</h4>
            <ul className="space-y-3">
              {[
                { to: "/report", label: "Report Complaint" },
                { to: "/track", label: "Track Status" },
                { to: "/admin", label: "Admin Portal" },
                { to: "/esakshya", label: "e-Sakshya Portal" },
              ].map((link, index) => (
                <li key={index}>
                  <Link 
                    to={link.to} 
                    className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-2 group"
                  >
                    {link.label}
                    <ExternalLink className="w-3 h-3 opacity-0 -ml-1 group-hover:opacity-100 group-hover:ml-0 transition-all" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Technology */}
          <div>
            <h4 className="font-display font-semibold text-foreground mb-6">Technology</h4>
            <ul className="space-y-3">
              {[
                "Ethereum / Polygon",
                "IPFS Storage",
                "AI Verification",
                "Gasless Transactions",
                "Smart Contracts",
              ].map((tech, index) => (
                <li key={index} className="text-muted-foreground flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                  {tech}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-border/50 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-muted-foreground text-sm">
            © 2024 DecentraReport. All rights reserved.
          </p>
          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <a href="#" className="hover:text-primary transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-primary transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-primary transition-colors">Documentation</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
