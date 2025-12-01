import {useEffect, useMemo, useState, useCallback} from "react"; // 1. Import useCallback
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import {Badge} from "@/components/ui/badge";
import {CreditCard, Users, Package} from "lucide-react";
import {useAuthenticatedApi} from "@/lib/api";
import { toast } from "sonner";

// --- Types remain the same ---
type BillingResponse = {
    oneTimeConfirmationUrl?: string;
    OneTimeConfirmationUrl?: string;
    confirmationUrl?: string;
};

type PlanDetails = {
    planName: string;
    pricePerUsage: number;
    currency: string;
    monthlyFee: number;
    usageLimit: number;
    renewalDate: string;
    productsUploaded: number;
};

type CalculationsResponse = {
    totalUsers: number;
    totalTryOns: number; // Add for type safety, even if not used here
};

type SeedResponse = {
    Message: string;
};

type DeleteResponse = {
    Message: string;
};


const Billing = () => {
    const authenticatedApi = useAuthenticatedApi();
    const [planDetails, setPlanDetails] = useState<PlanDetails | null>(null);
    const [totalUsers, setTotalUsers] = useState<number>(0);
    const [previousMonthCost, setPreviousMonthCost] = useState<number>(0);
    const [costPercentageChange, setCostPercentageChange] = useState<number | null>(null);
    const [isSeeding, setIsSeeding] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    // 2. Add a general loading state for better UX
    const [isLoading, setIsLoading] = useState(true);

    // 3. Centralize data fetching logic into a useCallback hook
    const fetchData = useCallback(async () => {
        setIsLoading(true);
        try {
            const planData = await authenticatedApi.get<PlanDetails>(`/api/Dashboard/GetCurrentPlanDetails`);
            if (!planData) {
                console.error("Could not retrieve plan details.");
                toast.error("Could not retrieve plan details.");
                return;
            }
            setPlanDetails(planData);

            const today = new Date();
            const currentMonthStart = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), 1)).toISOString();
            const currentMonthEnd = today.toISOString();
            const prevMonthStart = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth() - 1, 1)).toISOString();
            const lastDayPrevMonth = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), 0));
            lastDayPrevMonth.setUTCHours(23, 59, 59, 999);
            const prevMonthEnd = lastDayPrevMonth.toISOString();

            const [currentMonthUsage, previousMonthUsage] = await Promise.all([
                authenticatedApi.get<CalculationsResponse>(`/api/Dashboard/GetCalculations?from=${currentMonthStart}&to=${currentMonthEnd}`),
                authenticatedApi.get<CalculationsResponse>(`/api/Dashboard/GetCalculations?from=${prevMonthStart}&to=${prevMonthEnd}`)
            ]);

            const currentUsers = currentMonthUsage?.totalUsers ?? 0;
            const previousUsers = previousMonthUsage?.totalUsers ?? 0;

            setTotalUsers(currentUsers);

            const {monthlyFee, usageLimit, pricePerUsage} = planData;
            const calculateCost = (users: number) => {
                const overage = Math.max(0, users - usageLimit);
                const overageCost = overage * pricePerUsage;
                return monthlyFee + overageCost;
            };

            const prevTotalCost = previousUsers > 0 ? calculateCost(previousUsers) : 0;
            setPreviousMonthCost(prevTotalCost);

            const currentTotalCost = calculateCost(currentUsers);

            if (prevTotalCost > 0) {
                const change = ((currentTotalCost - prevTotalCost) / prevTotalCost) * 100;
                setCostPercentageChange(change);
            } else if (currentTotalCost > 0) {
                setCostPercentageChange(100);
            } else {
                setCostPercentageChange(0);
            }

        } catch (e) {
            console.error("Failed to load billing data", e);
            toast.error("Failed to load billing data.");
            setPreviousMonthCost(0);
            setCostPercentageChange(null);
        } finally {
            setIsLoading(false);
        }
    }, [authenticatedApi]);

    // 4. useEffect now simply calls our new fetchData function
    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const currentMonthEstimate = useMemo(() => {
        if (isLoading && !planDetails) return "Calculating...";
        if (!planDetails) return "Not available";

        const {monthlyFee, usageLimit, pricePerUsage, currency} = planDetails;
        const overage = Math.max(0, totalUsers - usageLimit);
        const totalCost = monthlyFee + (overage * pricePerUsage);
        return totalCost.toLocaleString('en-US', {style: 'currency', currency: currency});
    }, [planDetails, totalUsers, isLoading]);

    const handlePlanSelection = async (planName: string) => {
        try {
            const searchParams = new URLSearchParams(window.location.search);
            const shop = searchParams.get("shop");
            const host = searchParams.get("host");
            if (!shop || !host) {
                console.error("Shop or Host parameter missing");
                return;
            }
            const data = await authenticatedApi.get<BillingResponse>(
                `/api/billing/IntegrationFee?shop=${shop}&plan=${planName}&host=${host}`
            );
            const url = data.oneTimeConfirmationUrl || data.OneTimeConfirmationUrl || data.confirmationUrl;
            if (url) {
                window.open(url, "_top");
            } else {
                console.error("No confirmation URL returned", data);
                toast.error("Could not get billing confirmation URL.");
            }
        } catch (err) {
            console.error("Billing error", err);
            toast.error("An error occurred during plan selection.");
        }
    };

    const getShopAndPreviousMonthParams = () => {
        const searchParams = new URLSearchParams(window.location.search);
        const shop = searchParams.get("shop");
        if (!shop) {
            toast.error("Could not find shop parameter in URL.");
            return null;
        }

        const today = new Date();
        const utcYear = today.getUTCFullYear();
        const utcMonth = today.getUTCMonth();
        const prevMonthDate = new Date(Date.UTC(utcYear, utcMonth - 1, 1));
        const year = prevMonthDate.getUTCFullYear();
        const month = prevMonthDate.getUTCMonth() + 1;

        return { shop, year, month };
    };

    // 5. Update handleSeedData to call fetchData instead of reloading
    const handleSeedData = async () => {
        const params = getShopAndPreviousMonthParams();
        if (!params) return;

        setIsSeeding(true);
        try {
            const { shop, year, month } = params;
            const userCount = 150;

            const response = await authenticatedApi.post<SeedResponse>(
                `/api/Dashboard/SeedPreviousMonthUsage?shop=${shop}&year=${year}&month=${month}&userCount=${userCount}`,
                {}
            );

            toast.success("Seeding successful!", { description: "Refreshing data..." });
            await fetchData(); // Re-fetch data programmatically
        } catch (err) {
            console.error("Seeding error", err);
            toast.error("Seeding failed.", { description: "Check the console for details." });
        } finally {
            setIsSeeding(false);
        }
    };

    // 6. Update handleDeleteData to call fetchData as well
    const handleDeleteData = async () => {
        const params = getShopAndPreviousMonthParams();
        if (!params) return;

        setIsDeleting(true);
        try {
            const { shop, year, month } = params;
            const response = await authenticatedApi.delete<DeleteResponse>(
                `/api/Dashboard/DeletePreviousMonthUsage?shop=${shop}&year=${year}&month=${month}`
            );

            toast.success("Deletion successful!", { description: "Refreshing data..." });
            await fetchData(); // Re-fetch data programmatically
        } catch (err) {
            console.error("Deletion error", err);
            toast.error("Deletion failed.", { description: "Check the console for details." });
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Testing Utilities</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                        Use these buttons to manage test data for the previous month.
                    </p>
                    <div className="flex gap-2">
                        {/* Disable buttons during any loading activity */}
                        <Button onClick={handleSeedData} disabled={isSeeding || isDeleting || isLoading}>
                            {isSeeding ? "Seeding..." : "Seed Previous Month's Data"}
                        </Button>
                        <Button onClick={handleDeleteData} disabled={isSeeding || isDeleting || isLoading} variant="destructive">
                            {isDeleting ? "Deleting..." : "Delete Previous Month's Data"}
                        </Button>
                    </div>
                </CardContent>
            </Card>

            <Card className="shadow-card">
                <CardHeader>
                    <CardTitle>Usage Overview</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                        <div>
                            <div className="text-sm text-muted-foreground mb-1">
                                Cost Per Unique User
                            </div>
                            <div className="text-2xl font-bold">
                                {isLoading && !planDetails ? "Loading..." : (planDetails
                                    ? `${planDetails.pricePerUsage.toLocaleString('en-US', {
                                        style: 'currency',
                                        currency: planDetails.currency
                                    })}`
                                    : "Not available")}
                            </div>
                        </div>
                        <Badge variant="outline" className="bg-background">
                            {planDetails?.planName || "Current Plan"}
                        </Badge>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-4 rounded-lg border border-border">
                            <div className="text-sm text-muted-foreground mb-1">
                                Current Month Estimate
                            </div>
                            <div className="text-xl font-bold">{currentMonthEstimate}</div>
                            <div className="text-sm text-muted-foreground mt-1">
                                Based on {totalUsers.toLocaleString()} MAU
                            </div>
                        </div>
                        <div className="p-4 rounded-lg border border-border">
                            <div className="text-sm text-muted-foreground mb-1">
                                Previous Month
                            </div>
                            <div className="text-xl font-bold">
                                {isLoading ? "Loading..." : (planDetails
                                    ? previousMonthCost.toLocaleString('en-US', {
                                        style: 'currency',
                                        currency: planDetails.currency
                                    })
                                    : "Not available")}
                            </div>
                            <div className="text-sm mt-1">
                                {isLoading ? "Calculating..." : (costPercentageChange !== null ? (
                                    <span className={costPercentageChange >= 0 ? 'text-green-600' : 'text-red-500'}>
                                        {costPercentageChange >= 0 ? '+' : ''}{costPercentageChange.toFixed(1)}% vs prior month
                                    </span>
                                ) : (
                                    <span className="text-muted-foreground">
                                        No data for prior month
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* ... Rest of your JSX remains the same ... */}
            <Card className="shadow-card">
                <CardHeader>
                    <CardTitle>Current Plan</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="flex items-start justify-between">
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <h3 className="text-2xl font-bold">{planDetails?.planName || 'Loading...'}</h3>
                                <Badge className="bg-accent/10 text-accent hover:bg-accent/20">
                                    Active
                                </Badge>
                            </div>
                            <p className="text-muted-foreground">
                                Full access to VTO & VDR with priority support
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-border">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                                <CreditCard className="h-5 w-5 text-primary"/>
                            </div>
                            <div>
                                <div className="text-sm text-muted-foreground">Renewal Date</div>
                                <div className="font-semibold">{planDetails?.renewalDate || '...'}</div>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                                <Users className="h-5 w-5 text-primary"/>
                            </div>
                            <div>
                                <div className="text-sm text-muted-foreground">Monthly Active Users</div>
                                <div className="font-semibold">{totalUsers.toLocaleString() || '...'}</div>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                                <Package className="h-5 w-5 text-primary"/>
                            </div>
                            <div>
                                <div className="text-sm text-muted-foreground">Products Uploaded</div>
                                <div className="font-semibold">{planDetails?.productsUploaded?.toLocaleString() || '...'}</div>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>


            <Card className="shadow-card">
                <CardHeader><CardTitle>Subscription plans</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="p-4 rounded-lg border border-border flex flex-col justify-between">
                            <div>
                                <div className="text-xl text-muted-foreground mb-1">Starter</div>
                                <p className="mb-4 text-sm text-gray-600">For small and growing brands</p>
                                <div className="text-xl font-bold pb-4">1,550 <span
                                    className="text-base font-normal text-muted-foreground">/month</span></div>
                                <p className="text-sm text-gray-600 mb-4">Integration: 8 unique designs + setup ($2,325
                                    one-time)</p>

                                <ul className="list-none space-y-0.5 mb-2 text-sm">
                                    <li className="flex items-center"><span className="mr-2 text-green-500">✔</span>5,000
                                        users included
                                    </li>
                                    <li className="flex items-center"><span className="mr-2 text-green-500">✔</span>KPI
                                        tracking included
                                    </li>
                                    <li className="flex items-center"><span className="mr-2 text-green-500">✔</span>Analytics
                                        dashboard
                                    </li>
                                    <li className="flex items-center"><span className="mr-2 text-green-500">✔</span>UTRY
                                        Buttons
                                    </li>
                                    <li className="flex items-center"><span className="mr-2"></span>$0.39 per additional
                                        user
                                    </li>
                                    <li className="flex items-center"><span className="mr-2"></span>$310 per additional
                                        unique design
                                    </li>
                                </ul>
                            </div>
                            <Button onClick={() => handlePlanSelection("standard-plan")}>Select Starter Plan</Button>
                        </div>
                        <div
                            className="p-4 rounded-lg border border-primary ring-2 ring-primary relative flex flex-col justify-between">
                            <div
                                className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-orange-500 text-white text-xs font-semibold py-1 px-3 rounded-full uppercase shadow-md">
                                Most Popular
                            </div>
                            <div>
                                <div className="text-xl text-primary mb-1 mt-4">Growth</div>
                                <p className="mb-4 text-sm text-gray-600">For scaling businesses with higher volume</p>
                                <div className="text-3xl font-bold pb-4">$4,190 <span
                                    className="text-base font-normal text-muted-foreground">/month</span></div>
                                <p className="text-sm text-gray-600 mb-4">Integration: 15 unique designs + setup ($3,490
                                    one-time)</p>
                                <ul className="list-none space-y-0.5 mb-2 text-sm">
                                    <li className="flex items-center"><span className="mr-2 text-green-500">✔</span>15,000
                                        users included
                                    </li>
                                    <li className="flex items-center"><span className="mr-2 text-green-500">✔</span>KPI
                                        tracking included
                                    </li>
                                    <li className="flex items-center"><span className="mr-2 text-green-500">✔</span>Customizable
                                        analytics dashboard
                                    </li>
                                    <li className="flex items-center"><span className="mr-2 text-green-500">✔</span>Customizable
                                        UTRY Buttons
                                    </li>
                                    <li className="flex items-center"><span className="mr-2"></span>$0.34 per additional
                                        user
                                    </li>
                                    <li className="flex items-center"><span className="mr-2"></span>$271 per additional
                                        unique design
                                    </li>
                                </ul>
                            </div>
                            <Button onClick={() => handlePlanSelection("growth-plan")}>Select Growth Plan</Button>
                        </div>
                        <div className="p-4 rounded-lg border border-border flex flex-col justify-between">
                            <div>
                                <div className="text-sm text-muted-foreground mb-1">Enterprise</div>
                                <p className="mb-4 text-sm text-gray-600">For large-scale operations & custom
                                    solutions</p>
                                <div className="text-xl font-bold mb-4">Custom pricing</div>
                                <ul className="list-none space-y-0.5 mb-2 text-sm">
                                    <li className="flex items-center"><span className="mr-2 text-green-500">✔</span>All
                                        Growth features
                                    </li>
                                    <li className="flex items-center"><span className="mr-2 text-green-500">✔</span>Full
                                        API access & custom integrations
                                    </li>
                                    <li className="flex items-center"><span className="mr-2 text-green-500">✔</span>White-label
                                        solution
                                    </li>
                                    <li className="flex items-center"><span className="mr-2 text-green-500">✔</span>Dedicated
                                        account manager
                                    </li>
                                    <li className="flex items-center"><span className="mr-2 text-green-500">✔</span>Custom
                                        development & SLAs
                                    </li>
                                    <li className="flex items-center"><span className="mr-2 text-green-500">✔</span>Unlimited
                                        users
                                    </li>
                                </ul>
                            </div>
                            <Button className="w-full ">Book Demo</Button>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default Billing;