import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Calendar as CalendarIcon, User, Settings, LogOut } from "lucide-react";
import { DateRange } from "react-day-picker";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface DashboardHeaderProps {
  productFilter: "all" | "vto" | "vdr";
  setProductFilter: (filter: "all" | "vto" | "vdr") => void;
  dateRange: DateRange | undefined;
  setDateRange: (range: DateRange | undefined) => void;
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
        <h2 className="font-semibold text-lg text-foreground">Analytics Dashboard</h2>
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

        {/* Date Range Picker */}
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "h-9 px-4 justify-start text-left font-normal",
                !dateRange && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {dateRange?.from ? (
                dateRange.to ? (
                  <>
                    {format(dateRange.from, "LLL dd, y")} -{" "}
                    {format(dateRange.to, "LLL dd, y")}
                  </>
                ) : (
                  format(dateRange.from, "LLL dd, y")
                )
              ) : (
                <span>Pick a date range</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="end">
            <Calendar
              initialFocus
              mode="range"
              defaultMonth={dateRange?.from}
              selected={dateRange}
              onSelect={setDateRange}
              numberOfMonths={2}
              className="pointer-events-auto"
            />
          </PopoverContent>
        </Popover>

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
