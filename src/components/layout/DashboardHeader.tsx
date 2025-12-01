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
import { format, addYears, subYears, startOfMonth, endOfMonth, setMonth, setYear } from "date-fns";
import { cn } from "@/lib/utils";
import * as React from "react";
import { useState } from "react";
import { Button as PolarisButton } from "@shopify/polaris";
// Import the entire module as a namespace
import * as PolarisIcons from '@shopify/polaris-icons';

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

    const [viewDate, setViewDate] = useState(new Date());
    const [isOpen, setIsOpen] = useState(false);

    const handlePreviousYear = () => setViewDate(subYears(viewDate, 1));
    const handleNextYear = () => setViewDate(addYears(viewDate, 1));

    const handleMonthSelect = (monthIndex: number) => {
        const newDate = setMonth(viewDate, monthIndex);
        const range: DateRange = {
            from: startOfMonth(newDate),
            to: endOfMonth(newDate)
        };
        setDateRange(range);
        setIsOpen(false);
    };

    return (
        <header className="h-16 border-b border-border bg-card flex items-center justify-between px-6 shadow-card">
            <div className="flex items-center gap-4">
                <h2 className="font-semibold text-lg text-foreground">Analytics Dashboard</h2>
            </div>

            <div className="flex items-center gap-4">
                <Popover open={isOpen} onOpenChange={setIsOpen}>
                    <PopoverTrigger asChild>
                        <Button
                            variant="outline"
                            size="default"
                            className={cn(
                                "h-9 px-4 justify-start text-left font-normal w-[200px]",
                                !dateRange && "text-muted-foreground"
                            )}
                        >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {dateRange?.from ? (
                                format(dateRange.from, "MMMM yyyy")
                            ) : (
                                <span>Pick a month</span>
                            )}
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-4" align="end">
                        <div className="flex items-center justify-between mb-4">
                            {/* THIS IS THE FIX: Use the correct icon names */}
                            <PolarisButton
                                onClick={handlePreviousYear}
                                accessibilityLabel="Previous year"
                                icon={PolarisIcons.ChevronLeftIcon}
                            />
                            <div className="font-semibold">{format(viewDate, "yyyy")}</div>
                            <PolarisButton
                                onClick={handleNextYear}
                                accessibilityLabel="Next year"
                                icon={PolarisIcons.ChevronRightIcon}
                            />
                        </div>
                        <div className="grid grid-cols-3 gap-2">
                            {MONTHS.map((month, index) => {
                                const isSelected = dateRange?.from &&
                                    dateRange.from.getMonth() === index &&
                                    dateRange.from.getFullYear() === viewDate.getFullYear();
                                return (
                                    <PolarisButton
                                        key={month}
                                        primary={isSelected}
                                        plain={!isSelected}
                                        onClick={() => handleMonthSelect(index)}
                                    >
                                        {month.substring(0, 3)}
                                    </PolarisButton>
                                );
                            })}
                        </div>
                    </PopoverContent>
                </Popover>

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