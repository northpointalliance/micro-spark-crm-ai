
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Home,
  Users,
  MessageCircle,
  BarChart2,
  Settings,
  Mail,
  Menu,
  X
} from "lucide-react";

type NavItem = {
  title: string;
  href: string;
  icon: React.ReactNode;
};

const navItems: NavItem[] = [
  {
    title: "Dashboard",
    href: "/",
    icon: <Home className="h-5 w-5" />,
  },
  {
    title: "Contacts",
    href: "/contacts",
    icon: <Users className="h-5 w-5" />,
  },
  {
    title: "Messages",
    href: "/messages",
    icon: <MessageCircle className="h-5 w-5" />,
  },
  {
    title: "Email",
    href: "/email",
    icon: <Mail className="h-5 w-5" />,
  },
  {
    title: "Analytics",
    href: "/analytics",
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

  return (
    <div
      className={cn(
        "flex flex-col h-screen bg-white border-r border-gray-200 transition-all duration-300",
        collapsed ? "w-20" : "w-64"
      )}
    >
      <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200">
        {!collapsed && (
          <h1 className="text-lg font-semibold text-crm-blue">MicroCRM</h1>
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
              "hover:bg-crm-blue-light hover:text-crm-blue",
              location.pathname === item.href
                ? "bg-crm-blue-light text-crm-blue"
                : "text-crm-gray-dark",
              collapsed ? "justify-center" : "justify-start"
            )}
          >
            {item.icon}
            {!collapsed && <span className="ml-3">{item.title}</span>}
          </Link>
        ))}
      </nav>

      <div className="p-4 border-t border-gray-200">
        <div 
          className={cn(
            "flex items-center p-2 rounded-md bg-crm-blue-light text-crm-blue text-xs",
            collapsed ? "justify-center" : "px-3"
          )}
        >
          {!collapsed && "Free Plan"} 
          {collapsed && "FREE"}
        </div>
      </div>
    </div>
  );
}
