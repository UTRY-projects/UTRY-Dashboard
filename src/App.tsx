import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useSearchParams } from "react-router-dom";
import { useAppBridge } from "@shopify/app-bridge-react";
import { DashboardLayout } from "./components/layout/DashboardLayout";
import Overview from "./pages/Overview";
import VTO from "./pages/VTO";
import VDR from "./pages/VDR";
import Integration from "./pages/Integration";
import Billing from "./pages/Billing";
import NotFound from "./pages/NotFound";
import { useState, useEffect } from "react";

const queryClient = new QueryClient();

const ShopifyParamWatcher = ({ children }) => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [paramsReady, setParamsReady] = useState(false);

    useEffect(() => {
        if (searchParams.has('shop')) {
            setParamsReady(true);
            return;
        }

        let attempts = 0;
        const interval = setInterval(() => {
            const currentUrlParams = new URLSearchParams(window.location.search);
            attempts++;

            if (currentUrlParams.has('shop')) {
                clearInterval(interval);
                setSearchParams(currentUrlParams, { replace: true });
                setParamsReady(true);
            } else if (attempts > 30) {
                clearInterval(interval);
                setParamsReady(true);
            }
        }, 100);

        return () => clearInterval(interval);
    }, [searchParams, setSearchParams]);

    return paramsReady ? <>{children}</> : null;
};

const AppContent = () => {
    // You can use useAppBridge in any component that needs App Bridge features
    // Example usage:
    // const shopify = useAppBridge();
    // shopify.toast.show('Hello from App Bridge!');

    return (
        <Routes>
            <Route element={<DashboardLayout />}>
                <Route path="/" element={<Overview />} />
                <Route path="/vto" element={<VTO />} />
                <Route path="/vdr" element={<VDR />} />
                <Route path="/integration" element={<Integration />} />
                <Route path="/billing" element={<Billing />} />
            </Route>
            <Route path="*" element={<NotFound />} />
        </Routes>
    );
};

const baseName = import.meta.env.BASE_URL;
(window as any).__BASE_URL__ = import.meta.env.BASE_URL;


const App = () => (
    <BrowserRouter basename={baseName}>
    <QueryClientProvider client={queryClient}>
        <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
                <ShopifyParamWatcher>
                    <AppContent />
                </ShopifyParamWatcher>
            </BrowserRouter>
        </TooltipProvider>
    </QueryClientProvider>
    </BrowserRouter>
);

export default App;