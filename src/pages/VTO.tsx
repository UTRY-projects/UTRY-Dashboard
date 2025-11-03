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
import { Upload, Eye, ShoppingCart } from "lucide-react";
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
    status: "active",
    image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=100&h=100&fit=crop",
  },
  {
    id: 2,
    name: "Classic Blazer",
    sku: "CB-045-BLK",
    tryOns: 987,
    status: "active",
    image: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=100&h=100&fit=crop",
  },
  {
    id: 3,
    name: "Floral Maxi Dress",
    sku: "FD-012-FLR",
    tryOns: 0,
    status: "pending",
    image: "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=100&h=100&fit=crop",
  },
];

const VTO = () => {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Virtual Try-On</h1>
          <p className="text-muted-foreground mt-1">
            Manage photo-based try-on products and monitor engagement
          </p>
        </div>
        <Button className="bg-secondary hover:bg-secondary/90">
          <Upload className="h-4 w-4 mr-2" />
          Upload VTO Product
        </Button>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <MetricCard
          title="Total VTO Try-Ons"
          value="8,547"
          subtitle="Last 30 days"
          icon={Eye}
          trend={{ value: 15.3, isPositive: true }}
        />
        <MetricCard
          title="Avg. Add-to-Cart Rate"
          value="32.4%"
          subtitle="From VTO sessions"
          icon={ShoppingCart}
          trend={{ value: 4.7, isPositive: true }}
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
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle>VTO Product Library</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>SKU</TableHead>
                <TableHead className="text-right">Try-Ons</TableHead>
                <TableHead className="text-right">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockVTOProducts.map((product) => (
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
                  <TableCell className="text-muted-foreground font-mono text-sm">
                    {product.sku}
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    {product.tryOns > 0 ? product.tryOns.toLocaleString() : "—"}
                  </TableCell>
                  <TableCell className="text-right">
                    <Badge
                      variant={product.status === "active" ? "default" : "secondary"}
                      className={
                        product.status === "active"
                          ? "bg-success/10 text-success hover:bg-success/20"
                          : "bg-warning/10 text-warning hover:bg-warning/20"
                      }
                    >
                      {product.status}
                    </Badge>
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

export default VTO;
