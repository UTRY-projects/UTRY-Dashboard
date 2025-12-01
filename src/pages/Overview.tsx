import { useEffect, useMemo, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createApp } from "@shopify/app-bridge";
import { Eye, Package, Loader2 } from "lucide-react";
import { DateRange } from "react-day-picker";
import { useAuthenticatedApi, AuthError } from "@/lib/api";
import { startOfMonth, format } from "date-fns";
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip
} from "recharts";
// --- 1. REMOVED useTheme ---

// Helper Types and Functions (Unchanged)
interface ContextType {
    productFilter: "all" | "vto" | "vdr";
    dateRange: DateRange | undefined;
}
const getCurrentMonthRange = (): DateRange => {
    const today = new Date();
    return { from: startOfMonth(today), to: today };
};
type DailyUsage = { date: string; amount: number; }
type CalculationsResponse = {
    totalUsers: number;
    totalTryOns: number;
};

const Overview = () => {
    // --- 2. REMOVED useTheme() and primaryColor state ---
    const { dateRange } = useOutletContext<ContextType>();
    const { app, shop } = useOutletContext<{ app: ReturnType<typeof createApp>, shop: string | null }>();
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
    const [isRedirecting, setIsRedirecting] = useState(false);

    // --- 3. REMOVED the color-calculating useEffect ---

    useEffect(() => {
        // Data fetching logic remains unchanged
        if (!app || !shop || !finalDateRange?.from) {
            return;
        }
        const controller = new AbortController();
        const fetchData = async () => {
            setLoading(true);
            try {
                const fromDate = finalDateRange.from;
                const year = fromDate.getFullYear();
                const month = fromDate.getMonth();
                const firstDayOfMonth = new Date(Date.UTC(year, month, 1));
                const lastDayOfMonth = new Date(Date.UTC(year, month + 1, 0, 23, 59, 59, 999));

                const [totalTriesData, activeCount, usageData] = await Promise.all([
                    authenticatedApi.get<CalculationsResponse>(
                        `/api/Dashboard/GetCalculations`,
                        { from: firstDayOfMonth.toISOString(), to: lastDayOfMonth.toISOString() },
                        { signal: controller.signal }
                    ),
                    authenticatedApi.get<number>(`/api/Dashboard/GetActiveProductsCount`, undefined, { signal: controller.signal }),
                    authenticatedApi.get<DailyUsage[]>(
                        "/api/Dashboard/GetTriesPerMonth",
                        { from: firstDayOfMonth.toISOString(), to: lastDayOfMonth.toISOString() },
                        { signal: controller.signal }
                    )
                ]);

                setTotalTries(totalTriesData?.totalTryOns ?? 0);
                setActiveProducts(typeof activeCount === 'number' ? activeCount : 0);

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
                if (e instanceof AuthError) {
                    setIsRedirecting(true);
                    const authUrl = `https://jennet-sweeping-warthog.ngrok-free.app/api/auth/initiate?shop=${e.shop}`;
                    window.open(authUrl, "_top");
                    return;
                }
                if ((e as Error).name !== "AbortError") {
                    console.error("Fetch failed:", e);
                }
            } finally {
                if (!isRedirecting) {
                    setLoading(false);
                }
            }
        };
        fetchData();
        return () => controller.abort();
    }, [app, shop, finalDateRange, authenticatedApi]);

    if (isRedirecting) {
        return (
            <div className="flex flex-col items-center justify-center h-[60vh] space-y-4">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
                <h2 className="text-xl font-semibold">Connecting to Store...</h2>
                <p className="text-muted-foreground">Please wait while we authenticate your session.</p>
            </div>
        );
    }

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
            <Card className="shadow-card">
                <CardHeader>
                    <CardTitle>Daily Usage</CardTitle>
                </CardHeader>
                <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart
                            data={chartData}
                            margin={{ top: 5, right: 20, left: -10, bottom: 5 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                            <XAxis
                                dataKey="date"
                                stroke="hsl(var(--muted-foreground))"
                                fontSize={12}
                                tickLine={false}
                                axisLine={false}
                            />
                            <YAxis
                                stroke="hsl(var(--muted-foreground))"
                                fontSize={12}
                                tickLine={false}
                                axisLine={false}
                            />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: "hsl(var(--background))",
                                    borderColor: "hsl(var(--border))",
                                }}
                            />
                            {/* --- 4. THIS IS THE CHANGE --- */}
                            <Line
                                type="monotone"
                                dataKey="tryOns"
                                stroke="#8884d8" // A static, hardcoded color
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