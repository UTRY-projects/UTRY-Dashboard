import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Calendar, User, Settings, LogOut } from "lucide-react";

interface DashboardHeaderProps {
  productFilter: "all" | "vto" | "vdr";
  setProductFilter: (filter: "all" | "vto" | "vdr") => void;
  dateRange: "7" | "30" | "custom";
  setDateRange: (range: "7" | "30" | "custom") => void;
}

export const DashboardHeader = ({
  productFilter,
  setProductFilter,
  dateRange,
  setDateRange,
}: DashboardHeaderProps) => {
  return (
    <header className="h-16 border-b border-border bg-card flex items-center justify-between px-6 shadow-card">
      <div className="flex items-center gap-4">
        <SidebarTrigger />
      </div>

      <div className="flex items-center gap-4">
        {/* Product Filter */}
        <div className="flex items-center gap-2 bg-muted rounded-lg p-1">
          <Button
            variant={productFilter === "all" ? "default" : "ghost"}
            size="sm"
            onClick={() => setProductFilter("all")}
            className="h-8 px-4"
          >
            All
          </Button>
          <Button
            variant={productFilter === "vto" ? "default" : "ghost"}
            size="sm"
            onClick={() => setProductFilter("vto")}
            className="h-8 px-4"
          >
            VTO
          </Button>
          <Button
            variant={productFilter === "vdr" ? "default" : "ghost"}
            size="sm"
            onClick={() => setProductFilter("vdr")}
            className="h-8 px-4"
          >
            VDR
          </Button>
        </div>

        {/* Date Range Filter */}
        <div className="flex items-center gap-2 bg-muted rounded-lg p-1">
          <Button
            variant={dateRange === "7" ? "default" : "ghost"}
            size="sm"
            onClick={() => setDateRange("7")}
            className="h-8 px-4"
          >
            7 days
          </Button>
          <Button
            variant={dateRange === "30" ? "default" : "ghost"}
            size="sm"
            onClick={() => setDateRange("30")}
            className="h-8 px-4"
          >
            30 days
          </Button>
          <Button
            variant={dateRange === "custom" ? "default" : "ghost"}
            size="sm"
            onClick={() => setDateRange("custom")}
            className="h-8 px-4"
          >
            <Calendar className="h-4 w-4" />
          </Button>
        </div>

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full">
              <Avatar className="h-9 w-9">
                <AvatarFallback className="bg-primary text-primary-foreground">
                  <User className="h-5 w-5" />
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem>
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </DropdownMenuItem>
            <DropdownMenuItem>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};
