import { useState } from "react";
import { Outlet } from "react-router-dom";
import { createApp } from "@shopify/app-bridge";
import { SidebarProvider } from "@/components/ui/sidebar";
import { DashboardSidebar } from "./DashboardSidebar";
import { DashboardHeader } from "./DashboardHeader";
import { DateRange } from "react-day-picker";
type AppBridgeInstance = ReturnType<typeof createApp>;
export const DashboardLayout = ({ app, shop }: { app: AppBridgeInstance, shop: string | null }) => {
  const [productFilter, setProductFilter] = useState<"all" | "vto" | "vdr">("all");
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: new Date(new Date().setDate(new Date().getDate() - 30)),
    to: new Date(),
  });

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <DashboardSidebar productFilter={productFilter} />
        <div className="flex-1 flex flex-col">
          <DashboardHeader
            productFilter={productFilter}
            setProductFilter={setProductFilter}
            dateRange={dateRange}
            setDateRange={setDateRange}
          />
          <main className="flex-1 p-6 overflow-auto">
            <Outlet context={{ productFilter, dateRange, app, shop }} />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};
