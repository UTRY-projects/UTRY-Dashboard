import { MetricCard } from "@/components/dashboard/MetricCard";
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
import { Eye, TrendingUp, TrendingDown, Users } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const mockChartData = [
  { date: "Mon", tryOns: 420 },
  { date: "Tue", tryOns: 580 },
  { date: "Wed", tryOns: 650 },
  { date: "Thu", tryOns: 720 },
  { date: "Fri", tryOns: 890 },
  { date: "Sat", tryOns: 1100 },
  { date: "Sun", tryOns: 980 },
];

const mockVTOProducts = [
  {
    id: 1,
    name: "Summer Dress Blue",
    sku: "SD-001-BLU",
    tryOns: 1234,
    conversionRate: 32.4,
    status: "active",
    image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=100&h=100&fit=crop",
  },
  {
    id: 2,
    name: "Classic Blazer",
    sku: "CB-045-BLK",
    tryOns: 987,
    conversionRate: 28.1,
    status: "active",
    image: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=100&h=100&fit=crop",
  },
  {
    id: 3,
    name: "Floral Maxi Dress",
    sku: "FD-012-FLR",
    tryOns: 0,
    conversionRate: 0,
    status: "pending",
    image: "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=100&h=100&fit=crop",
  },
];

const VTO = () => {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Virtual Try-On</h1>
        <p className="text-muted-foreground mt-1">
          Photo-based try-on analytics and performance metrics
        </p>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
        <MetricCard
          title="Total VTO Try-Ons"
          value="8,547"
          subtitle="Selected period"
          icon={Eye}
          trend={{ value: 15.3, isPositive: true }}
          tooltip="Total number of photo-based virtual try-on sessions in the selected date range"
        />
        <MetricCard
          title="Unique Users"
          value="2,847"
          subtitle="Selected period"
          icon={Users}
          tooltip="Number of distinct users who used VTO in the selected date range"
        />
      </div>

      {/* Chart */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle>VTO Try-Ons Per Day</CardTitle>
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
                dataKey="tryOns"
                stroke="hsl(var(--secondary))"
                strokeWidth={3}
                dot={{ fill: "hsl(var(--secondary))", r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Products Table */}
    </div>
  );
};

export default VTO;
