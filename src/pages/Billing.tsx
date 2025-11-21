import { useEffect, useMemo, useState } from "react";

import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import {Badge} from "@/components/ui/badge";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {Download, CreditCard, Users, Package, CheckCircle, XCircle} from "lucide-react";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from "recharts";
import {Button as PolarisButton} from "@shopify/polaris"
// ---------------------------------------------------------
// CHANGE 1: Remove the deprecated utils import
// import {getSessionToken} from "@shopify/app-bridge-utils";
// ---------------------------------------------------------
import {useAppBridge} from "@shopify/app-bridge-react";
import {useAuthenticatedApi} from "@/lib/api";

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

const usageHistory = [
    {month: "Nov", amount: 8124},
    {month: "Dec", amount: 7932},
    {month: "Jan", amount: 8467},
];

type BillingResponse = {
    oneTimeConfirmationUrl?: string;
    OneTimeConfirmationUrl?: string;
    confirmationUrl?: string;
};

type PlanDetails = {
    planName: string;
    pricePerUsage: number;
    currency: string;
};

const Billing = () => {
    // Use your custom hook that wraps fetch + app.idToken()
    const authenticatedApi = useAuthenticatedApi();
    const [currentPlan, setCurrentPlan] = useState<{ pricePerUsage: number, currency: string, planName: string } | null>(null);

    const [planDetails, setPlanDetails] = useState<PlanDetails | null>(null);



    useEffect(() => {
        const fetchPlan = async () => {
            const searchParams = new URLSearchParams(window.location.search);
            const shop = searchParams.get("shop");
            if(!shop) return;

            try {
                // Call your new endpoint
                const data = await authenticatedApi.get<PlanDetails>(
                    `/api/billing/current-plan?shop=${shop}`
                );
                // Assuming your api wrapper returns the json body directly
                setPlanDetails(data);
            } catch (e) {
                console.error("Failed to load plan details", e);
            }
        };
        fetchPlan();
    }, []);

    const handlePlanSelection = async (planName: string) => {
        try {
            console.log(`Initiating ${planName}...`);

            // 1. Get the shop from the URL (standard for embedded apps)
            const searchParams = new URLSearchParams(window.location.search);
            const shop = searchParams.get("shop");
            const host = searchParams.get("host");
            if (!shop || !host) {
                console.error("Shop or Host parameter missing");
                return;
            }

            // 2. Call your backend
            // Note: We pass 'plan' as a query param as expected by the new Controller
            const data = await authenticatedApi.get<BillingResponse>(
                `/api/billing/IntegrationFee?shop=${shop}&plan=${planName}&host=${host}`
            );

            const url = data.oneTimeConfirmationUrl || data.OneTimeConfirmationUrl || data.confirmationUrl;

            if (url) {
                window.open(url, "_top");
            } else {
                console.error("No confirmation URL returned", data);
            }
        } catch (err) {
            console.error("Billing error", err);
        }
    };

    return (
        <div className="space-y-6">

            {/* Usage Overview - unchanged ... */}
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
                                {/* 3. Display the value dynamically */}
                                {planDetails
                                    ? `$${planDetails.pricePerUsage} ${planDetails.currency}`
                                    : "Loading..."}
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

                    {/* Usage History Chart */}
                    <div className="pt-4 border-t border-border">
                        <h3 className="text-sm font-semibold mb-4">Last 3 Months</h3>
                        <ResponsiveContainer width="100%" height={200}>
                            <BarChart data={usageHistory}>
                                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))"/>
                                <XAxis
                                    dataKey="month"
                                    stroke="hsl(var(--muted-foreground))"
                                    fontSize={12}
                                />
                                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12}/>
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: "hsl(var(--card))",
                                        border: "1px solid hsl(var(--border))",
                                        borderRadius: "8px",
                                    }}
                                    formatter={(value) => [`${value} DKK`, "Amount"]}
                                />
                                <Bar
                                    dataKey="amount"
                                    fill="hsl(var(--primary))"
                                    radius={[8, 8, 0, 0]}
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </CardContent>
            </Card>

            {/* Active Subscriptions - unchanged ... */}
            <Card className="shadow-card">
                <CardHeader>
                    <CardTitle>Active Subscriptions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center justify-between p-4 rounded-lg border border-border">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                                <CheckCircle className="h-5 w-5 text-success"/>
                            </div>
                            <div>
                                <div className="font-semibold">Virtual Try-On Subscription</div>
                                <div className="text-sm text-muted-foreground">Photo-based try-on technology</div>
                            </div>
                        </div>
                        <Badge className="bg-success/10 text-success hover:bg-success/20">
                            Active
                        </Badge>
                    </div>
                    <div className="flex items-center justify-between p-4 rounded-lg border border-border">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                                <CheckCircle className="h-5 w-5 text-success"/>
                            </div>
                            <div>
                                <div className="font-semibold">Virtual Dressing Room Subscription</div>
                                <div className="text-sm text-muted-foreground">3D garment visualization</div>
                            </div>
                        </div>
                        <Badge className="bg-success/10 text-success hover:bg-success/20">
                            Active
                        </Badge>
                    </div>
                </CardContent>
            </Card>



            {/* Account Summary - unchanged ... */}
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
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-border">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                                <CreditCard className="h-5 w-5 text-primary"/>
                            </div>
                            <div>
                                <div className="text-sm text-muted-foreground">Renewal Date</div>
                                <div className="font-semibold">Feb 1, 2024</div>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                                <Users className="h-5 w-5 text-primary"/>
                            </div>
                            <div>
                                <div className="text-sm text-muted-foreground">Monthly Active Users</div>
                                <div className="font-semibold">3,528</div>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                                <Package className="h-5 w-5 text-primary"/>
                            </div>
                            <div>
                                <div className="text-sm text-muted-foreground">Products Uploaded</div>
                                <div className="font-semibold">247</div>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card className="shadow-card">
                <CardHeader><CardTitle>Subscription plans</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* STARTER PLAN */}
                        <div className="p-4 rounded-lg border border-border flex flex-col justify-between">
                            <div>
                                <div className="text-xl text-muted-foreground mb-1">Starter</div>
                                <p className="mb-4 text-sm text-gray-600">For small and growing brands</p>
                                <div className="text-xl font-bold pb-4">1,550 <span className="text-base font-normal text-muted-foreground">/month</span></div>
                                <p className="text-sm text-gray-600 mb-4">Integration: 8 unique designs + setup ($2,325 one-time)</p>

                                <ul className="list-none space-y-0.5 mb-2 text-sm">
                                    <li className="flex items-center">
                                        <span className="mr-2 text-green-500">✔</span>
                                        5,000 users included
                                    </li>
                                    <li className="flex items-center">
                                        <span className="mr-2 text-green-500">✔</span>
                                        KPI tracking included
                                    </li>
                                    <li className="flex items-center">
                                        <span className="mr-2 text-green-500">✔</span>
                                        Analytics dashboard
                                    </li>
                                    <li className="flex items-center">
                                        <span className="mr-2 text-green-500">✔</span>
                                        UTRY Buttons
                                    </li>
                                    <li className="flex items-center">
                                        <span className="mr-2"></span>
                                        $0.39 per additional user
                                    </li>
                                    <li className="flex items-center">
                                        <span className="mr-2"></span>
                                        $310 per additional unique design
                                    </li>
                                </ul>
                            </div>
                            <Button
                                onClick={() => handlePlanSelection("standard-plan")}
                            >
                                Select Starter Plan
                            </Button>
                        </div>
                        {/* GROWTH PLAN */}
                        <div className="p-4 rounded-lg border border-primary ring-2 ring-primary relative flex flex-col justify-between">
                            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-orange-500 text-white text-xs font-semibold py-1 px-3 rounded-full uppercase shadow-md">
                                Most Popular
                            </div>
                            <div>
                                <div className="text-xl text-primary mb-1 mt-4">Growth</div>
                                <p className="mb-4 text-sm text-gray-600">For scaling businesses with higher volume</p>

                                <div className="text-3xl font-bold pb-4">$4,190 <span className="text-base font-normal text-muted-foreground">/month</span></div>

                                <p className="text-sm text-gray-600 mb-4">Integration: 15 unique designs + setup ($3,490 one-time)</p>

                                <ul className="list-none space-y-0.5 mb-2 text-sm">
                                    <li className="flex items-center">
                                        <span className="mr-2 text-green-500">✔</span>
                                        15,000 users included
                                    </li>
                                    <li className="flex items-center">
                                        <span className="mr-2 text-green-500">✔</span>
                                        KPI tracking included
                                    </li>
                                    <li className="flex items-center">
                                        <span className="mr-2 text-green-500">✔</span>
                                        Customizable analytics dashboard
                                    </li>
                                    <li className="flex items-center">
                                        <span className="mr-2 text-green-500">✔</span>
                                        Customizable UTRY Buttons
                                    </li>
                                    <li className="flex items-center">
                                        <span className="mr-2"></span>
                                        $0.34 per additional user
                                    </li>
                                    <li className="flex items-center">
                                        <span className="mr-2"></span>
                                        $271 per additional unique design
                                    </li>
                                </ul>
                            </div>
                            <Button
                                onClick={() => handlePlanSelection("growth-plan")}
                            >
                                Select Growth Plan
                            </Button>
                        </div>
                        {/* ENTERPRISE PLAN */}
                        <div className="p-4 rounded-lg border border-border flex flex-col justify-between">
                            <div>
                                <div className="text-sm text-muted-foreground mb-1">Enterprise</div>
                                <p className="mb-4 text-sm text-gray-600">For large-scale operations & custom solutions</p>
                                <div className="text-xl font-bold mb-4">Custom pricing</div>

                                <ul className="list-none space-y-0.5 mb-2 text-sm">
                                    <li className="flex items-center">
                                        <span className="mr-2 text-green-500">✔</span>
                                        All Growth features
                                    </li>
                                    <li className="flex items-center">
                                        <span className="mr-2 text-green-500">✔</span>
                                        Full API access & custom integrations
                                    </li>
                                    <li className="flex items-center">
                                        <span className="mr-2 text-green-500">✔</span>
                                        White-label solution
                                    </li>
                                    <li className="flex items-center">
                                        <span className="mr-2 text-green-500">✔</span>
                                        Dedicated account manager
                                    </li>
                                    <li className="flex items-center">
                                        <span className="mr-2 text-green-500">✔</span>
                                        Custom development & SLAs
                                    </li>
                                    <li className="flex items-center">
                                        <span className="mr-2 text-green-500">✔</span>
                                        Unlimited users
                                    </li>
                                </ul>
                            </div>
                            <Button
                                className="w-full "
                            >
                                Book Demo
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default Billing;