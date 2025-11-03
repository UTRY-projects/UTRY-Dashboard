import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Download, CreditCard, Users, Package } from "lucide-react";

const invoices = [
  {
    id: 1,
    date: "2024-01-01",
    amount: "8,467 DKK",
    status: "paid",
  },
  {
    id: 2,
    date: "2023-12-01",
    amount: "7,932 DKK",
    status: "paid",
  },
  {
    id: 3,
    date: "2023-11-01",
    amount: "8,124 DKK",
    status: "paid",
  },
];

const Billing = () => {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Account & Billing</h1>
        <p className="text-muted-foreground mt-1">
          Manage your subscription and view usage details
        </p>
      </div>

      {/* Account Summary */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle>Current Plan</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h3 className="text-2xl font-bold">UTRY Enterprise</h3>
                <Badge className="bg-accent/10 text-accent hover:bg-accent/20">
                  Active
                </Badge>
              </div>
              <p className="text-muted-foreground">
                Full access to VTO & VDR with priority support
              </p>
            </div>
            <Button className="bg-secondary hover:bg-secondary/90">
              Upgrade Plan
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-border">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <CreditCard className="h-5 w-5 text-primary" />
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Renewal Date</div>
                <div className="font-semibold">Feb 1, 2024</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Users className="h-5 w-5 text-primary" />
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Monthly Active Users</div>
                <div className="font-semibold">3,528</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Package className="h-5 w-5 text-primary" />
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Products Uploaded</div>
                <div className="font-semibold">247</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Usage Overview */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle>Usage Overview</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
            <div>
              <div className="text-sm text-muted-foreground mb-1">
                Cost Per Unique User
              </div>
              <div className="text-2xl font-bold">2.4 DKK</div>
            </div>
            <Badge variant="outline" className="bg-background">
              Baseline Rate
            </Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-lg border border-border">
              <div className="text-sm text-muted-foreground mb-1">
                Current Month Estimate
              </div>
              <div className="text-xl font-bold">8,467 DKK</div>
              <div className="text-sm text-muted-foreground mt-1">
                Based on 3,528 MAU
              </div>
            </div>
            <div className="p-4 rounded-lg border border-border">
              <div className="text-sm text-muted-foreground mb-1">
                Previous Month
              </div>
              <div className="text-xl font-bold">7,932 DKK</div>
              <div className="text-sm text-success mt-1">
                +6.7% vs prior month
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Invoices */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle>Invoice History</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invoices.map((invoice) => (
                <TableRow key={invoice.id}>
                  <TableCell className="font-medium">{invoice.date}</TableCell>
                  <TableCell className="font-semibold">{invoice.amount}</TableCell>
                  <TableCell>
                    <Badge className="bg-success/10 text-success hover:bg-success/20">
                      {invoice.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm">
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
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

export default Billing;
