import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Button as ShadcnButton } from "@/components/ui/button";
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
import { useMemo } from 'react';
import { Button } from '@shopify/polaris';

const YOUR_APP_API_KEY = '6feca39509df11b363bb0a7300580b2f'
const YOUR_THEME_BLOCK_HANDLE = 'customer_review';


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
  const deepLinkUrl = useMemo(() => {
    const host = new URLSearchParams(window.location.search).get('host')
    const shop = new URLSearchParams(window.location.search).get('shop')
    if(!host){
      return '';
    }
    const shopDomain = "https://utry-merch-store.myshopify.com";
        //atob(host);
    return `https://${shopDomain}/admin/themes/current/editor?template=product&addAppBlockId=
            ${YOUR_APP_API_KEY}/${YOUR_THEME_BLOCK_HANDLE}&target=mainSection`;
  }, []);
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Integration Health</h1>
        <p className="text-muted-foreground mt-1">
          Monitor connection status and system health
        </p>
      </div>

      {/* Theme Setup Card */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle>Theme Setup</CardTitle>
        </CardHeader>
        <CardContent>
          <p>
            To complete the setup, add our app's block on your product page.
            This will enable our features directly on your store.
          </p>
          <Button
            variant="primary"
            url={deepLinkUrl}
            target="_top"
            disabled={!deepLinkUrl}
            >
            Add App Block to Product Page
          </Button>
        </CardContent>
      </Card>

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
              <Button fullWidth icon={RefreshCw}>
                Sync Now
              </Button>
              <Button fullWidth icon={HelpCircle}>
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

          {/* Last Error Timestamp */}
          <div className="border-t border-border pt-4 mt-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Last Error Timestamp</span>
              <span className="font-medium">2024-01-15 14:32:18</span>
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
