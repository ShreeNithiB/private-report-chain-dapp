import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { WalletProvider } from "@/components/wallet/WalletProvider";
import Index from "./pages/Index";
import ReportComplaint from "./pages/ReportComplaint";
import TrackComplaint from "./pages/TrackComplaint";
import AdminDashboard from "./pages/AdminDashboard";
import ESakshyaPortal from "./pages/ESakshyaPortal";
import NotFound from "./pages/NotFound";

const App = () => (
  <WalletProvider>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/report" element={<ReportComplaint />} />
          <Route path="/track" element={<TrackComplaint />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/esakshya" element={<ESakshyaPortal />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </WalletProvider>
);

export default App;
