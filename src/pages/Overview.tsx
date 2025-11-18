import { useOutletContext } from "react-router-dom";
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
import { Eye, TrendingUp, TrendingDown, Package } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { DateRange } from "react-day-picker";

interface ContextType {
  productFilter: "all" | "vto" | "vdr";
  dateRange: DateRange | undefined;
}

const mockChartData = [
  { date: "Week 1", tryOns: 2400 },
  { date: "Week 2", tryOns: 3200 },
  { date: "Week 3", tryOns: 2800 },
  { date: "Week 4", tryOns: 4100 },
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

const Overview = () => {
  const { productFilter, dateRange } = useOutletContext<ContextType>();

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Dashboard Overview</h1>
        <p className="text-muted-foreground mt-1">
          Track your virtual try-on performance and product engagement
        </p>
      </div>

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

      {/* Chart */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle>Try-Ons Over Time</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
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
                stroke="hsl(var(--primary))"
                strokeWidth={3}
                dot={{ fill: "hsl(var(--primary))", r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Top Products Table */}

    </div>
  );
};

export default Overview;
