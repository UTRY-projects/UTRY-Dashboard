import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Camera,
  Shirt,
  Link2,
  CreditCard,
  ClipboardList,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarHeader,
} from "@/components/ui/sidebar";

interface DashboardSidebarProps {
  productFilter: "all" | "vto" | "vdr";
}

const menuItems = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard },
  { title: "Virtual Try-On", url: "/vto", icon: Camera },
  { title: "Virtual Dressing Room", url: "/vdr", icon: Shirt },
  { title: "Integrate with Shopify & Integration health", url: "/integration", icon: Link2 },
  { title: "Subscription & Billing", url: "/billing", icon: CreditCard },
  { title: "UTRY - Virtual Fitting Room Explained", url: "/UIExplanation", icon: ClipboardList }
];

export const DashboardSidebar = ({ productFilter }: DashboardSidebarProps) => {
  return (
    <Sidebar className="border-r border-border bg-card" collapsible="none">
      <SidebarHeader className="border-b border-border p-6">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-gradient-primary flex items-center justify-center">
            <span className="text-white font-bold text-sm">U</span>
          </div>
          <span className="font-bold text-xl text-foreground">UTRY</span>
        </div>
      </SidebarHeader>
      <SidebarContent className="pt-6">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {menuItems
                .filter((item) => {
                  if (productFilter === "vto" && item.url === "/vdr") return false;
                  if (productFilter === "vdr" && item.url === "/vto") return false;
                  return true;
                })
                .map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                        asChild
                        className="!h-auto !min-h-10 !whitespace-normal !overflow-visible"
                    >
                      <NavLink
                        to={item.url}
                        end={item.url === "/"}
                        className={({ isActive }) =>
                          `flex items-start gap-3 px-4 py-3 w-full rounded-lg transition-colors text-left !h-auto !min-h-10 !whitespace-normal !overflow-visible ${
                            isActive
                              ? "bg-primary/10 text-primary font-medium"
                              : "text-muted-foreground hover:bg-muted hover:text-foreground"
                          }`
                        }
                      >
                        <item.icon className="h-5 w-5 shrink-0 self-start" />
                        <span className="block flex-1 min-w-0 whitespace-normal break-words [overflow-wrap:anywhere] leading-snug"
                              style={{ whiteSpace: "normal" }}
                        >{item.title}</span>
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};
