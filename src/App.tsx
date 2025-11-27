import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HashRouter, Routes, Route, useSearchParams } from "react-router-dom";
import { createApp } from "@shopify/app-bridge"; // 1. Import the createApp function
import { DashboardLayout } from "./components/layout/DashboardLayout";
import Overview from "@/pages/Overview";
import VDR from "./pages/VDR";
import Integration from "./pages/Integration";
import Billing from "./pages/Billing";
import NotFound from "./pages/NotFound";
import { useMemo } from "react";
import UIExplanation from "@/pages/UIExplanation.tsx";

const queryClient = new QueryClient();

// This new component's only job is to create the App Bridge instance
// and pass it down to your layout.
const AppInitializer = () => {
    const searchParams = new URLSearchParams(window.location.search);
    const host = searchParams.get("host");
    const shop = searchParams.get("shop");

    console.log("--- AppInitializer Rendered ---");
    console.log("Current window.location.href:", window.location.href);
    console.log("Host from searchParams:", host);

    // IMPORTANT: You must get your Shopify App's API key from your environment variables.
    const apiKey = "6feca39509df11b363bb0a7300580b2f"; // <-- REPLACE THIS with your actual key

    // useMemo prevents the app instance from being recreated on every render.
    const appBridgeInstance = useMemo(() => {
        console.log(apiKey);
        if (!host || !apiKey) {
            return null;
        }
        const config = {
            apiKey,
            host,
            forceRedirect: true,
        };
        // 2. Manually create the App Bridge instance
        return createApp(config);
    }, [host, apiKey]);

    if (!appBridgeInstance) {
        return (
            <div style={{ padding: '20px' }}>
                <h2>App Configuration Error</h2>
                <p>Could not find required Shopify configuration. Ensure you are opening the app from within the Shopify admin and have set your API key.</p>

                {/* --- DEBUG VIEW --- */}
                <pre style={{ marginTop: '20px', background: '#eee', padding: '10px', whiteSpace: 'pre-wrap', wordBreak: 'break-all', border: '1px solid #ccc' }}>
                    <strong style={{ display: 'block', marginBottom: '5px' }}>Debug Info:</strong>
                    <strong>URL:</strong> {window.location.href}
                    <br />
                    <strong>Host Param:</strong> {host || 'Not Found'}
                    <br />
                    <strong>API Key:</strong> {apiKey ? 'Loaded' : 'Not Found'}
                </pre>
                {/* --- END DEBUG VIEW --- */}
            </div>
        );
    }

    return (
        <Routes>
            {/* 3. Pass the created instance as a prop to your DashboardLayout */}
            <Route element={<DashboardLayout app={appBridgeInstance} shop={shop} />}>
                <Route path="/" element={<Overview />} />
                <Route path="/vdr" element={<VDR />} />
                <Route path="/integration" element={<Integration />} />
                <Route path="/billing" element={<Billing />} />
                <Route path="/UIExplanation" element={<UIExplanation />} />
            </Route>
            <Route path="*" element={<NotFound />} />
        </Routes>
    );
};

// The main App component now uses the Initializer.
const App = () => (
    <QueryClientProvider client={queryClient}>
        <TooltipProvider>
            <Toaster />
            <Sonner />
            <HashRouter>
                {/* We no longer need ShopifyParamWatcher, as this handles the params directly. */}
                <AppInitializer />
            </HashRouter>
        </TooltipProvider>
    </QueryClientProvider>
);

export default App;