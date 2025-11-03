import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Eye,
  Box,
  BarChart3,
  Activity,
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
  useSidebar,
} from "@/components/ui/sidebar";

interface DashboardSidebarProps {
  productFilter: "all" | "vto" | "vdr";
}

const menuItems = [
  { title: "Overview", url: "/", icon: LayoutDashboard },
  { title: "Virtual Try-On", url: "/vto", icon: Eye },
  { title: "Virtual Dressing Room", url: "/vdr", icon: Box },
  { title: "Analytics", url: "/analytics", icon: BarChart3 },
  { title: "Integration Health", url: "/integration", icon: Activity },
  { title: "Account & Billing", url: "/billing", icon: CreditCard },
];

export const DashboardSidebar = ({ productFilter }: DashboardSidebarProps) => {
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";

  return (
    <Sidebar className="border-r border-border">
      <SidebarContent className="bg-card">
        {/* Logo */}
        <div className="p-6 border-b border-border">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg gradient-primary flex items-center justify-center">
              <span className="text-white font-bold text-sm">U</span>
            </div>
            {!isCollapsed && (
              <span className="font-bold text-xl text-primary">UTRY</span>
            )}
          </div>
        </div>

        <SidebarGroup className="px-3 py-4">
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      end={item.url === "/"}
                      className={({ isActive }) =>
                        `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                          isActive
                            ? "bg-primary text-primary-foreground font-medium"
                            : "text-muted-foreground hover:bg-muted hover:text-foreground"
                        }`
                      }
                    >
                      <item.icon className="h-5 w-5 flex-shrink-0" />
                      {!isCollapsed && <span>{item.title}</span>}
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
