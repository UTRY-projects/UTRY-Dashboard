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
import { Send, Eye, TrendingUp, TrendingDown, Users } from "lucide-react";
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

const VDR = () => {
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
        <Button className="bg-accent hover:bg-accent/90 text-accent-foreground">
          <Send className="h-4 w-4 mr-2" />
          Send UTRY New Design
        </Button>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
        <MetricCard
          title="Total VDR Try-Ons"
          value="3,996"
          subtitle="Selected period"
          icon={Eye}
          trend={{ value: 8.2, isPositive: true }}
          tooltip="Total number of 3D garment try-ons using virtual avatars in the selected date range"
        />
        <MetricCard
          title="Unique Users"
          value="681"
          subtitle="Selected period"
          icon={Users}
          tooltip="Number of distinct users who used VDR in the selected date range"
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
