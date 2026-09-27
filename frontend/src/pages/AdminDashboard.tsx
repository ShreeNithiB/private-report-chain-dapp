import { useState, useEffect } from "react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AdminAuth } from "@/components/auth/AdminAuth";
import { useComplaint, UpdateReportPayload } from "@/hooks/useComplaint";
import {
  LayoutDashboard,
  FileText,
  CheckCircle,
  Clock,
  AlertTriangle,
  Search,
  Eye,
  ChevronRight,
  TrendingUp,
  Users,
  Shield,
  Loader2,
  RefreshCw,
  Upload,
  X,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";

type Status = "pending" | "submitted" | "verified" | "investigating" | "resolved";

interface Complaint {
  id: string;
  cidHash: string;
  title?: string;
  status: Status;
  createdAt: string;
  verificationConfidence: number;
  description?: string;
}

// Modal for updating a report
interface UpdateModalProps {
  complaint: Complaint;
  onClose: () => void;
  onSuccess: () => void;
}

const UpdateModal = ({ complaint, onClose, onSuccess }: UpdateModalProps) => {
  const [notes, setNotes]   = useState("");
  const [status, setStatus] = useState<Status>(complaint.status);
  const [file, setFile]     = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const { updateReport } = useComplaint();

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const payload: UpdateReportPayload = {
        reportId: complaint.id,
        notes,
        status,
        ...(file ? { file } : {}),
      };
      const result = await updateReport(payload);
      if (!result.success) throw new Error(result.error);

      toast({
        title: "Report Updated",
        description: result.newCid
          ? `New CID: ${result.newCid.slice(0, 20)}…`
          : "Status updated successfully.",
      });
      onSuccess();
      onClose();
    } catch (err) {
      toast({
        title: "Update Failed",
        description: err instanceof Error ? err.message : "Unknown error",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="glass-card rounded-3xl p-8 border border-border/50 w-full max-w-md mx-4 fade-in-up">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-display text-xl font-bold">Update Report</h3>
          <Button variant="ghost" size="icon" onClick={onClose}><X className="w-5 h-5" /></Button>
        </div>

        <div className="space-y-5">
          <div>
            <label className="text-sm font-medium text-foreground block mb-2">New Status</label>
            <select
              value={status}
              onChange={e => setStatus(e.target.value as Status)}
              className="w-full h-10 px-3 rounded-xl bg-secondary/50 border border-border text-foreground text-sm"
            >
              {(["pending","submitted","verified","investigating","resolved"] as Status[]).map(s => (
                <option key={s} value={s} className="bg-card capitalize">{s}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-sm font-medium text-foreground block mb-2">Notes</label>
            <textarea
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="Add investigation notes…"
              className="w-full min-h-[100px] px-3 py-2 rounded-xl bg-secondary/50 border border-border text-foreground text-sm resize-none"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-foreground block mb-2">
              Upload New Evidence <span className="text-muted-foreground text-xs">(optional)</span>
            </label>
            <div className="relative border-2 border-dashed border-border rounded-xl p-4 text-center hover:border-primary/50 transition-colors">
              <input
                type="file"
                accept="image/*,video/*"
                onChange={e => setFile(e.target.files?.[0] || null)}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              {file ? (
                <p className="text-sm text-foreground">{file.name}</p>
              ) : (
                <div className="flex items-center justify-center gap-2 text-muted-foreground">
                  <Upload className="w-4 h-4" />
                  <span className="text-sm">Click to upload</span>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex gap-3 mt-8">
          <Button variant="outline" className="flex-1" onClick={onClose} disabled={loading}>Cancel</Button>
          <Button variant="hero" className="flex-1" onClick={handleSubmit} disabled={loading}>
            {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
            Update Report
          </Button>
        </div>
      </div>
    </div>
  );
};

// ─── Status config ──────────────────────────────────────────────────────────

const statusConfig: Record<Status, { label: string; color: string; bgColor: string }> = {
  pending:      { label: "Pending",      color: "text-warning",     bgColor: "bg-warning/20"  },
  submitted:    { label: "Submitted",    color: "text-primary",     bgColor: "bg-primary/20"  },
  verified:     { label: "Verified",     color: "text-accent",      bgColor: "bg-accent/20"   },
  investigating:{ label: "Investigating",color: "text-primary",     bgColor: "bg-primary/20"  },
  resolved:     { label: "Resolved",     color: "text-green-400",   bgColor: "bg-green-500/20"},
};

// ─── Main component ──────────────────────────────────────────────────────────

const AdminDashboard = () => {
  const [complaints, setComplaints]     = useState<Complaint[]>([]);
  const [searchQuery, setSearchQuery]   = useState("");
  const [filterStatus, setFilterStatus] = useState<Status | "all">("all");
  const [loading, setLoading]           = useState(true);
  const [selected, setSelected]         = useState<Complaint | null>(null);

  const { getAllReports } = useComplaint();

  const fetchReports = async () => {
    setLoading(true);
    try {
      const data = await getAllReports();
      setComplaints(data as unknown as Complaint[]);
    } catch {
      toast({ title: "Failed to load reports", description: "Backend may be offline.", variant: "destructive" });
      setComplaints([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchReports(); }, []);

  const stats = {
    total:        complaints.length,
    pending:      complaints.filter(c => c.status === "pending").length,
    investigating:complaints.filter(c => c.status === "investigating").length,
    resolved:     complaints.filter(c => c.status === "resolved").length,
  };

  const filteredComplaints = complaints.filter(c => {
    const matchesSearch =
      (c.title || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.cidHash.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterStatus === "all" || c.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

  return (
    <AdminAuth portalName="Admin Dashboard" portalIcon={<LayoutDashboard className="w-6 h-6 text-primary" />}>
      <Layout>
        <div className="py-8 min-h-screen">
          <div className="container mx-auto px-4">

            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
              <div>
                <h1 className="font-display text-2xl md:text-3xl font-bold flex items-center gap-3">
                  <LayoutDashboard className="w-8 h-8 text-primary" />
                  <span className="text-gradient">Admin Dashboard</span>
                </h1>
                <p className="text-muted-foreground mt-1">Manage and review all submitted reports</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card border border-primary/30">
                  <Shield className="w-4 h-4 text-primary" />
                  <span className="text-sm font-medium">Admin Access</span>
                </div>
                <Button variant="outline" size="sm" onClick={fetchReports} disabled={loading} className="gap-2">
                  <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
                  Refresh
                </Button>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {[
                { label: "Total Reports",  value: stats.total,        icon: FileText,     color: "text-primary" },
                { label: "Pending Review", value: stats.pending,      icon: Clock,        color: "text-warning" },
                { label: "Investigating",  value: stats.investigating, icon: AlertTriangle,color: "text-primary" },
                { label: "Resolved",       value: stats.resolved,     icon: CheckCircle,  color: "text-accent"  },
              ].map((stat, i) => (
                <div key={i} className="glass-card rounded-xl p-4 border border-border/50">
                  <div className="flex items-center justify-between mb-2">
                    <stat.icon className={`w-5 h-5 ${stat.color}`} />
                    <TrendingUp className="w-4 h-4 text-accent" />
                  </div>
                  <p className="font-display text-2xl font-bold text-foreground">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                </div>
              ))}
            </div>

            {/* Search & Filter */}
            <div className="glass-card rounded-xl p-4 border border-border/50 mb-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by title, ID, or CID…"
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <div className="flex gap-2 flex-wrap">
                  <Button variant={filterStatus === "all" ? "secondary" : "ghost"} size="sm" onClick={() => setFilterStatus("all")}>All</Button>
                  {(Object.keys(statusConfig) as Status[]).map(s => (
                    <Button key={s} variant={filterStatus === s ? "secondary" : "ghost"} size="sm" onClick={() => setFilterStatus(s)} className="gap-2">
                      <div className={`w-2 h-2 rounded-full ${statusConfig[s].bgColor}`} />
                      {statusConfig[s].label}
                    </Button>
                  ))}
                </div>
              </div>
            </div>

            {/* Table */}
            <div className="glass-card rounded-xl border border-border/50 overflow-hidden">
              {loading ? (
                <div className="flex items-center justify-center py-16 gap-3 text-muted-foreground">
                  <Loader2 className="w-6 h-6 animate-spin" />
                  <span>Loading reports from backend…</span>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border/50">
                        <th className="text-left p-4 text-sm font-medium text-muted-foreground">ID / CID</th>
                        <th className="text-left p-4 text-sm font-medium text-muted-foreground">Title</th>
                        <th className="text-left p-4 text-sm font-medium text-muted-foreground">Status</th>
                        <th className="text-left p-4 text-sm font-medium text-muted-foreground">AI Score</th>
                        <th className="text-left p-4 text-sm font-medium text-muted-foreground">Date</th>
                        <th className="text-left p-4 text-sm font-medium text-muted-foreground">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredComplaints.map(c => (
                        <tr key={c.id} className="border-b border-border/30 hover:bg-secondary/30 transition-colors">
                          <td className="p-4">
                            <code className="text-xs font-mono text-primary">
                              {(c.id || c.cidHash).slice(0, 14)}…
                            </code>
                          </td>
                          <td className="p-4">
                            <p className="text-sm text-foreground font-medium max-w-xs truncate">
                              {c.title || "Untitled Report"}
                            </p>
                          </td>
                          <td className="p-4">
                            <span className={`text-xs px-3 py-1.5 rounded-full ${statusConfig[c.status]?.bgColor} ${statusConfig[c.status]?.color}`}>
                              {statusConfig[c.status]?.label ?? c.status}
                            </span>
                          </td>
                          <td className="p-4">
                            <div className="flex items-center gap-2">
                              <div className="w-12 h-1.5 rounded-full bg-secondary overflow-hidden">
                                <div className="h-full bg-accent rounded-full" style={{ width: `${c.verificationConfidence || 0}%` }} />
                              </div>
                              <span className="text-xs text-muted-foreground">{c.verificationConfidence || 0}%</span>
                            </div>
                          </td>
                          <td className="p-4 text-sm text-muted-foreground">{formatDate(c.createdAt)}</td>
                          <td className="p-4">
                            <Button variant="ghost" size="sm" className="gap-1" onClick={() => setSelected(c)}>
                              <Eye className="w-4 h-4" />
                              Update
                              <ChevronRight className="w-3 h-3" />
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  {filteredComplaints.length === 0 && !loading && (
                    <div className="text-center py-12">
                      <Users className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                      <p className="text-muted-foreground">
                        {complaints.length === 0
                          ? "No reports yet. Backend may be offline or no reports submitted."
                          : "No reports match your search."}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>

          </div>
        </div>
      </Layout>

      {/* Update Modal */}
      {selected && (
        <UpdateModal
          complaint={selected}
          onClose={() => setSelected(null)}
          onSuccess={fetchReports}
        />
      )}
    </AdminAuth>
  );
};

export default AdminDashboard;
