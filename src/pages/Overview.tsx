import { useOutletContext } from "react-router-dom";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Upload, TrendingUp, TrendingDown, ShoppingBag, Package } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface ContextType {
  productFilter: "all" | "vto" | "vdr";
  dateRange: "7" | "30" | "custom";
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
    category: "Dresses",
    tryOns: 1234,
    image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=100&h=100&fit=crop",
  },
  {
    id: 2,
    name: "Classic Blazer",
    category: "Outerwear",
    tryOns: 987,
    image: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=100&h=100&fit=crop",
  },
  {
    id: 3,
    name: "Denim Jeans",
    category: "Bottoms",
    tryOns: 856,
    image: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=100&h=100&fit=crop",
  },
  {
    id: 4,
    name: "White Sneakers",
    category: "Footwear",
    tryOns: 743,
    image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=100&h=100&fit=crop",
  },
  {
    id: 5,
    name: "Leather Jacket",
    category: "Outerwear",
    tryOns: 621,
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Total Try-Ons"
          value="12,543"
          subtitle="Last 30 days"
          icon={TrendingUp}
          trend={{ value: 12.5, isPositive: true }}
        />
        <MetricCard
          title="Conversion Lift"
          value="24.3%"
          subtitle="vs non-VTO products"
          icon={ShoppingBag}
          trend={{ value: 3.2, isPositive: true }}
        />
        <MetricCard
          title="Return Rate Reduction"
          value="-18.7%"
          subtitle="Compared to baseline"
          icon={TrendingDown}
          trend={{ value: 2.4, isPositive: true }}
        />
        <MetricCard
          title="Active Products"
          value="247"
          subtitle="VTO + VDR combined"
          icon={Package}
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
      <Card className="shadow-card">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Top 5 Products</CardTitle>
          <Button className="bg-secondary hover:bg-secondary/90">
            <Upload className="h-4 w-4 mr-2" />
            Upload New Product
          </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>Category</TableHead>
                <TableHead className="text-right">Try-Ons</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockProducts.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="h-12 w-12 rounded-lg object-cover"
                      />
                      <span className="font-medium">{product.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {product.category}
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    {product.tryOns.toLocaleString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default Overview;
