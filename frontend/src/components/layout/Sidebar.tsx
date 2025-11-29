import { Link, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, 
  PlusCircle, 
  History, 
  MessageSquare, 
  TrendingUp
} from "lucide-react";
import { cn } from "@/lib/utils";

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
  { icon: PlusCircle, label: "Add Trade", path: "/add-trade" },
  { icon: History, label: "History", path: "/history" },
  { icon: MessageSquare, label: "AI Coach", path: "/chat" },
];

export function Sidebar() {
  const location = useLocation();

  return (
    <div className="fixed left-0 top-0 h-full w-64 bg-gradient-to-b from-slate-900 via-purple-900/20 to-slate-900 border-r border-purple-500/20 shadow-2xl">
      {/* Logo */}
      <div className="p-6 border-b border-purple-500/20">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-neon-cyan to-neon-purple rounded-lg shadow-neon-cyan">
            <TrendingUp className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-neon-cyan to-neon-purple bg-clip-text text-transparent">
              Trading Journal
            </h1>
            <p className="text-xs text-muted-foreground">AI-Powered</p>
          </div>
        </div>
      </div>

      {/* Menu Items */}
      <nav className="p-4 space-y-2 mt-4">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group",
                isActive
                  ? "bg-gradient-to-r from-neon-cyan/20 to-neon-purple/20 border border-neon-cyan/50 shadow-neon-cyan"
                  : "hover:bg-slate-800/50 hover:border hover:border-purple-500/20"
              )}
            >
              <Icon
                className={cn(
                  "w-5 h-5 transition-colors",
                  isActive
                    ? "text-neon-cyan"
                    : "text-muted-foreground group-hover:text-neon-purple"
                )}
              />
              <span
                className={cn(
                  "font-medium",
                  isActive
                    ? "text-neon-cyan"
                    : "text-muted-foreground group-hover:text-white"
                )}
              >
                {item.label}
              </span>
              {isActive && (
                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-neon-cyan shadow-neon-cyan animate-glow-pulse" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom gradient accent */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-neon-cyan via-neon-purple to-neon-cyan opacity-50" />
    </div>
  );
}

