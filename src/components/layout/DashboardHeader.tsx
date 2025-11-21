import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Calendar as CalendarIcon, User, Settings, LogOut, ChevronLeft, ChevronRight } from "lucide-react";
import { DateRange } from "react-day-picker";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format, addYears, subYears, startOfMonth, endOfMonth, setMonth, setYear } from "date-fns";
import { cn } from "@/lib/utils";
import * as React from "react";
import { useState } from "react";

// --- START OF FIX for TS2322 (retained) ---
type DashboardButtonProps = React.ComponentProps<typeof Button>;

type AugmentedButtonProps = Omit<DashboardButtonProps, 'variant' | 'size'> & {
  variant: DashboardButtonProps['variant'] | 'outline' | 'ghost';
  size: DashboardButtonProps['size'] | 'icon';
};

const AugmentedButton = Button as React.ForwardRefExoticComponent<
    AugmentedButtonProps & React.RefAttributes<React.ElementRef<typeof Button>>
>;
// --- END OF FIX for TS2322 (retained) ---

interface DashboardHeaderProps {
  productFilter: "all" | "vto" | "vdr";
  setProductFilter: (filter: "all" | "vto" | "vdr") => void;
  dateRange: DateRange | undefined;
  setDateRange: (range: DateRange | undefined) => void;
}

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

export const DashboardHeader = ({
                                  productFilter,
                                  setProductFilter,
                                  dateRange,
                                  setDateRange,
                                }: DashboardHeaderProps) => {

  // State to manage the "View Year" inside the popover
  const [viewDate, setViewDate] = useState(new Date());
  const [isOpen, setIsOpen] = useState(false);

  const handlePreviousYear = () => setViewDate(subYears(viewDate, 1));
  const handleNextYear = () => setViewDate(addYears(viewDate, 1));

  const handleMonthSelect = (monthIndex: number) => {
    // Create the new date based on the current view year and selected month
    const newDate = setMonth(setYear(new Date(), viewDate.getFullYear()), monthIndex);

    const range: DateRange = {
      from: startOfMonth(newDate),
      to: endOfMonth(newDate)
    };

    setDateRange(range);
    setIsOpen(false); // Close popover after selection
  };

  return (
      <header className="h-16 border-b border-border bg-card flex items-center justify-between px-6 shadow-card">
        <div className="flex items-center gap-4">
          <h2 className="font-semibold text-lg text-foreground">Analytics Dashboard</h2>
        </div>

        <div className="flex items-center gap-4">

          {/* Month Picker Popover */}
          <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild>
              <AugmentedButton
                  variant="outline"
                  size="default"
                  className={cn(
                      "h-9 px-4 justify-start text-left font-normal w-[200px]",
                      !dateRange && "text-muted-foreground"
                  )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dateRange?.from ? (
                    // Display just the Month and Year
                    format(dateRange.from, "MMMM yyyy")
                ) : (
                    <span>Pick a month</span>
                )}
              </AugmentedButton>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-4" align="end">

              {/* Year Navigation Header */}
              <div className="flex items-center justify-between mb-4">
                <Button
                    variant="outline"
                    size="icon"
                    className="h-7 w-7"
                    onClick={handlePreviousYear}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <div className="font-semibold">
                  {format(viewDate, "yyyy")}
                </div>
                <Button
                    variant="outline"
                    size="icon"
                    className="h-7 w-7"
                    onClick={handleNextYear}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>

              {/* Month Grid */}
              <div className="grid grid-cols-3 gap-2">
                {MONTHS.map((month, index) => {
                  // Check if this specific month is currently selected
                  const isSelected = dateRange?.from &&
                      dateRange.from.getMonth() === index &&
                      dateRange.from.getFullYear() === viewDate.getFullYear();

                  return (
                      <Button
                          key={month}
                          variant={isSelected ? "default" : "ghost"}
                          size="sm"
                          onClick={() => handleMonthSelect(index)}
                          className={cn(
                              "text-xs h-9",
                              isSelected && "bg-primary text-primary-foreground hover:bg-primary/90"
                          )}
                      >
                        {month.substring(0, 3)} {/* Display Jan, Feb, etc. */}
                      </Button>
                  );
                })}
              </div>
            </PopoverContent>
          </Popover>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <AugmentedButton variant="ghost" size="icon" className="rounded-full">
                <Avatar className="h-9 w-9">
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    <User className="h-5 w-5" />
                  </AvatarFallback>
                </Avatar>
              </AugmentedButton>
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