import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  FileUp, 
  Shield, 
  Upload,
  CheckCircle,
  AlertCircle,
  Brain,
  HardDrive,
  Blocks,
  Copy,
  ArrowRight,
  Image,
  Video,
  Sparkles,
  Lock,
  Hash
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useComplaint } from "@/hooks/useComplaint";

type Step = "form" | "uploading" | "verifying" | "storing" | "complete";

interface VerificationResult {
  isAuthentic: boolean;
  confidence: number;
  remarks: string;
  verificationHash: string;
}

const ReportComplaint = () => {
  const [currentStep, setCurrentStep] = useState<Step>("form");
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    evidenceFile: null as File | null,
  });
  const [verificationResult, setVerificationResult] = useState<VerificationResult | null>(null);
  const [reportId, setReportId]       = useState<string>("");
  const [metadataCid, setMetadataCid] = useState<string>("");
  const [txHash, setTxHash]           = useState<string>("");

  const { submitReport, runAIAnimation, simulateRelayAnimation } = useComplaint();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData({ ...formData, evidenceFile: file });
    }
  };

  const processComplaint = async () => {
    if (!formData.description || !formData.evidenceFile) {
      toast({
        title: "Missing Information",
        description: "Please fill in the description and upload evidence.",
        variant: "destructive",
      });
      return;
    }

    try {
      // ── Step 1: Show "uploading" UI while kicking off real API + AI animation in parallel
      setCurrentStep("uploading");

      // Real backend call + AI animation run in parallel
      const [apiResult, aiResult] = await Promise.all([
        submitReport(
          formData.evidenceFile,
          formData.description,
          formData.title || undefined
        ),
        runAIAnimation(2200),
      ]);

      if (!apiResult.success) {
        throw new Error(apiResult.error || "Backend submission failed");
      }

      // Keep AI verification result for display
      setVerificationResult(aiResult);

      // ── Step 2: Show "verifying" UI briefly
      setCurrentStep("verifying");
      await new Promise(r => setTimeout(r, 800));

      // ── Step 3: Show "storing" UI + relay animation
      setCurrentStep("storing");
      await simulateRelayAnimation(1200);

      // ── Store real values from backend
      setReportId(apiResult.reportId);
      setMetadataCid(apiResult.metadataCid);
      setTxHash(apiResult.txHash);

      // ── Complete
      setCurrentStep("complete");
      toast({
        title: "Report Submitted Successfully",
        description: "Your report has been recorded on IPFS and the blockchain.",
      });
    } catch (error) {
      console.error("Submission error:", error);
      toast({
        title: "Submission Failed",
        description: error instanceof Error ? error.message : "An error occurred",
        variant: "destructive",
      });
      setCurrentStep("form");
    }
  };

  const copyToClipboard = (text: string, label = "Hash") => {
    navigator.clipboard.writeText(text);
    toast({ title: `${label} Copied`, description: "Copied to clipboard successfully." });
  };

  const resetForm = () => {
    setCurrentStep("form");
    setFormData({ title: "", description: "", evidenceFile: null });
    setVerificationResult(null);
    setReportId("");
    setMetadataCid("");
    setTxHash("");
  };

  const stepConfig = [
    { id: "form",      label: "Submit",   icon: FileUp   },
    { id: "uploading", label: "Upload",   icon: Upload   },
    { id: "verifying", label: "Verify",   icon: Brain    },
    { id: "storing",   label: "Store",    icon: HardDrive },
    { id: "complete",  label: "Complete", icon: Blocks   },
  ];

  return (
    <Layout>
      <div className="py-12 min-h-screen">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full glass-card border border-primary/30 mb-8">
              <Lock className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium">Anonymous &amp; Secure</span>
              <Shield className="w-4 h-4 text-accent" />
            </div>
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              <span className="text-foreground">Report</span>{" "}
              <span className="text-gradient">Anonymously</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Submit your complaint with evidence. All data is uploaded to IPFS
              via Pinata and recorded on the Sepolia blockchain.
            </p>
          </div>

          {/* Progress Steps */}
          <div className="max-w-4xl mx-auto mb-16">
            <div className="flex items-center justify-between relative">
              <div className="absolute top-6 left-0 right-0 h-0.5 bg-secondary" />
              <div
                className="absolute top-6 left-0 h-0.5 bg-gradient-to-r from-primary to-accent transition-all duration-500"
                style={{
                  width: `${(stepConfig.findIndex(s => s.id === currentStep) / (stepConfig.length - 1)) * 100}%`,
                }}
              />

              {stepConfig.map((step, index) => {
                const StepIcon = step.icon;
                const stepIndex = stepConfig.findIndex(s => s.id === currentStep);
                const isActive   = step.id === currentStep;
                const isComplete = index < stepIndex;

                return (
                  <div key={step.id} className="flex flex-col items-center relative z-10">
                    <div
                      className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300 ${
                        isComplete
                          ? "bg-accent text-accent-foreground shadow-lg"
                          : isActive
                          ? "bg-gradient-primary text-primary-foreground shadow-glow pulse-glow"
                          : "bg-secondary text-muted-foreground border border-border"
                      }`}
                    >
                      {isComplete ? (
                        <CheckCircle className="w-6 h-6" />
                      ) : (
                        <StepIcon className="w-5 h-5" />
                      )}
                    </div>
                    <span className={`text-xs mt-3 font-medium ${isActive ? "text-primary" : "text-muted-foreground"}`}>
                      {step.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Main Content */}
          <div className="max-w-2xl mx-auto">

            {/* ── FORM ────────────────────────────────────────── */}
            {currentStep === "form" && (
              <div className="glass-card rounded-3xl p-8 md:p-10 border border-border/50 fade-in-up shadow-elevated">
                <div className="space-y-8">
                  {/* Title (optional) */}
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-3">
                      Report Title <span className="text-muted-foreground text-xs">(optional)</span>
                    </label>
                    <Input
                      placeholder="Brief title describing the issue…"
                      value={formData.title}
                      onChange={e => setFormData({ ...formData, title: e.target.value })}
                      className="h-12"
                    />
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-3">
                      Description <span className="text-destructive">*</span>
                    </label>
                    <Textarea
                      placeholder="Provide detailed information about your complaint…"
                      value={formData.description}
                      onChange={e => setFormData({ ...formData, description: e.target.value })}
                      className="min-h-[160px]"
                    />
                  </div>

                  {/* File Upload */}
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-3">
                      Upload Evidence <span className="text-destructive">*</span>
                    </label>
                    <div className="relative border-2 border-dashed border-border rounded-2xl p-10 text-center hover:border-primary/50 transition-all duration-300 bg-secondary/20 group">
                      <input
                        type="file"
                        accept="image/*,video/*"
                        onChange={handleFileChange}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                      {formData.evidenceFile ? (
                        <div className="space-y-3">
                          <div className="w-16 h-16 mx-auto rounded-2xl bg-accent/20 flex items-center justify-center">
                            <CheckCircle className="w-8 h-8 text-accent" />
                          </div>
                          <p className="text-foreground font-semibold">{formData.evidenceFile.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {(formData.evidenceFile.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          <div className="w-20 h-20 mx-auto rounded-2xl bg-secondary/50 flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                            <Upload className="w-10 h-10 text-muted-foreground group-hover:text-primary transition-colors" />
                          </div>
                          <div>
                            <p className="text-foreground font-medium text-lg">Drag &amp; drop or click to upload</p>
                            <p className="text-sm text-muted-foreground mt-1">Supports images and videos (Max 50 MB)</p>
                          </div>
                          <div className="flex items-center justify-center gap-6 text-muted-foreground">
                            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/50">
                              <Image className="w-4 h-4" />
                              <span className="text-xs">Images</span>
                            </div>
                            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/50">
                              <Video className="w-4 h-4" />
                              <span className="text-xs">Videos</span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <Button
                    variant="hero"
                    size="xl"
                    className="w-full gap-3"
                    onClick={processComplaint}
                    disabled={!formData.description || !formData.evidenceFile}
                  >
                    <Sparkles className="w-5 h-5" />
                    Submit Anonymously
                    <ArrowRight className="w-5 h-5" />
                  </Button>

                  <p className="text-xs text-center text-muted-foreground leading-relaxed">
                    Evidence is uploaded to IPFS via Pinata and recorded on Sepolia via gasless relayer. No wallet needed.
                  </p>
                </div>
              </div>
            )}

            {/* ── LOADING STATES ──────────────────────────────── */}
            {(currentStep === "uploading" || currentStep === "verifying" || currentStep === "storing") && (
              <div className="glass-card rounded-3xl p-16 border border-border/50 text-center fade-in-up">
                <div className="relative w-24 h-24 mx-auto mb-8">
                  <div className="absolute inset-0 rounded-full border-4 border-secondary" />
                  <div className="absolute inset-0 rounded-full border-4 border-primary border-t-transparent animate-spin" />
                  <div className="absolute inset-3 rounded-full bg-primary/10 flex items-center justify-center">
                    {currentStep === "uploading" && <Upload   className="w-8 h-8 text-primary" />}
                    {currentStep === "verifying" && <Brain    className="w-8 h-8 text-primary" />}
                    {currentStep === "storing"   && <HardDrive className="w-8 h-8 text-primary" />}
                  </div>
                </div>
                <h3 className="font-display text-2xl font-semibold mb-3">
                  {currentStep === "uploading" && "Uploading to IPFS…"}
                  {currentStep === "verifying" && "AI Verification in Progress…"}
                  {currentStep === "storing"   && "Recording on Blockchain…"}
                </h3>
                <p className="text-muted-foreground max-w-md mx-auto">
                  {currentStep === "uploading" && "Securely uploading your evidence to IPFS via Pinata."}
                  {currentStep === "verifying" && "Analysing evidence for authenticity using AI."}
                  {currentStep === "storing"   && "Recording CID on Sepolia blockchain via gasless relayer."}
                </p>
              </div>
            )}

            {/* ── COMPLETE ─────────────────────────────────────── */}
            {currentStep === "complete" && (
              <div className="space-y-6 fade-in-up">
                <div className="glass-card rounded-3xl p-10 border border-accent/30 text-center relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-accent/10 to-transparent" />

                  <div className="relative z-10">
                    <div className="w-24 h-24 mx-auto rounded-full bg-accent/20 flex items-center justify-center mb-8">
                      <CheckCircle className="w-12 h-12 text-accent" />
                    </div>
                    <h3 className="font-display text-3xl font-bold mb-3">Report Submitted!</h3>
                    <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                      Your report has been recorded on IPFS and the Sepolia blockchain.
                    </p>

                    {/* Report ID */}
                    {reportId && (
                      <div className="bg-secondary/30 rounded-2xl p-6 mb-4 border border-border/50">
                        <p className="text-sm text-muted-foreground mb-3">Report ID</p>
                        <div className="flex items-center gap-3 justify-center bg-background/50 rounded-xl p-4">
                          <Hash className="w-4 h-4 text-primary shrink-0" />
                          <code className="text-primary font-mono text-sm break-all">{reportId}</code>
                          <Button variant="ghost" size="icon" onClick={() => copyToClipboard(reportId, "Report ID")} className="shrink-0">
                            <Copy className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    )}

                    {/* Metadata CID */}
                    {metadataCid && (
                      <div className="bg-secondary/30 rounded-2xl p-6 mb-4 border border-border/50">
                        <p className="text-sm text-muted-foreground mb-3">Metadata CID (use to track report)</p>
                        <div className="flex items-center gap-3 justify-center bg-background/50 rounded-xl p-4">
                          <code className="text-primary font-mono text-sm break-all">{metadataCid}</code>
                          <Button variant="ghost" size="icon" onClick={() => copyToClipboard(metadataCid, "Metadata CID")} className="shrink-0">
                            <Copy className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    )}

                    {/* TX Hash */}
                    {txHash && (
                      <div className="bg-secondary/30 rounded-2xl p-6 mb-8 border border-border/50">
                        <p className="text-sm text-muted-foreground mb-3">Blockchain Transaction</p>
                        <div className="flex items-center gap-3 justify-center bg-background/50 rounded-xl p-4">
                          <code className="text-accent font-mono text-xs break-all">{txHash}</code>
                          <Button variant="ghost" size="icon" onClick={() => copyToClipboard(txHash, "TX Hash")} className="shrink-0">
                            <Copy className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    )}

                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-warning/10 text-warning text-sm">
                      <AlertCircle className="w-4 h-4" />
                      Save the Report ID or CID — it's your only way to track your complaint.
                    </div>
                  </div>
                </div>

                {/* AI Verification Card */}
                {verificationResult && (
                  <div className="glass-card rounded-3xl p-8 border border-border/50">
                    <h4 className="font-display text-xl font-semibold mb-6 flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                        <Brain className="w-5 h-5 text-primary" />
                      </div>
                      AI Verification Result
                    </h4>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="text-center p-5 rounded-2xl bg-secondary/30 border border-border/50">
                        <p className="text-sm text-muted-foreground mb-2">Status</p>
                        <p className={`font-semibold text-lg ${verificationResult.isAuthentic ? "text-accent" : "text-destructive"}`}>
                          {verificationResult.isAuthentic ? "Authentic" : "Suspicious"}
                        </p>
                      </div>
                      <div className="text-center p-5 rounded-2xl bg-secondary/30 border border-border/50">
                        <p className="text-sm text-muted-foreground mb-2">Confidence</p>
                        <p className="font-semibold text-lg text-primary">{verificationResult.confidence}%</p>
                      </div>
                      <div className="text-center p-5 rounded-2xl bg-secondary/30 border border-border/50">
                        <p className="text-sm text-muted-foreground mb-2">AI Hash</p>
                        <p className="font-mono text-xs text-foreground">{verificationResult.verificationHash.slice(0, 10)}…</p>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mt-6 p-4 rounded-xl bg-secondary/20 border border-border/30">
                      {verificationResult.remarks}
                    </p>
                  </div>
                )}

                <div className="flex gap-4">
                  <Button variant="outline" size="lg" className="flex-1" onClick={resetForm}>
                    Submit Another
                  </Button>
                  <Button variant="hero" size="lg" className="flex-1" asChild>
                    <a href="/track">Track Complaint</a>
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ReportComplaint;
