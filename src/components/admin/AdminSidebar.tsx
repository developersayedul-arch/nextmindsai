import { useLocation, Link } from "react-router-dom";
import { 
  LayoutDashboard, 
  FileText, 
  Users, 
  Eye, 
  Shield, 
  Globe,
  LogOut,
  Home,
  Target
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

const menuItems = [
  { 
    title: "ড্যাশবোর্ড", 
    url: "/admin", 
    icon: LayoutDashboard,
    description: "Overview & stats"
  },
  { 
    title: "লিডস", 
    url: "/admin/leads", 
    icon: Target,
    description: "সব লিড দেখুন"
  },
  { 
    title: "এনালাইসিস", 
    url: "/admin/analyses", 
    icon: FileText,
    description: "Business analyses"
  },
  { 
    title: "ভিজিটর", 
    url: "/admin/visitors", 
    icon: Eye,
    description: "Visitor tracking"
  },
  { 
    title: "সার্ভিস", 
    url: "/admin/services", 
    icon: Globe,
    description: "SA Coder services"
  },
  { 
    title: "সিকিউরিটি", 
    url: "/admin/security", 
    icon: Shield,
    description: "Login attempts"
  },
];

const AdminSidebar = () => {
  const location = useLocation();
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const { signOut } = useAuth();

  const isActive = (path: string) => {
    if (path === "/admin") {
      return location.pathname === "/admin";
    }
    return location.pathname.startsWith(path);
  };

  return (
    <Sidebar collapsible="icon" className="border-r border-border">
      <SidebarHeader className="border-b border-border p-4">
        <Link to="/admin" className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center">
            <Shield className="h-4 w-4 text-primary-foreground" />
          </div>
          {!collapsed && (
            <div className="flex flex-col">
              <span className="font-bold text-sm">SA Coder</span>
              <span className="text-xs text-muted-foreground">Admin Panel</span>
            </div>
          )}
        </Link>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>মেনু</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    asChild 
                    isActive={isActive(item.url)}
                    tooltip={item.title}
                  >
                    <Link to={item.url} className="flex items-center gap-3">
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-border p-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild tooltip="হোম">
              <Link to="/" className="flex items-center gap-3">
                <Home className="h-4 w-4" />
                <span>হোমে ফিরুন</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton 
              onClick={() => signOut()}
              tooltip="লগআউট"
              className="text-destructive hover:text-destructive hover:bg-destructive/10"
            >
              <LogOut className="h-4 w-4" />
              <span>লগআউট</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
};

export default AdminSidebar;
