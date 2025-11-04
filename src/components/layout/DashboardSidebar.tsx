import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Camera,
  Shirt,
  Link2,
  CreditCard,
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
  { title: "Integration Health", url: "/integration", icon: Link2 },
  { title: "Subscription & Billing", url: "/billing", icon: CreditCard },
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
                    <SidebarMenuButton asChild>
                      <NavLink
                        to={item.url}
                        end={item.url === "/"}
                        className={({ isActive }) =>
                          `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                            isActive
                              ? "bg-primary/10 text-primary font-medium"
                              : "text-muted-foreground hover:bg-muted hover:text-foreground"
                          }`
                        }
                      >
                        <item.icon className="h-5 w-5" />
                        <span>{item.title}</span>
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
