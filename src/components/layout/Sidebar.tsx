
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import {
  Clock,
  MapPin,
  Users,
  FileText,
  BarChart2,
  Settings,
  Menu,
  X,
  Shield
} from "lucide-react";

type NavItem = {
  title: string;
  href: string;
  icon: React.ReactNode;
};

const navItems: NavItem[] = [
  {
    title: "Time Clock",
    href: "/",
    icon: <Clock className="h-5 w-5" />,
  },
  {
    title: "Job Sites",
    href: "/job-sites",
    icon: <MapPin className="h-5 w-5" />,
  },
  {
    title: "Workers",
    href: "/workers",
    icon: <Users className="h-5 w-5" />,
  },
  {
    title: "Timesheets",
    href: "/timesheets",
    icon: <FileText className="h-5 w-5" />,
  },
  {
    title: "Reports",
    href: "/reports",
    icon: <BarChart2 className="h-5 w-5" />,
  },
  {
    title: "Settings",
    href: "/settings",
    icon: <Settings className="h-5 w-5" />,
  },
];

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const { isAdmin } = useAuth();

  const adminItems: NavItem[] = [
    {
      title: "Admin Panel",
      href: "/admin",
      icon: <Shield className="h-5 w-5" />,
    },
  ];

  return (
    <div
      className={cn(
        "flex flex-col h-screen bg-sidebar-background border-r border-sidebar-border transition-all duration-300",
        collapsed ? "w-20" : "w-64"
      )}
    >
      <div className="flex items-center justify-between h-16 px-4 border-b border-sidebar-border">
        {!collapsed && (
          <h1 className="text-lg font-bold text-primary">FieldClock</h1>
        )}
        <Button
          variant="ghost"
          size="sm"
          className="ml-auto"
          onClick={() => setCollapsed(!collapsed)}
        >
          {collapsed ? <Menu size={20} /> : <X size={20} />}
        </Button>
      </div>

      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {navItems.map((item) => (
          <Link
            key={item.href}
            to={item.href}
            className={cn(
              "flex items-center p-3 text-sm font-medium rounded-md transition-colors",
              "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
              location.pathname === item.href
                ? "bg-sidebar-accent text-primary"
                : "text-sidebar-foreground",
              collapsed ? "justify-center" : "justify-start"
            )}
          >
            {item.icon}
            {!collapsed && <span className="ml-3">{item.title}</span>}
          </Link>
        ))}
      </nav>

      {isAdmin && (
        <nav className="px-4 pb-2 space-y-2 border-t border-sidebar-border pt-2">
          {adminItems.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                "flex items-center p-3 text-sm font-medium rounded-md transition-colors",
                "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                location.pathname === item.href
                  ? "bg-sidebar-accent text-primary"
                  : "text-sidebar-foreground",
                collapsed ? "justify-center" : "justify-start"
              )}
            >
              {item.icon}
              {!collapsed && <span className="ml-3">{item.title}</span>}
            </Link>
          ))}
        </nav>
      )}

      <div className="p-4 border-t border-sidebar-border">
        <div 
          className={cn(
            "flex items-center p-2 rounded-md bg-primary/10 text-primary text-xs font-semibold",
            collapsed ? "justify-center" : "px-3"
          )}
        >
          {!collapsed && "$15/user"} 
          {collapsed && "$15"}
        </div>
      </div>
    </div>
  );
}
