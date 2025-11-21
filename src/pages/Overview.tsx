import { useEffect, useMemo, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAppBridge } from "@shopify/app-bridge-react";
import { Eye, Package, Loader2 } from "lucide-react"; // Added Loader2
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import { DateRange } from "react-day-picker";
import { useAuthenticatedApi, AuthError } from "@/lib/api"; // Import AuthError
import { startOfMonth, format } from "date-fns";

// ... (Keep ContextType, getCurrentMonthRange, isRecord, toFiniteNumber, DailyUsage helpers) ...
interface ContextType {
    productFilter: "all" | "vto" | "vdr";
    dateRange: DateRange | undefined;
}
const getCurrentMonthRange = (): DateRange => {
    const today = new Date();
    return { from: startOfMonth(today), to: today };
};
function isRecord(value: unknown): value is Record<string, unknown> {
    return typeof value === "object" && value !== null;
}
function toFiniteNumber(input: unknown): number {
    if (typeof input === "number") return Number.isFinite(input) ? input : 0;
    if (typeof input === "string") { const n = Number(input); return Number.isFinite(n) ? n : 0; }
    if (isRecord(input)) {
        if ("data" in input) return toFiniteNumber((input as { data: unknown }).data);
        if ("total" in input) return toFiniteNumber((input as { total: unknown }).total);
        if ("count" in input) return toFiniteNumber((input as { count: unknown }).count);
    }
    return 0;
}
type DailyUsage = { date: string; amount: number; }
// -----------------------------------------------------------------------------

const Overview = () => {
    const { productFilter, dateRange } = useOutletContext<ContextType>();
    const app = useAppBridge();

    const authenticatedApi = useAuthenticatedApi();

    const finalDateRange = useMemo(() => {
        return dateRange?.from ? dateRange : getCurrentMonthRange();
    }, [dateRange]);

    const dateLabel = useMemo(() => {
        if (finalDateRange?.from) {
            return format(finalDateRange.from, "MMMM yyyy");
        }
        return "Current Month";
    }, [finalDateRange]);

    const [totalTries, setTotalTries] = useState<number>(0);
    const [activeProducts, setActiveProducts] = useState<number>(0);
    const [chartData, setChartData] = useState<{ date: string; tryOns: number }[]>([]);
    const [loading, setLoading] = useState(true);

    // State to track if we are currently redirecting to auth
    const [isRedirecting, setIsRedirecting] = useState(false);

    const fromISO = useMemo(() => (finalDateRange?.from ? finalDateRange.from.toISOString() : undefined), [finalDateRange]);
    const toISO = useMemo(() => (finalDateRange?.to ? finalDateRange.to.toISOString() : undefined), [finalDateRange]);

    useEffect(() => {
        if (!fromISO || !toISO) return;

        const controller = new AbortController();

        const fetchData = async () => {
            const { from, to } = finalDateRange;
            if (!from || !to) return;

            setLoading(true);
            try {
                const endDateExclusive = new Date(to);
                endDateExclusive.setDate(endDateExclusive.getDate() + 1);

                const params = {
                    from: from.toISOString(),
                    to: endDateExclusive.toISOString(),
                };

                const calcData = await authenticatedApi.get<unknown>("/api/Dashboard/GetCalculations", params, {
                    signal: controller.signal,
                });
                setTotalTries(toFiniteNumber(calcData));

                const activeCount = await authenticatedApi.get<number>(
                    "/api/Dashboard/GetActiveProductsCount",
                    undefined,
                    { signal: controller.signal }
                );
                setActiveProducts(typeof activeCount === "number" ? activeCount : 0);

                const startOfSelectedMonth = from.toISOString();
                const usageData = await authenticatedApi.get<DailyUsage[]>(
                    "/api/Dashboard/GetTriesPerMonth",
                    { date: startOfSelectedMonth },
                    { signal: controller.signal }
                );

                if (Array.isArray(usageData)) {
                    const formattedData = usageData.map((dayItem) => ({
                        date: format(new Date(dayItem.date), "MMM dd"),
                        tryOns: dayItem.amount || 0,
                    }));
                    setChartData(formattedData);
                } else {
                    setChartData([]);
                }

            } catch (e) {
                // --- AUTOMATIC REDIRECT LOGIC ---
                if (e instanceof AuthError) {
                    console.log("[Auth] Session missing. Automatically redirecting to:", e.shop);
                    setIsRedirecting(true);

                    // Construct the install URL
                    // IMPORTANT: Ensure this matches your Backend URL from appsettings.json
                    const authUrl = `https://utry-dev-api.mangopond-e2a8cd3b.northeurope.azurecontainerapps.io/api/auth/initiate?shop=${e.shop}`;

                    // Use window.open with '_top'.
                    // The App Bridge script (loaded in index.html) intercepts this
                    // and converts it into a safe Shopify Redirect message.
                    window.open(authUrl, "_top");

                    return; // Stop execution
                }
                // --------------------------------

                if ((e as Error).name !== "AbortError") {
                    console.error("Fetch failed:", e);
                }
            } finally {
                // Only stop loading if we aren't redirecting
                // This keeps the UI "busy" while the page reloads
                if (!isRedirecting) {
                    setLoading(false);
                }
            }
        };

        fetchData();
        return () => controller.abort();
    }, [fromISO, toISO, app.origin, authenticatedApi]);

    // --- NEW: Loading State for Redirect ---
    if (isRedirecting) {
        return (
            <div className="flex flex-col items-center justify-center h-[60vh] space-y-4">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
                <h2 className="text-xl font-semibold">Connecting to Store...</h2>
                <p className="text-muted-foreground">Please wait while we authenticate your session.</p>
            </div>
        );
    }
    // ---------------------------------------

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
                <MetricCard
                    title="Total Try-Ons"
                    value={loading ? "..." : totalTries.toLocaleString()}
                    subtitle={dateLabel}
                    icon={Eye}
                    tooltip="Total number of virtual try-on sessions across all products in the selected date range"
                />
                <MetricCard
                    title="Active Products"
                    value={loading ? "..." : activeProducts.toLocaleString()}
                    subtitle={dateLabel}
                    icon={Package}
                    tooltip="Total number of products currently available for virtual try-on across both VTO and VDR"
                />
            </div>
            {/* Try-On Trends Chart */}
            <Card className="shadow-card">
                <CardHeader>
                    <CardTitle>Daily Usage</CardTitle>
                </CardHeader>
                <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                            <XAxis
                                dataKey="date"
                                stroke="hsl(var(--muted-foreground))"
                                fontSize={12}
                                tickMargin={10}
                            />
                            <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: "hsl(var(--card))",
                                    border: "1px solid hsl(var(--border))",
                                    borderRadius: "8px",
                                }}
                            />
                            <Line
                                type="monotone"
                                dataKey="tryOns"
                                stroke="hsl(var(--primary))"
                                strokeWidth={2}
                                dot={false}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>
        </div>
    );
};

export default Overview;