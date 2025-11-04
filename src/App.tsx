import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useSearchParams } from "react-router-dom";
import { DashboardLayout } from "./components/layout/DashboardLayout";
import Overview from "./pages/Overview";
import VTO from "./pages/VTO";
import VDR from "./pages/VDR";
import Integration from "./pages/Integration";
import Billing from "./pages/Billing";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const AppContent = () => {
  const [searchParams] = useSearchParams();
  const host = searchParams.get("host");

  // if(!host){
  //   return (
  //       <div style={{ padding: "2rem", textAlign: "center", fontFamily: "sans-serif", color: "#333" }}>
  //         <h1 style={{ fontSize: "1.5rem", fontWeight: "600" }}>UTRY Dashboard</h1>
  //         <p style={{ marginTop: "1rem" }}>This application is designed to be embedded within the Shopify Admin.</p>
  //         <p style={{ marginTop: "0.5rem" }}>To view your dashboard, please open the app from your Shopify store's "Apps" section.</p>
  //       </div>
  //   );
  // }

  return (
      <Routes>
        <Route element={<DashboardLayout />}>
          <Route path="/" element={<Overview />} />
          <Route path="/vto" element={<VTO />} />
          <Route path="/vdr" element={<VDR />} />
          <Route path="/integration" element={<Integration />} />
          <Route path="/billing" element={<Billing />} />
        </Route>
        {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
        <Route path="*" element={<NotFound />} />
      </Routes>
  );


}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
