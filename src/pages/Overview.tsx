import { useEffect, useMemo, useState } from "react";
import {useOutletContext} from "react-router-dom";
import {MetricCard} from "@/components/dashboard/MetricCard";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Badge} from "@/components/ui/badge";
import { useAppBridge } from "@shopify/app-bridge-react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {Eye, TrendingUp, TrendingDown, Package} from "lucide-react";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from "recharts";
import {DateRange} from "react-day-picker";
import {api} from "@/lib/api";

interface ContextType {
    productFilter: "all" | "vto" | "vdr";
    dateRange: DateRange | undefined;
}

type CalculationResponse = {
    total: number;
}

const mockChartData = [
    {date: "Week 1", tryOns: 2400},
    {date: "Week 2", tryOns: 3200},
    {date: "Week 3", tryOns: 2800},
    {date: "Week 4", tryOns: 4100},
];

const mockProducts = [
    {
        id: 1,
        name: "Summer Dress Blue",
        type: "VTO",
        tryOns: 1234,
        conversionRate: 32.4,
        image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=100&h=100&fit=crop",
    },
    {
        id: 2,
        name: "Classic Blazer",
        type: "VDR",
        tryOns: 987,
        conversionRate: 28.1,
        image: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=100&h=100&fit=crop",
    },
    {
        id: 3,
        name: "Denim Jeans",
        type: "VTO",
        tryOns: 856,
        conversionRate: 24.7,
        image: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=100&h=100&fit=crop",
    },
    {
        id: 4,
        name: "White Sneakers",
        type: "VDR",
        tryOns: 743,
        conversionRate: 35.2,
        image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=100&h=100&fit=crop",
    },
    {
        id: 5,
        name: "Leather Jacket",
        type: "VTO",
        tryOns: 621,
        conversionRate: 29.8,
        image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=100&h=100&fit=crop",
    },
];

type OverviewResponse = {
    metrics: { totalTryOns: number; }
}



function isRecord(value: unknown): value is Record<string, unknown> {
    return typeof value === "object" && value !== null;
}

function toFiniteNumber(input: unknown): number {
    if (typeof input === "number") {
        return Number.isFinite(input) ? input : 0;
    }
    if (typeof input === "string") {
        const n = Number(input);
        return Number.isFinite(n) ? n : 0;
    }
    if (isRecord(input)) {
        if ("data" in input) return toFiniteNumber((input as { data: unknown }).data);
        if ("total" in input) return toFiniteNumber((input as { total: unknown }).total);
        if ("count" in input) return toFiniteNumber((input as { count: unknown }).count);
    }
    return 0;
}

const Overview = () => {
    const {productFilter, dateRange} = useOutletContext<ContextType>();
    const app = useAppBridge();

    const [totalTries, setTotalTries] = useState<number>(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fromISO = useMemo(
        () => (dateRange?.from ? dateRange.from.toISOString() : undefined),
        [dateRange?.from]
    );
      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
        <MetricCard
          title="Total Try-Ons"
          value="12,543"
          subtitle="Selected period"
          icon={Eye}
          tooltip="Total number of virtual try-on sessions across all products in the selected date range"
        />
        <MetricCard
          title="Active Products"
          value="247"
          subtitle="VTO + VDR combined"
          icon={Package}
          tooltip="Total number of products currently available for virtual try-on across both VTO and VDR"
        />
      </div>

    const toISO = useMemo(
        () => (dateRange?.to ? dateRange.to.toISOString() : undefined),
        [dateRange?.to]
    );

    useEffect(() => {
        if (!fromISO || !toISO) {
            console.warn("Skipping fetch: missing date range");
            setTotalTries(0);
            return;
        }

        const controller = new AbortController();

        const fetchData = async () => {


            setLoading(true);
            setError(null);
            try {
                // const ShopParams = new URLSearchParams(window.location.search);
                // const shopName = ShopParams.get('shop').replace(/\.myshopify\.com$/, "");
                // console.log(`Fetching API key for shop: ${shopName}`);
                // const apiKey = await api.get<string>(
                //     "/api/Dashboard/GetStoreApiKey",
                //     { storeName: shopName },
                //     { signal: controller.signal, }
                // );
                // if (!apiKey || typeof apiKey !== "string") {
                //     throw new Error("API Key could not be retrieved or is invalid.");
                // }

                // const params = {
                //     from: fromISO,
                //     to: toISO,
                //     api_key: apiKey,
                //     productFilter: productFilter === "all" ? undefined : productFilter,
                // };

                //console.log("Fetching from backend with params:", params);

                //const data = await api.get<unknown>("/api/Dashboard/GetCalculations", params, {
                  //  signal: controller.signal,
                //});

                //console.log("Data received:", data);

                //const total = toFiniteNumber(data);
                //console.log("Total tries:", total);
                //setTotalTries(total);

            } catch (e) {
                if ((e as Error).name !== "AbortError") {
                    setError((e as Error).message);
                    console.error("Fetch failed:", e);
                    setTotalTries(0);
                }
            } finally {
                setLoading(false);
            }
        };

        fetchData();

        return () => controller.abort();
    }, [fromISO, toISO, productFilter, app.origin]);

      {/* Top Products Table */}

};

export default Overview;
