import { MetricCard } from "@/components/dashboard/MetricCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {Send, Eye, TrendingUp, TrendingDown, Users, Package} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {useEffect, useMemo, useState} from "react";
import {api} from "@/lib/api.tsx";
import {useOutletContext} from "react-router-dom";
import {useAppBridge} from "@shopify/app-bridge-react";
import {DateRange} from "react-day-picker";


interface ContextType {
  productFilter: "all" | "vto" | "vdr";
  dateRange: DateRange | undefined;
}

const mockChartData = [
  { date: "Mon", avatarTryOns: 320 },
  { date: "Tue", avatarTryOns: 450 },
  { date: "Wed", avatarTryOns: 520 },
  { date: "Thu", avatarTryOns: 610 },
  { date: "Fri", avatarTryOns: 740 },
  { date: "Sat", avatarTryOns: 920 },
  { date: "Sun", avatarTryOns: 850 },
];

const mockVDRProducts = [
  {
    id: 1,
    name: "Denim Jacket 3D",
    tryOns: 856,
    conversionRate: 28.3,
    integrationStatus: "connected",
    fileStatus: "live",
    image: "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=100&h=100&fit=crop",
  },
  {
    id: 2,
    name: "White T-Shirt Basic",
    tryOns: 743,
    conversionRate: 31.2,
    integrationStatus: "connected",
    fileStatus: "live",
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=100&h=100&fit=crop",
  },
  {
    id: 3,
    name: "Cargo Pants Olive",
    tryOns: 0,
    conversionRate: 0,
    integrationStatus: "processing",
    fileStatus: "pending",
    image: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=100&h=100&fit=crop",
  },
];

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
const VDR = () => {
  const {productFilter, dateRange} = useOutletContext<ContextType>();
  const app = useAppBridge();

  const [totalTries, setTotalTries] = useState<number>(0);
  const [activeProducts, setActiveProducts] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fromISO = useMemo(
      () => (dateRange?.from ? dateRange.from.toISOString() : undefined),
      [dateRange?.from]
  );


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
        const ShopParams = new URLSearchParams(window.location.search);
        const shopName = ShopParams.get('shop').replace(/\.myshopify\.com$/, "");
        console.log(`Fetching API key for shop: ${shopName}`);
        const apiKey = await api.get<string>(
            "/api/Dashboard/GetStoreApiKey",
            { storeName: shopName },
            { signal: controller.signal, }
        );
        console.log(shopName, apiKey);
        if (!apiKey || typeof apiKey !== "string") {
          throw new Error("API Key could not be retrieved or is invalid.");
        }


        const params = {
          from: fromISO,
          to: toISO,
          api_key: apiKey,
          productFilter: productFilter === "all" ? undefined : productFilter,
        };

        console.log("Fetching from backend with params:", params);

        const data = await api.get<unknown>("/api/Dashboard/GetCalculations", params, {
          signal: controller.signal,
        });

        const activeCount = await api.get<number>(
            "/api/Dashboard/GetActiveProductsCount",
            { api_key: apiKey },
            { signal: controller.signal }
        );
        setActiveProducts(typeof activeCount === "number" ? activeCount : 0);

        console.log("Data received:", data);

        const total = toFiniteNumber(data);
        console.log("Total tries:", total);
        setTotalTries(total);

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



  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Virtual Dressing Room</h1>
          <p className="text-muted-foreground mt-1">
            3D garment analytics and avatar engagement metrics
          </p>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
        <MetricCard
            title="Total Try-Ons"
            value={loading ? "..." : totalTries.toLocaleString()}
            subtitle="Selected period"
            icon={Eye}
            tooltip="Total number of virtual try-on sessions across all products in the selected date range"
        />
        <MetricCard
            title="Active Products"
            value={loading ? "..." : activeProducts.toLocaleString()}
            subtitle="VTO + VDR combined"
            icon={Package}
            tooltip="Total number of products currently available for virtual try-on across both VTO and VDR"
        />
      </div>

      {/* Chart */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle>Avatar Try-Ons Over Time</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={mockChartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis
                dataKey="date"
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
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
                dataKey="avatarTryOns"
                stroke="hsl(var(--accent))"
                strokeWidth={3}
                dot={{ fill: "hsl(var(--accent))", r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default VDR;
