import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Search,
  Hash,
  CheckCircle,
  Clock,
  AlertTriangle,
  Brain,
  HardDrive,
  Blocks,
  Shield,
  Loader2,
  Compass,
  ArrowRight,
  ExternalLink,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useComplaint, ReportRecord } from "@/hooks/useComplaint";

type ComplaintStatus = "pending" | "submitted" | "verified" | "investigating" | "resolved";

const statusConfig: Record<ComplaintStatus, { label: string; color: string; bgColor: string; icon: React.ElementType }> = {
  pending:      { label: "Pending Review",      color: "text-warning",     bgColor: "bg-warning/10 border-warning/30",    icon: Clock        },
  submitted:    { label: "Submitted",           color: "text-primary",     bgColor: "bg-primary/10 border-primary/30",    icon: CheckCircle  },
  verified:     { label: "Verified",            color: "text-accent",      bgColor: "bg-accent/10 border-accent/30",      icon: CheckCircle  },
  investigating:{ label: "Under Investigation", color: "text-primary",     bgColor: "bg-primary/10 border-primary/30",    icon: AlertTriangle },
  resolved:     { label: "Resolved",            color: "text-accent",      bgColor: "bg-accent/10 border-accent/30",      icon: CheckCircle  },
};

const TrackComplaint = () => {
  const [cidInput, setCidInput]   = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [complaint, setComplaint] = useState<ReportRecord | null>(null);
  const [showFullCid, setShowFullCid] = useState(false);

  const { trackComplaint } = useComplaint();

  const handleSearch = async () => {
    if (!cidInput.trim()) {
      toast({ title: "Enter Report ID or CID", description: "Please enter your report ID or metadata CID.", variant: "destructive" });
      return;
    }

    setIsSearching(true);
    setComplaint(null);
    try {
      const result = await trackComplaint(cidInput.trim());
      setComplaint(result);
    } catch (error) {
      toast({
        title: "Report Not Found",
        description: error instanceof Error ? error.message : "No report found with this ID.",
        variant: "destructive",
      });
    } finally {
      setIsSearching(false);
    }
  };

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" });

  const StatusBadge = ({ status }: { status: string }) => {
    const cfg = statusConfig[status as ComplaintStatus] ?? statusConfig.pending;
    const Icon = cfg.icon;
    return (
      <div className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full border ${cfg.bgColor} ${cfg.color}`}>
        <Icon className="w-4 h-4" />
        <span className="text-sm font-semibold">{cfg.label}</span>
      </div>
    );
  };

  const buildTimeline = (c: ReportRecord) => {
    const base = [
      { event: "Report submitted anonymously",   timestamp: c.createdAt, icon: Shield,    color: "bg-primary/20 text-primary" },
      { event: `AI verification — ${c.isAuthentic ? "Evidence authentic" : "Evidence flagged"}`,
                                                  timestamp: c.createdAt, icon: Brain,     color: c.isAuthentic ? "bg-accent/20 text-accent" : "bg-warning/20 text-warning" },
      { event: "Evidence stored on IPFS",        timestamp: c.createdAt, icon: HardDrive, color: "bg-accent/20 text-accent" },
    ];

    if (c.txHash) {
      base.push({ event: "Recorded on Sepolia blockchain", timestamp: c.createdAt, icon: Blocks, color: "bg-primary/20 text-primary" });
    }

    // Add CID history entries if present
    if (c.cidHistory && c.cidHistory.length > 1) {
      c.cidHistory.slice(1).forEach(h => {
        base.push({
          event: `CID updated — status: ${h.status}${h.notes ? ` — ${h.notes}` : ""}`,
          timestamp: h.timestamp,
          icon: Blocks,
          color: "bg-warning/20 text-warning",
        });
      });
    }

    return base;
  };

  return (
    <Layout>
      <div className="py-12 min-h-screen">
        <div className="container mx-auto px-4">

          {/* Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full glass-card border border-primary/30 mb-8">
              <Compass className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium">Real-time Tracking</span>
            </div>
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              <span className="text-foreground">Track Your</span>{" "}
              <span className="text-gradient">Complaint</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Enter your Report ID or Metadata CID to view the current status and
              complete CID timeline stored on the blockchain.
            </p>
          </div>

          {/* Search Bar */}
          <div className="max-w-3xl mx-auto mb-16">
            <div className="glass-card rounded-3xl p-8 border border-border/50 shadow-elevated">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1 relative">
                  <Hash className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    placeholder="Enter Report ID or Metadata CID…"
                    value={cidInput}
                    onChange={e => setCidInput(e.target.value)}
                    className="pl-14 h-14 text-base rounded-2xl"
                    onKeyDown={e => e.key === "Enter" && handleSearch()}
                  />
                </div>
                <Button
                  variant="hero"
                  size="xl"
                  className="gap-3 rounded-2xl"
                  onClick={handleSearch}
                  disabled={isSearching}
                >
                  {isSearching ? <Loader2 className="w-5 h-5 animate-spin" /> : <Search className="w-5 h-5" />}
                  Track Status
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-4 text-center">
                Use the Report ID or Metadata CID you received after submitting your complaint
              </p>
            </div>
          </div>

          {/* Results */}
          {complaint && (
            <div className="max-w-4xl mx-auto space-y-6 fade-in-up">

              {/* Status Card */}
              <div className="glass-card rounded-3xl p-8 border border-border/50">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-8">
                  <div>
                    <p className="text-sm text-muted-foreground mb-3">Current Status</p>
                    <StatusBadge status={complaint.status} />
                  </div>
                  <div className="lg:text-right">
                    <p className="text-sm text-muted-foreground mb-2">Submitted</p>
                    <p className="text-foreground font-semibold text-lg">{formatDate(complaint.createdAt)}</p>
                  </div>
                </div>

                <div className="border-t border-border/50 pt-8">
                  {complaint.title && (
                    <h3 className="font-display font-bold text-xl mb-4">{complaint.title}</h3>
                  )}
                  {complaint.description && (
                    <p className="text-muted-foreground mb-6">{complaint.description}</p>
                  )}

                  <div className="space-y-3">
                    {/* Report ID */}
                    <div className="flex items-center gap-3 p-4 rounded-2xl bg-secondary/30 border border-border/50">
                      <Hash className="w-5 h-5 text-primary shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-muted-foreground mb-1">Report ID</p>
                        <code className="font-mono text-sm text-foreground break-all">{complaint.id}</code>
                      </div>
                    </div>

                    {/* Metadata CID */}
                    <div className="flex items-center gap-3 p-4 rounded-2xl bg-secondary/30 border border-border/50">
                      <Hash className="w-5 h-5 text-primary shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-muted-foreground mb-1">Metadata CID</p>
                        <code className="font-mono text-sm text-foreground break-all">
                          {showFullCid ? complaint.cidHash : `${complaint.cidHash.slice(0, 40)}…`}
                        </code>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowFullCid(v => !v)}
                        className="shrink-0"
                      >
                        {showFullCid ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </Button>
                    </div>

                    {/* TX Hash */}
                    {complaint.txHash && (
                      <div className="flex items-center gap-3 p-4 rounded-2xl bg-secondary/30 border border-border/50">
                        <Blocks className="w-5 h-5 text-accent shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-muted-foreground mb-1">Transaction Hash</p>
                          <code className="font-mono text-xs text-foreground break-all">{complaint.txHash}</code>
                        </div>
                        <a
                          href={`https://sepolia.etherscan.io/tx/${complaint.txHash}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:text-primary/80 shrink-0"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* AI Verification */}
              <div className="glass-card rounded-3xl p-8 border border-border/50">
                <h4 className="font-display text-xl font-semibold mb-6 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Brain className="w-5 h-5 text-primary" />
                  </div>
                  AI Verification
                </h4>
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="p-6 rounded-2xl bg-secondary/30 border border-border/50">
                    <p className="text-sm text-muted-foreground mb-2">Evidence Status</p>
                    <p className={`font-bold text-lg ${complaint.isAuthentic ? "text-accent" : "text-destructive"}`}>
                      {complaint.isAuthentic ? "Verified Authentic" : "Flagged for Review"}
                    </p>
                  </div>
                  <div className="p-6 rounded-2xl bg-secondary/30 border border-border/50">
                    <p className="text-sm text-muted-foreground mb-2">Confidence Score</p>
                    <div className="flex items-center gap-3">
                      <p className="font-bold text-lg text-primary">{complaint.verificationConfidence || 0}%</p>
                      <div className="flex-1 h-2 rounded-full bg-secondary overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-primary to-accent rounded-full transition-all"
                          style={{ width: `${complaint.verificationConfidence || 0}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                {complaint.verificationRemarks && (
                  <div className="p-4 rounded-xl bg-secondary/20 border border-border/30">
                    <p className="text-sm text-muted-foreground">{complaint.verificationRemarks}</p>
                  </div>
                )}
              </div>

              {/* CID Timeline */}
              <div className="glass-card rounded-3xl p-8 border border-border/50">
                <h4 className="font-display text-xl font-semibold mb-8 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Blocks className="w-5 h-5 text-primary" />
                  </div>
                  Blockchain Timeline
                </h4>

                {/* CID History Table */}
                {complaint.cidHistory && complaint.cidHistory.length > 0 && (
                  <div className="mb-8 overflow-hidden rounded-2xl border border-border/50">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-border/50 bg-secondary/30">
                          <th className="p-3 text-left text-xs text-muted-foreground">Version</th>
                          <th className="p-3 text-left text-xs text-muted-foreground">CID</th>
                          <th className="p-3 text-left text-xs text-muted-foreground">Status</th>
                          <th className="p-3 text-left text-xs text-muted-foreground">Timestamp</th>
                        </tr>
                      </thead>
                      <tbody>
                        {complaint.cidHistory.map((h, i) => (
                          <tr key={i} className="border-b border-border/30 hover:bg-secondary/20 transition-colors">
                            <td className="p-3 font-mono text-xs text-muted-foreground">v{i + 1}</td>
                            <td className="p-3 font-mono text-xs text-primary max-w-xs truncate">{h.cid}</td>
                            <td className="p-3 text-xs capitalize text-foreground">{h.status}</td>
                            <td className="p-3 text-xs text-muted-foreground">{formatDate(h.timestamp)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {/* Event Timeline */}
                <div className="space-y-1">
                  {buildTimeline(complaint).map((event, index, arr) => {
                    const EventIcon = event.icon;
                    return (
                      <div key={index} className="flex gap-6 group">
                        <div className="relative flex flex-col items-center">
                          <div className={`w-12 h-12 rounded-2xl ${event.color} flex items-center justify-center shrink-0 transition-transform group-hover:scale-110`}>
                            <EventIcon className="w-5 h-5" />
                          </div>
                          {index < arr.length - 1 && (
                            <div className="w-0.5 h-12 bg-gradient-to-b from-border to-transparent mt-2" />
                          )}
                        </div>
                        <div className="flex-1 pb-8">
                          <p className="text-foreground font-medium text-lg">{event.event}</p>
                          <p className="text-sm text-muted-foreground mt-1">{formatDate(event.timestamp)}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>
          )}

          {/* Empty State */}
          {!complaint && !isSearching && (
            <div className="max-w-lg mx-auto text-center py-16">
              <div className="w-32 h-32 mx-auto rounded-full bg-secondary/30 flex items-center justify-center mb-8">
                <Search className="w-16 h-16 text-muted-foreground" />
              </div>
              <h3 className="font-display text-2xl font-semibold mb-4">Enter ID to Track</h3>
              <p className="text-muted-foreground mb-8 leading-relaxed">
                Enter your Report ID or Metadata CID above to view its current status
                and complete blockchain-verified timeline.
              </p>
              <div className="inline-flex items-center gap-2 text-sm text-muted-foreground">
                <Hash className="w-4 h-4 text-primary" />
                <span>Example: bafk1234… or report-abc123</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          )}

        </div>
      </div>
    </Layout>
  );
};

export default TrackComplaint;
