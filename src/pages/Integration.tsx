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
import { RefreshCw, AlertCircle, CheckCircle, HelpCircle } from "lucide-react";

const errorLogs = [
  {
    id: 1,
    timestamp: "2024-01-15 14:32:18",
    description: "Product sync timeout for SKU-12345",
    status: "resolved",
  },
  {
    id: 2,
    timestamp: "2024-01-15 12:10:05",
    description: "API rate limit exceeded",
    status: "resolved",
  },
];

const Integration = () => {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Integration Health</h1>
        <p className="text-muted-foreground mt-1">
          Monitor connection status and system health
        </p>
      </div>

      {/* Integration Status Card */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle>Connection Status</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground">
                  Platform
                </span>
                <Badge className="bg-primary/10 text-primary hover:bg-primary/20">
                  Shopify
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground">
                  Last Sync
                </span>
                <span className="text-sm font-medium">2 minutes ago</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground">
                  Status
                </span>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-success" />
                  <Badge className="bg-success/10 text-success hover:bg-success/20">
                    Connected
                  </Badge>
                </div>
              </div>
            </div>

            <div className="flex flex-col justify-center gap-3">
              <Button variant="outline" className="w-full">
                <RefreshCw className="h-4 w-4 mr-2" />
                Sync Now
              </Button>
              <Button variant="outline" className="w-full">
                <HelpCircle className="h-4 w-4 mr-2" />
                Contact Support
              </Button>
            </div>
          </div>

          {/* System Health Indicators */}
          <div className="border-t border-border pt-6">
            <h3 className="text-sm font-semibold mb-4">System Health</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                <CheckCircle className="h-5 w-5 text-success" />
                <div>
                  <div className="text-sm font-medium">API Status</div>
                  <div className="text-xs text-muted-foreground">Operational</div>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                <CheckCircle className="h-5 w-5 text-success" />
                <div>
                  <div className="text-sm font-medium">Storage</div>
                  <div className="text-xs text-muted-foreground">127/500 GB</div>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                <CheckCircle className="h-5 w-5 text-success" />
                <div>
                  <div className="text-sm font-medium">Processing</div>
                  <div className="text-xs text-muted-foreground">98.7% uptime</div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Error Logs */}
      <Card className="shadow-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Recent Activity Log</CardTitle>
            <Badge variant="outline" className="text-muted-foreground">
              {errorLogs.length} events
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          {errorLogs.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Timestamp</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead className="text-right">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {errorLogs.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell className="font-mono text-sm text-muted-foreground">
                      {log.timestamp}
                    </TableCell>
                    <TableCell>{log.description}</TableCell>
                    <TableCell className="text-right">
                      <Badge
                        variant="outline"
                        className="bg-success/10 text-success hover:bg-success/20"
                      >
                        {log.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-12">
              <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No issues detected</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Integration;
