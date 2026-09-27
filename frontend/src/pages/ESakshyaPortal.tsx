import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AdminAuth } from "@/components/auth/AdminAuth";
import { 
  Building2,
  Search,
  FileText,
  CheckCircle,
  Clock,
  AlertTriangle,
  ExternalLink,
  Hash,
  Brain,
  Blocks,
  Eye,
  Shield,
  Scale
} from "lucide-react";

type Status = "pending" | "under_review" | "action_taken" | "closed";

interface GovComplaint {
  id: string;
  registrationNo: string;
  cid: string;
  title: string;
  category: string;
  status: Status;
  receivedAt: string;
  department: string;
  aiVerified: boolean;
  blockchainTxHash: string;
}

const mockGovComplaints: GovComplaint[] = [
  {
    id: "1",
    registrationNo: "ESK-2024-001547",
    cid: "QmXnny1234567890abcdef",
    title: "Infrastructure Safety Concern - Highway Bridge",
    category: "Public Infrastructure",
    status: "under_review",
    receivedAt: "2024-01-15T10:33:00Z",
    department: "Public Works Department",
    aiVerified: true,
    blockchainTxHash: "0x7a2b3c4d5e6f7890abcdef1234567890abcdef12",
  },
  {
    id: "2",
    registrationNo: "ESK-2024-001546",
    cid: "QmYbbc9876543210fedcba",
    title: "Environmental Violation - Industrial Waste",
    category: "Environment",
    status: "action_taken",
    receivedAt: "2024-01-14T15:50:00Z",
    department: "Environment Protection Agency",
    aiVerified: true,
    blockchainTxHash: "0x1234567890abcdef7890abcdef1234567890abcd",
  },
  {
    id: "3",
    registrationNo: "ESK-2024-001548",
    cid: "QmZccx5678901234ghijkl",
    title: "Public Service Complaint - Water Supply",
    category: "Public Utilities",
    status: "pending",
    receivedAt: "2024-01-16T08:25:00Z",
    department: "Water Resources Department",
    aiVerified: true,
    blockchainTxHash: "0xabcdef1234567890abcdef1234567890abcdef12",
  },
  {
    id: "4",
    registrationNo: "ESK-2024-001540",
    cid: "QmAbcd1234mnopqrstuv",
    title: "Corruption Report - Government Office",
    category: "Anti-Corruption",
    status: "closed",
    receivedAt: "2024-01-10T11:05:00Z",
    department: "Anti-Corruption Bureau",
    aiVerified: true,
    blockchainTxHash: "0x567890abcdef1234567890abcdef1234567890ab",
  },
];

const statusConfig: Record<Status, { label: string; color: string; icon: React.ElementType }> = {
  pending: { label: "Pending Review", color: "text-warning bg-warning/10 border-warning/30", icon: Clock },
  under_review: { label: "Under Review", color: "text-primary bg-primary/10 border-primary/30", icon: AlertTriangle },
  action_taken: { label: "Action Taken", color: "text-accent bg-accent/10 border-accent/30", icon: CheckCircle },
  closed: { label: "Closed", color: "text-green-400 bg-green-500/10 border-green-500/30", icon: CheckCircle },
};

