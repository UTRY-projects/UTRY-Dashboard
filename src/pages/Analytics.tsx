import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const tryOnData = [
  { date: "Week 1", vto: 2400, vdr: 1800 },
  { date: "Week 2", vto: 3200, vdr: 2100 },
  { date: "Week 3", vto: 2800, vdr: 2400 },
  { date: "Week 4", vto: 4100, vdr: 2900 },
];

const deviceData = [
  { name: "Mobile", value: 68 },
  { name: "Desktop", value: 32 },
];

const topProductsData = [
  { name: "Summer Dress", tryOns: 1234 },
  { name: "Blazer", tryOns: 987 },
  { name: "Denim", tryOns: 856 },
  { name: "Sneakers", tryOns: 743 },
  { name: "Jacket", tryOns: 621 },
];

const engagementData = [
  { metric: "Avg. Session Time", value: "4m 32s", change: "+12%" },
  { metric: "Returning Users", value: "42.3%", change: "+5.2%" },
  { metric: "Products per Session", value: "3.8", change: "+8%" },
  { metric: "Completion Rate", value: "78.5%", change: "+3.1%" },
];

const COLORS = ["hsl(var(--secondary))", "hsl(var(--accent))"];

const Analytics = () => {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Analytics</h1>
        <p className="text-muted-foreground mt-1">
          Detailed insights across all virtual try-on products
        </p>
      </div>

      {/* Try-Ons Over Time */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle>Try-Ons Over Time (VTO vs VDR)</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={tryOnData}>
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
              <Legend />
              <Line
                type="monotone"
                dataKey="vto"
                stroke="hsl(var(--secondary))"
                strokeWidth={3}
                name="VTO"
              />
              <Line
                type="monotone"
                dataKey="vdr"
                stroke="hsl(var(--accent))"
                strokeWidth={3}
                name="VDR"
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Device Split & Top Products */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Device Split */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Device Split</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-center">
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={deviceData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {deviceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Top Products Bar Chart */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Top Products by Try-Ons</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={topProductsData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis
                  dataKey="name"
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
                <Bar dataKey="tryOns" fill="hsl(var(--primary))" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Engagement Metrics Table */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle>Engagement Metrics</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Metric</TableHead>
                <TableHead className="text-right">Value</TableHead>
                <TableHead className="text-right">Change</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {engagementData.map((item) => (
                <TableRow key={item.metric}>
                  <TableCell className="font-medium">{item.metric}</TableCell>
                  <TableCell className="text-right font-semibold">
                    {item.value}
                  </TableCell>
                  <TableCell className="text-right text-success font-medium">
                    {item.change}
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

export default Analytics;
