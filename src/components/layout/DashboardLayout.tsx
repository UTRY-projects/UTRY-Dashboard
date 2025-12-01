import { useState } from "react";
import { Outlet } from "react-router-dom";
import { createApp } from "@shopify/app-bridge";
import { SidebarProvider } from "@/components/ui/sidebar";
import { DashboardSidebar } from "./DashboardSidebar";
import { DashboardHeader } from "./DashboardHeader";
import { DateRange } from "react-day-picker";
import { startOfMonth, endOfMonth } from "date-fns";

type AppBridgeInstance = ReturnType<typeof createApp>;
export const DashboardLayout = ({ app, shop }: { app: AppBridgeInstance, shop: string | null }) => {
  const [productFilter, setProductFilter] = useState<"all" | "vto" | "vdr">("all");
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: startOfMonth(new Date()),
    to: endOfMonth(new Date()),
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