const ESakshyaPortal = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedComplaint, setSelectedComplaint] = useState<GovComplaint | null>(null);

  const filteredComplaints = mockGovComplaints.filter((c) =>
    c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.registrationNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.cid.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <AdminAuth 
      portalName="e-Sakshya Portal" 
      portalIcon={<Scale className="w-6 h-6 text-amber-500" />}
    >
      <Layout>
        <div className="py-8 min-h-screen">
          <div className="container mx-auto px-4">
            {/* Government Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-3 mb-6">
              <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center">
                <Scale className="w-8 h-8 text-white" />
              </div>
              <div className="text-left">
                <h1 className="font-display text-2xl md:text-3xl font-bold text-foreground">
                  e-Sakshya Portal
                </h1>
                <p className="text-sm text-muted-foreground">
                  Government Evidence Management System
                </p>
              </div>
            </div>
            <div className="flex items-center justify-center gap-4 flex-wrap">
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/30">
                <Building2 className="w-4 h-4 text-amber-500" />
                <span className="text-sm text-amber-500">Official Portal</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 border border-accent/30">
                <Blocks className="w-4 h-4 text-accent" />
                <span className="text-sm text-accent">Blockchain Verified</span>
              </div>
            </div>
          </div>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto mb-8">
            <div className="glass-card rounded-xl p-4 border border-border/50">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  placeholder="Search by Registration No, CID, or Title..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 h-12"
                />
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {[
              { label: "Total Enrolled", value: mockGovComplaints.length, icon: FileText },
              { label: "Under Review", value: mockGovComplaints.filter(c => c.status === "under_review").length, icon: Clock },
              { label: "Action Taken", value: mockGovComplaints.filter(c => c.status === "action_taken").length, icon: CheckCircle },
              { label: "Closed", value: mockGovComplaints.filter(c => c.status === "closed").length, icon: Shield },
            ].map((stat, index) => (
              <div key={index} className="glass-card rounded-xl p-4 border border-amber-500/20">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center">
                    <stat.icon className="w-5 h-5 text-amber-500" />
                  </div>
                  <div>
                    <p className="font-display text-xl font-bold text-foreground">{stat.value}</p>
                    <p className="text-xs text-muted-foreground">{stat.label}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Complaints Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* List */}
            <div className="space-y-4">
              <h2 className="font-display text-lg font-semibold text-foreground flex items-center gap-2">
                <FileText className="w-5 h-5 text-amber-500" />
                Enrolled Complaints
              </h2>
              {filteredComplaints.map((complaint) => {
                const StatusIcon = statusConfig[complaint.status].icon;
                return (
                  <div
                    key={complaint.id}
                    onClick={() => setSelectedComplaint(complaint)}
                    className={`glass-card rounded-xl p-4 border cursor-pointer transition-all duration-300 ${
                      selectedComplaint?.id === complaint.id
                        ? "border-amber-500/50 shadow-glow"
                        : "border-border/50 hover:border-amber-500/30"
                    }`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <p className="text-xs font-mono text-amber-500 mb-1">
                          {complaint.registrationNo}
                        </p>
                        <h3 className="font-medium text-foreground text-sm line-clamp-1">
                          {complaint.title}
                        </h3>
                      </div>
                      <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs ${statusConfig[complaint.status].color}`}>
                        <StatusIcon className="w-3 h-3" />
                        {statusConfig[complaint.status].label}
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>{complaint.department}</span>
                      <span>{new Date(complaint.receivedAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Detail View */}
            <div>
              {selectedComplaint ? (
                <div className="glass-card rounded-xl border border-amber-500/20 p-6 sticky top-24 fade-in-up">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="font-display text-lg font-semibold text-foreground">
                      Complaint Details
                    </h2>
                    <Button variant="ghost" size="sm" className="gap-2">
                      <ExternalLink className="w-4 h-4" />
                      View Full
                    </Button>
                  </div>

                  <div className="space-y-4">
                    {/* Registration Info */}
                    <div className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/20">
                      <p className="text-xs text-muted-foreground mb-1">Registration Number</p>
                      <p className="font-display text-lg font-bold text-amber-500">
                        {selectedComplaint.registrationNo}
                      </p>
                    </div>

                    {/* Details Grid */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Category</p>
                        <p className="text-sm text-foreground">{selectedComplaint.category}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Department</p>
                        <p className="text-sm text-foreground">{selectedComplaint.department}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Received</p>
                        <p className="text-sm text-foreground">
                          {formatDate(selectedComplaint.receivedAt)}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Status</p>
                        <p className={`text-sm ${statusConfig[selectedComplaint.status].color.split(" ")[0]}`}>
                          {statusConfig[selectedComplaint.status].label}
                        </p>
                      </div>
                    </div>

                    {/* Blockchain Info */}
                    <div className="space-y-3 pt-4 border-t border-border/50">
                      <div className="flex items-center gap-2 text-sm">
                        <Hash className="w-4 h-4 text-primary" />
                        <span className="text-muted-foreground">IPFS CID:</span>
                        <code className="text-xs font-mono text-primary">
                          {selectedComplaint.cid.slice(0, 20)}...
                        </code>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Blocks className="w-4 h-4 text-accent" />
                        <span className="text-muted-foreground">TX Hash:</span>
                        <code className="text-xs font-mono text-accent">
                          {selectedComplaint.blockchainTxHash.slice(0, 20)}...
                        </code>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Brain className="w-4 h-4 text-success" />
                        <span className="text-muted-foreground">AI Verified:</span>
                        <span className="text-success">
                          {selectedComplaint.aiVerified ? "Yes" : "No"}
                        </span>
                      </div>
                    </div>

                    {/* Title */}
                    <div className="pt-4 border-t border-border/50">
                      <p className="text-xs text-muted-foreground mb-2">Complaint Title</p>
                      <p className="text-foreground">{selectedComplaint.title}</p>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3 pt-4">
                      <Button variant="outline" className="flex-1 gap-2">
                        <Eye className="w-4 h-4" />
                        View Evidence
                      </Button>
                      <Button variant="glass" className="flex-1 gap-2">
                        <Blocks className="w-4 h-4" />
                        Verify on Chain
                      </Button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="glass-card rounded-xl border border-border/50 p-12 text-center">
                  <Building2 className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                  <h3 className="font-display text-lg font-semibold mb-2">Select a Complaint</h3>
                  <p className="text-sm text-muted-foreground">
                    Click on a complaint from the list to view its full details
                    and blockchain verification status.
                  </p>
                </div>
              )}
            </div>
            </div>
          </div>
        </div>
      </Layout>
    </AdminAuth>
  );
};

export default ESakshyaPortal;
