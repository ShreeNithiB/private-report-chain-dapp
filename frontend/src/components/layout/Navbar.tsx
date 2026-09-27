import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  ShieldCheck, 
  FileSearch, 
  LayoutDashboard, 
  Building2,
  Menu,
  X,
  Compass
} from "lucide-react";
import { useState, useEffect } from "react";
import { ConnectWalletButton } from "@/components/wallet/ConnectWalletButton";
const navLinks = [
  { path: "/", label: "Home", icon: ShieldCheck },
  { path: "/report", label: "Report", icon: FileSearch },
  { path: "/track", label: "Track", icon: Compass },
  { path: "/admin", label: "Admin", icon: LayoutDashboard },
  { path: "/esakshya", label: "e-Sakshya", icon: Building2 },
];

export function Navbar() {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled ? "glass-card border-b border-border/50 shadow-lg" : "bg-transparent"
    }`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="relative">
              <div className="w-11 h-11 rounded-xl bg-gradient-primary flex items-center justify-center shadow-glow transition-transform group-hover:scale-105">
                <ShieldCheck className="w-6 h-6 text-primary-foreground" />
              </div>
              <div className="absolute inset-0 w-11 h-11 rounded-xl bg-primary/30 animate-pulse opacity-50" />
            </div>
            <div className="flex flex-col">
              <span className="font-display text-xl font-bold text-gradient">
                DecentraReport
              </span>
              <span className="text-[10px] text-muted-foreground tracking-wider uppercase">
                Blockchain Verified
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-4">
            <div className="flex items-center gap-1 p-1.5 rounded-2xl glass-card border border-border/50">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const isActive = location.pathname === link.path;
                return (
                  <Link key={link.path} to={link.path}>
                    <Button
                      variant={isActive ? "default" : "ghost"}
                      size="sm"
                      className={`gap-2 rounded-xl transition-all ${
                        isActive 
                          ? "bg-primary text-primary-foreground shadow-md" 
                          : "hover:bg-secondary/80"
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      {link.label}
                    </Button>
                  </Link>
                );
              })}
            </div>
            <ConnectWalletButton />
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden rounded-xl"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden py-4 border-t border-border/50 fade-in-up">
            <div className="flex flex-col gap-2">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const isActive = location.pathname === link.path;
                return (
                  <Link 
                    key={link.path} 
                    to={link.path}
                    onClick={() => setIsOpen(false)}
                  >
                    <Button
                      variant={isActive ? "default" : "ghost"}
                      className={`w-full justify-start gap-3 rounded-xl ${
                        isActive ? "bg-primary text-primary-foreground" : ""
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      {link.label}
                    </Button>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
