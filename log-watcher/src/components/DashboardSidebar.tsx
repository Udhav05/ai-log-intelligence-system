import { Activity, AlertTriangle, BarChart3, FileText, LayoutDashboard, Shield } from "lucide-react";
import { NavLink } from "@/components/NavLink";

const navItems = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard },
  { title: "Logs", url: "/logs", icon: FileText },
  { title: "Alerts", url: "/alerts", icon: AlertTriangle },
  { title: "System Stats", url: "/stats", icon: BarChart3 },
];

export function DashboardSidebar() {
  return (
    <aside className="w-60 min-h-screen bg-sidebar border-r border-sidebar-border flex flex-col">
      <div className="p-5 border-b border-sidebar-border">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
            <Shield className="h-4 w-4 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-sm font-semibold text-sidebar-accent-foreground">LogMonitor</h1>
            <p className="text-[10px] text-sidebar-foreground">DevOps Dashboard</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-3 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.url}
            to={item.url}
            end={item.url === "/"}
            className="flex items-center gap-3 px-3 py-2.5 rounded-md text-sm text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors"
            activeClassName="bg-sidebar-accent text-primary font-medium"
          >
            <item.icon className="h-4 w-4" />
            <span>{item.title}</span>
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-sidebar-border">
        <div className="flex items-center gap-2 text-xs text-sidebar-foreground">
          <Activity className="h-3 w-3 text-primary animate-pulse-glow" />
          <span>Live • Auto-refresh 5s</span>
        </div>
      </div>
    </aside>
  );
}
